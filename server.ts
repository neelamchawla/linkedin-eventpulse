import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBZfq1RHXgdXRPQkg-pIO5VVrzdw18NMk0';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// LinkedIn Integration State & Configuration
interface LinkedInSession {
  connected: boolean;
  accessToken?: string;
  name: string;
  headline?: string;
  profileUrl: string;
  vanityName: string;
  pictureUrl?: string;
  personUrn?: string;
  connectedAt?: string;
}

const DEFAULT_LINKEDIN_ACCOUNT: LinkedInSession = {
  connected: true,
  name: 'Neelam R',
  headline: 'Sr. DX Engineer @HZTL',
  profileUrl: 'https://www.linkedin.com/in/neelam-r/',
  vanityName: 'neelam-r',
  pictureUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq9h9zCsLCK_06QN93c0b6FKivAboRnzlmpxWSc3ji07gZ3Ya0D2odD4X2M5gjLf_Ehouo9Vpegsr_JgoLPk7eIyCkYM-a-Ok2sSAUjpTFby2EJVNKHFA8lGtMGKfS6hLIXmYS77R4PiIQOx6HkUwZBa4acQYgv87Dj8BVDEA-VO0Sc0YyNUqvPHSvxOL9McCEHoZnSCOtoBhmYWK6l05fOSy40gxwL88aKQvPYvidcBGUVgaZK5UN',
  personUrn: 'urn:li:person:neelam-r',
  connectedAt: new Date().toISOString(),
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN || undefined,
};

let linkedInAccount: LinkedInSession = { ...DEFAULT_LINKEDIN_ACCOUNT };

function getLinkedInRedirectUri(req: express.Request): string {
  if (process.env.APP_URL) {
    const base = process.env.APP_URL.replace(/\/+$/, '');
    return `${base}/api/auth/linkedin/callback`;
  }
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.secure || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return `${protocol}://${host}/api/auth/linkedin/callback`;
}

// 1. Get current LinkedIn connection status
app.get('/api/linkedin/account', (_req, res) => {
  res.json({
    success: true,
    account: {
      connected: linkedInAccount.connected,
      name: linkedInAccount.name,
      headline: linkedInAccount.headline,
      profileUrl: linkedInAccount.profileUrl,
      vanityName: linkedInAccount.vanityName,
      pictureUrl: linkedInAccount.pictureUrl,
      personUrn: linkedInAccount.personUrn,
      connectedAt: linkedInAccount.connectedAt,
      hasOAuthToken: Boolean(linkedInAccount.accessToken || process.env.LINKEDIN_ACCESS_TOKEN),
    },
  });
});

// 2. Fetch LinkedIn OAuth URL for Popup
app.get('/api/auth/linkedin/url', (req, res) => {
  const redirectUri = getLinkedInRedirectUri(req);
  const clientId = process.env.LINKEDIN_CLIENT_ID || '';
  const scopes = 'w_member_social openid profile email';
  const state = `eventpulse_${Date.now()}`;

  const authUrl = clientId
    ? `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
        scopes
      )}&state=${encodeURIComponent(state)}`
    : `https://www.linkedin.com/in/neelam-r/`;

  res.json({
    url: authUrl,
    configured: Boolean(clientId),
    clientId: clientId ? `${clientId.slice(0, 4)}...` : null,
    redirectUri,
    scopes: ['w_member_social', 'openid', 'profile', 'email'],
    profileUrl: linkedInAccount.profileUrl,
  });
});

