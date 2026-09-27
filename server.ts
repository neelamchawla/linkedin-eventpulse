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