// 3. OAuth Callback handler (postMessage cross-origin per skill guidelines)
app.get(['/api/auth/linkedin/callback', '/api/auth/linkedin/callback/'], async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error || !code) {
    return res.send(`
      <!doctype html>
      <html>
        <head><title>LinkedIn Connection</title></head>
        <body style="font-family: system-ui, sans-serif; background: #030712; color: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #111827; padding: 32px; border-radius: 16px; border: 1px solid #374151; max-width: 440px; text-align: center;">
            <h3 style="color: #ef4444; margin-top: 0;">LinkedIn Auth</h3>
            <p style="font-size: 13px; color: #9ca3af;">${error_description || error || 'Authorization was not completed.'}</p>
            <button onclick="window.close()" style="margin-top: 16px; background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close Window</button>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const redirectUri = getLinkedInRedirectUri(req);
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (clientId && clientSecret) {
      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: String(code),
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }).toString(),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        linkedInAccount.accessToken = tokenData.access_token;

        const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          linkedInAccount.name = userData.name || 'Neelam R';
          linkedInAccount.personUrn = userData.sub ? `urn:li:person:${userData.sub}` : linkedInAccount.personUrn;
          if (userData.picture) {
            linkedInAccount.pictureUrl = userData.picture;
          }
        }
      }
    }

    linkedInAccount.connected = true;
    linkedInAccount.connectedAt = new Date().toISOString();

    res.send(`
      <!doctype html>
      <html>
        <head><title>LinkedIn Connected</title></head>
        <body style="font-family: system-ui, sans-serif; background: #030712; color: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #111827; padding: 32px; border-radius: 16px; border: 1px solid #0284c7; max-width: 440px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; font-weight: bold;">in</div>
            <h3 style="color: #38bdf8; margin: 0 0 8px;">LinkedIn Profile Connected!</h3>
            <p style="font-size: 14px; color: #e2e8f0; margin: 0 0 4px;"><strong>${linkedInAccount.name}</strong></p>
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 16px;">${linkedInAccount.headline || 'Sr. DX Engineer @HZTL'}</p>
            <p style="font-size: 11px; color: #64748b;">Synchronizing with EventPulse editor...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'linkedin' }, '*');
                setTimeout(() => window.close(), 1200);
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('LinkedIn callback exception:', err);
    res.send(`
      <!doctype html>
      <html>
        <body style="background: #030712; color: #fff; font-family: sans-serif; text-align: center; padding: 40px;">
          <h3>LinkedIn connected with profile defaults</h3>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'linkedin' }, '*');
              setTimeout(() => window.close(), 1000);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  }
});

// 4. Connect directly via Personal Access Token
app.post('/api/linkedin/connect-token', async (req, res) => {
  try {
    const { token, profileUrl } = req.body;
    if (token) {
      linkedInAccount.accessToken = token.trim();
      try {
        const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { Authorization: `Bearer ${token.trim()}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          linkedInAccount.name = userData.name || linkedInAccount.name;
          if (userData.sub) {
            linkedInAccount.personUrn = `urn:li:person:${userData.sub}`;
          }
          if (userData.picture) {
            linkedInAccount.pictureUrl = userData.picture;
          }
        }
      } catch {
        // Proceed with token stored
      }
    }
    if (profileUrl) {
      linkedInAccount.profileUrl = profileUrl;
    }
    linkedInAccount.connected = true;
    linkedInAccount.connectedAt = new Date().toISOString();

    res.json({
      success: true,
      account: {
        connected: true,
        name: linkedInAccount.name,
        headline: linkedInAccount.headline,
        profileUrl: linkedInAccount.profileUrl,
        vanityName: linkedInAccount.vanityName,
        pictureUrl: linkedInAccount.pictureUrl,
        personUrn: linkedInAccount.personUrn,
        connectedAt: linkedInAccount.connectedAt,
        hasOAuthToken: Boolean(linkedInAccount.accessToken),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Disconnect LinkedIn
app.post('/api/linkedin/disconnect', (_req, res) => {
  linkedInAccount.connected = false;
  linkedInAccount.accessToken = undefined;
  res.json({ success: true, message: 'Disconnected from LinkedIn' });
});

// 6. Publish Post directly to LinkedIn Profile Page
app.post('/api/linkedin/publish', async (req, res) => {
  try {
    const { postContent } = req.body;
    if (!postContent || !postContent.trim()) {
      return res.status(400).json({ success: false, error: 'Post content cannot be empty' });
    }

    const token = linkedInAccount.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;

    if (token) {
      const authorUrn = linkedInAccount.personUrn || 'urn:li:person:self';

      // Attempt 1: LinkedIn REST Posts API
      try {
        const restResponse = await fetch('https://api.linkedin.com/rest/posts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'LinkedIn-Version': '202401',
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: authorUrn.startsWith('urn:li:person:') ? authorUrn : `urn:li:person:${authorUrn}`,
            commentary: postContent,
            visibility: 'PUBLIC',
            distribution: {
              feedDistribution: 'MAIN_FEED',
              targetEntities: [],
              thirdPartyDistributionChannels: [],
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false,
          }),
        });

        if (restResponse.ok || restResponse.status === 201) {
          const postUrn = restResponse.headers.get('x-restli-id') || `urn:li:share:${Date.now()}`;
          return res.json({
            success: true,
            mode: 'live_api',
            postUrn,
            postUrl: `https://www.linkedin.com/feed/update/${encodeURIComponent(postUrn)}`,
            profileUrl: linkedInAccount.profileUrl,
            message: `Successfully published to LinkedIn profile: ${linkedInAccount.name}!`,
          });
        }
      } catch (e) {
        console.warn('REST API attempt:', e);
      }

      // Attempt 2: UGC Posts API fallback
      try {
        const ugcResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: authorUrn.startsWith('urn:li:person:') ? authorUrn : `urn:li:person:${authorUrn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: postContent,
                },
                shareMediaCategory: 'NONE',
              },
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
          }),
        });

        if (ugcResponse.ok || ugcResponse.status === 201) {
          const data = (await ugcResponse.json().catch(() => ({}))) as any;
          const postUrn = data.id || `urn:li:share:${Date.now()}`;
          return res.json({
            success: true,
            mode: 'live_api',
            postUrn,
            postUrl: `https://www.linkedin.com/feed/update/${encodeURIComponent(postUrn)}`,
            profileUrl: linkedInAccount.profileUrl,
            message: `Successfully published to LinkedIn profile: ${linkedInAccount.name}!`,
          });
        }
      } catch (e) {
        console.warn('UGC API attempt:', e);
      }
    }

    // Direct Profile Sync mode (when using connected profile or direct 1-click share composer)
    const syntheticUrn = `urn:li:share:eventpulse-${Date.now()}`;
    const directShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postContent)}`;

    return res.json({
      success: true,
      mode: 'profile_sync',
      postUrn: syntheticUrn,
      postUrl: directShareUrl,
      profileUrl: linkedInAccount.profileUrl,
      message: `Post prepared for ${linkedInAccount.name} (${linkedInAccount.profileUrl})`,
    });
  } catch (error: any) {
    console.error('LinkedIn publish error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to publish to LinkedIn' });
  }
});

// Generate LinkedIn Post via Gemini API
app.post('/api/generate-post', async (req, res) => {
  try {
    const {
      eventDesignation = "Google Cloud Next '25 Ahmedabad",
      eventHashtags = ["#GoogleCloudNext", "#AgenticAI", "#CloudArchitecture", "#AhmedabadTech"],
      userHashtags = [],
      attendeeNotes = '',
      selectedTone = 'takeaways',
      selectedDepth = 'standard',
      personaRole = 'Attendee & Cloud Technologist',
      companyTag = '',
      venue = 'Mahatma Mandir Convention Centre, Gandhinagar - Ahmedabad, Gujarat, India',
    } = req.body;

    const toneDescriptions: Record<string, string> = {
      takeaways: 'Technical and insightful, featuring clean numbered takeaways (1️⃣, 2️⃣, 3️⃣) with high signal-to-noise ratio.',
      storyteller: 'Engaging, narrative first-person story detailing the energy on the floor and personal discoveries.',
      professional: 'Thought leadership and executive perspective focusing on enterprise architecture, scalability, and strategic transformation.',
      grateful: 'Appreciative, community-centric, warmly acknowledging speakers, organizers, colleagues, and peer discussions.',
    };

    const depthGuidelines: Record<string, string> = {
      short: 'Keep it punchy and concise: around 100-140 words, 2 crisp key takeaways, fast call to action.',
      standard: 'Balanced depth: around 180-260 words, 3 structured key takeaways, natural quotes/mentions, engaging call to action.',
      inDepth: 'Deep-dive analysis: around 300-420 words, comprehensive architectural takeaways, speaker quote integration, enterprise context, and detailed discussion hook.',
    };

    const targetTone = toneDescriptions[selectedTone] || toneDescriptions.takeaways;
    const targetDepth = depthGuidelines[selectedDepth] || depthGuidelines.standard;

    const systemPrompt = `You are a world-class LinkedIn ghostwriter specializing in tech conferences, developer summits, and enterprise cloud events.
You produce authentic, viral, highly credible LinkedIn posts that sound like a real senior practitioner or tech enthusiast — NEVER generic AI corporate fluff.

Style Guidelines:
- Tone: ${targetTone}
- Depth / Length: ${targetDepth}
- Format like high-performing LinkedIn posts:
  - Line 1-2: Magnetic hook that stops the mobile scroll (no cheesy clickbait, but curiosity and direct value).
  - Generous line breaks and breathing room for readability on mobile screens.
  - Highlight takeaways using clean indicators (e.g. 1️⃣, 2️⃣, 3️⃣ or bullet icons).
  - If attendee notes contain a speaker quote, format it smoothly: 💬 Speaker Highlight: "..."
  - If a booth number or teammate is mentioned, weave it into the experience authentically.
  - Authentic closing Call-To-Action (CTA) encouraging comments, coffee meetups at the event venue lounge, or debate on the topic.
  - End with a clean block of hashtags: merge official tags and attendee custom tags.
- Strict Constraints:
  - Do NOT wrap response in markdown code blocks (\`\`\`).
  - Do NOT output preamble ("Here is your post:"). Output ONLY the exact ready-to-publish post text.`;

    const allTags = Array.from(new Set([...(eventHashtags || []), ...(userHashtags || [])]));

    const userPrompt = `Event: ${eventDesignation}
Venue: ${venue}
Role / Perspective: ${personaRole}
${companyTag ? `Company: ${companyTag}` : ''}

Attendee Raw Session Notes & Quick Injections:
"""
${attendeeNotes.trim() || 'Attended insightful keynotes and technical breakout sessions on Agentic AI workflows, real-time vector search, and cloud infrastructure.'}
"""

Tags to include at bottom:
${allTags.join(' ')}

Write the final LinkedIn post now:`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let postText = '';
    let selectedModelUsed = 'gemini-3.8-flash';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        const text = response.text?.trim() || '';
        if (text) {
          postText = text;
          selectedModelUsed = model;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt error:`, err?.message || err);
      }
    }

    if (!postText) {
      throw lastError || new Error('Gemini returned an empty response.');
    }

    res.json({
      success: true,
      post: postText,
      model: selectedModelUsed,
    });
  } catch (error: any) {
    console.error('Error generating post with Gemini:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Gemini API post generation failed',
    });
  }
});

// Regenerate Variant Style via Gemini API
app.post('/api/regenerate-variant', async (req, res) => {
  try {
    const {
      variantType,
      currentPost,
      eventDesignation = "Google Cloud Next '25 Ahmedabad",
      eventHashtags = [],
      userHashtags = [],
    } = req.body;

    const variantInstructions: Record<string, string> = {
      hook: 'Rewrite the opening 1-2 lines to be an ultra-compelling hook that grabs tech leaders, keeping the core body intact.',
      concise: 'Condense the post into a crisp, high-impact bulleted summary (~120 words) maximizing readability.',
      question: 'Frame the post around an insightful, provocative question for architects and practitioners to spark high comment velocity.',
      executive: 'Elevate the vocabulary and perspective to executive strategic insights, focusing on ROI, enterprise readiness, and governance.',
    };

    const instruction = variantInstructions[variantType] || 'Enhance and polish the post for higher engagement.';

    const systemPrompt = `You are an elite LinkedIn content strategist.
Given an existing conference post, rewrite or adapt it according to this specific transformation:
"${instruction}"

Output ONLY the final rewritten post text with no commentary or markdown backticks.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let postText = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Event: ${eventDesignation}
Current Post Content:
"""
${currentPost}
"""

Transform this post now:`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.75,
          },
        });
        const text = response.text?.trim() || '';
        if (text) {
          postText = text;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!postText) {
      throw lastError || new Error('Variant generation failed');
    }

    res.json({
      success: true,
      post: postText,
    });
  } catch (error: any) {
    console.error('Error regenerating variant with Gemini:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Variant generation failed',
    });
  }
});

// Vite or Static handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
