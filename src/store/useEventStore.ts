import { create } from 'zustand';
import {
  NavTab,
  TonePersona,
  PostDepth,
  MediaAttachment,
  LivePost,
  EngagementChampion,
  EventConfig,
  ScheduledQueueItem,
} from '../types';

interface EventStoreState {
  // Navigation & Theme
  currentTab: NavTab;
  setTab: (tab: NavTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeEventName: string;
  setActiveEventName: (name: string) => void;

  // Active Modals
  activeModal: 'guidelines' | 'exportTelemetry' | 'streamInspector' | 'keynoteSlide' | 'speakerLibrary' | 'apiAccess' | null;
  openModal: (modal: 'guidelines' | 'exportTelemetry' | 'streamInspector' | 'keynoteSlide' | 'speakerLibrary' | 'apiAccess') => void;
  closeModal: () => void;

  // Notification Toast
  toast: { message: string; visible: boolean; icon?: string };
  showToast: (message: string, icon?: string) => void;
  hideToast: () => void;

  // Attendee Generator
  attendeeNotes: string;
  setAttendeeNotes: (notes: string) => void;
  selectedTone: TonePersona;
  setSelectedTone: (tone: TonePersona) => void;
  selectedDepth: PostDepth;
  setSelectedDepth: (depth: PostDepth) => void;
  attachments: MediaAttachment[];
  addAttachment: (item: MediaAttachment) => void;
  removeAttachment: (id: string) => void;
  previewView: 'desktop' | 'mobile';
  setPreviewView: (view: 'desktop' | 'mobile') => void;

  // Custom Hashtags in Attendee Studio
  userHashtags: string[];
  addUserHashtags: (tagsInput: string[] | string) => void;
  removeUserHashtag: (tag: string) => void;
  clearUserHashtags: () => void;

  // Post Generation & LinkedIn Preview
  generatedPost: string;
  isGenerating: boolean;
  lastGeneratedAt: number | null;
  generatePost: () => void;
  regenerateWithVariant: (variant: 'shorter' | 'emojis' | 'executive' | 'conversational') => void;
  activePhotoIndex: number;
  setActivePhotoIndex: (index: number) => void;
  
  // LinkedIn Card Interactions
  postMetrics: {
    likes: number;
    comments: number;
    reposts: number;
    userLiked: boolean;
    userReposted: boolean;
  };
  toggleLike: () => void;
  toggleRepost: () => void;
  addComment: (text: string) => void;

  // Scheduling
  scheduledQueue: ScheduledQueueItem[];
  schedulePost: (date: string, time: string) => void;

  // Organizer Dashboard
  eventConfig: EventConfig;
  updateEventConfig: (patch: Partial<EventConfig>) => void;
  addHashtag: (tag: string) => void;
  removeHashtag: (tag: string) => void;
  deployGuidelines: () => void;

  // Live Stream & Telemetry
  livePosts: LivePost[];
  champions: EngagementChampion[];
  telemetry: {
    postsGenerated: number;
    estimatedReach: string;
    attendeeAdoption: number;
    velocityNextMsgs: number;
    velocityPulseMsgs: number;
    brandTagCompliance: number;
  };
}

const INITIAL_ATTACHMENTS: MediaAttachment[] = [
  {
    id: 'att-1',
    name: 'IMG_4910_Keynote.jpg',
    size: '3.4 MB',
    category: 'Keynote Stage',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIXVAOqd-i50n45aeCJmyIs0Q4-TSCg2EJA2oZHZLS7WVmdQv-ViwMHlRe4yCvFWqSEqbM_jy4sqZJ6GnkpzVA7PR32uZ6JMT2fth4vcW7fZXA-acKFqgoYuX5A1HudtF_5FvfInzDQ6XCRhXdhkFXPcg957WhhiuQ0hTQqdrfwO--f4UpLpyil_hzGObCm3CoCuOV3i3VXzzZIdosM-L8YJUH1HgF53-tpKSmL77O3IBzEAyWD_I1',
    altText: 'Dynamic high-tech keynote stage at Google Cloud Next with female tech executive presenting',
  },
  {
    id: 'att-2',
    name: 'IMG_4918_Lounge.jpg',
    size: '2.8 MB',
    category: 'Networking Pavilion',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZkVzeQlFBC4V8z2MOf0LArchacZVWaZ57FfEXqMEpavvnbUduuJRjZrRktPox2TzAokHOVXocYWR5qxGnGz0J5YScIqfBlJfOrFMKh3YGfjCCnXXu75BfrtcafP0ZG9zVQxJThBgs_KAleyF_seHiYZIlKSq-B7dHnNo3TtjQ9M7H9E6-r4AtXgCf50njTh7Xmlgyl6nt51zvNk4ksbspnUqctwG-F9Yl56sEforxgsE8VrCmrZGg',
    altText: 'Group of diverse tech professionals mingling with coffee cups at conference networking pavilion',
  },
];

const INITIAL_LIVE_POSTS: LivePost[] = [
  {
    id: 'live-1',
    author: 'Neelam R',
    role: 'Sr. DX Engineer @HZTL',
    initials: 'NR',
    timeAgo: '2m ago',
    content: 'Keynote takeaways on agentic loops: the transition from static LLM queries to autonomous tool orchestration is happening faster than predicted. Excited to see how GCP Vertex anchors this...',
    status: 'shared',
    tagsCount: 4,
    tags: ['#GoogleCloudNext', '#GenerativeAI', '#CloudDev', '#EventPulse'],
    likes: 142,
    comments: 28,
    reposts: 14,
  },
  {
    id: 'live-2',
    author: 'Marcus Chen',
    role: 'Distinguished Engineer, Veloce Systems',
    initials: 'MC',
    timeAgo: '14m ago',
    content: 'Incredible conversations at the Cloud Architecture pavilion. The new high-throughput networking benchmarks showcased this morning redefine how we handle hybrid cloud failovers.',
    status: 'scheduled',
    scheduledTime: '5:00 PM IST',
    tagsCount: 3,
    tags: ['#GoogleCloudNext', '#CloudDev', '#EventPulse'],
    likes: 67,
    comments: 11,
    reposts: 8,
  },
  {
    id: 'live-3',
    author: 'Elena Rostova',
    role: 'Head of DevOps, Apex Cloud Labs',
    initials: 'ER',
    timeAgo: '32m ago',
    content: 'Hands-on workshop completed for Kubernetes clusters across regions with zero telemetry downtime. Great hands-on guidance from the Google engineering specialists.',
    status: 'shared',
    tagsCount: 5,
    tags: ['#GoogleCloudNext', '#GenerativeAI', '#CloudDev', '#Kubernetes', '#EventPulse'],
    likes: 89,
    comments: 19,
    reposts: 5,
  },
];

const INITIAL_CHAMPIONS: EngagementChampion[] = [
  {
    rank: 1,
    name: 'David K. Thorne',
    role: 'Chief Technologist · 6 Posts',
    postsCount: 6,
    impressions: '184.2k',
  },
  {
    rank: 2,
    name: 'Amina Al-Mansoor',
    role: 'Principal Architect · 4 Posts',
    postsCount: 4,
    impressions: '142.9k',
  },
  {
    rank: 3,
    name: 'Julian Meyer',
    role: 'Developer Advocate · 5 Posts',
    postsCount: 5,
    impressions: '96.4k',
  },
];

const DEFAULT_POST_TEXT = `Three game-changing takeaways from Day 1 at #GoogleCloudNext '25 in Ahmedabad, Gujarat, India 🚀

1️⃣ Enterprise AI is shifting from experimentation to autonomous agentic loops with grounded reasoning engines.
2️⃣ Context window expansion is fundamentally altering how enterprise teams ingest multi-terabyte system telemetry and logs in real-time.
3️⃣ The developer energy at Mahatma Mandir is electric — human connection and real-world implementation are what truly push tech forward.

Huge thanks to @Google Cloud and the entire organizing team for curating such an unforgettable kickoff!

Drop a comment if you're here in Ahmedabad — let's connect and grab a coffee at the innovation pavilion! ☕👇

#GoogleCloudNext #GenerativeAI #CloudArchitecture #EventPulse #AhmedabadTech`;

export const useEventStore = create<EventStoreState>((set, get) => ({
  // Navigation & Theme
  currentTab: 'attendee-generator',
  setTab: (tab) => set({ currentTab: tab }),
  theme: 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },
  activeEventName: "Google Cloud Next '25 Ahmedabad",
  setActiveEventName: (name) => set({ activeEventName: name }),

  // Modals
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  // Toast
  toast: { message: '', visible: false },
  showToast: (message, icon = 'check_circle') => {
    set({ toast: { message, visible: true, icon } });
    setTimeout(() => {
      set({ toast: { message: '', visible: false } });
    }, 3800);
  },
  hideToast: () => set({ toast: { message: '', visible: false } }),

  // Attendee Input
  attendeeNotes: "Attended Thomas Kurian's keynote on agentic workflows and multimodal architectures. Met incredible builders from the developer ecosystem exploring enterprise deployment in Ahmedabad, Gujarat, India!",
  setAttendeeNotes: (notes) => set({ attendeeNotes: notes }),
  selectedTone: 'takeaways',
  setSelectedTone: (tone) => set({ selectedTone: tone }),
  selectedDepth: 'standard',
  setSelectedDepth: (depth) => set({ selectedDepth: depth }),
  attachments: INITIAL_ATTACHMENTS,
  addAttachment: (item) => set((state) => ({ attachments: [...state.attachments, item] })),
  removeAttachment: (id) => set((state) => ({ attachments: state.attachments.filter((a) => a.id !== id) })),
  previewView: 'desktop',
  setPreviewView: (view) => set({ previewView: view }),

  // Custom Hashtags in Attendee Studio
  userHashtags: ['#GoogleCloudNext', '#GenerativeAI', '#CloudArchitecture', '#AhmedabadTech'],
  addUserHashtags: (tagsInput) => {
    let rawTags: string[] = [];
    if (Array.isArray(tagsInput)) {
      rawTags = tagsInput;
    } else {
      rawTags = tagsInput
        .replace(/[,;]/g, ' ')
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const formatted = rawTags
      .map((t) => {
        let tag = t.trim();
        if (!tag) return '';
        if (!tag.startsWith('#')) tag = '#' + tag;
        // Keep valid hashtag characters
        tag = '#' + tag.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
        return tag;
      })
      .filter((t) => t.length > 1);

    if (formatted.length === 0) return;

    let addedCount = 0;
    set((state) => {
      const existingLower = new Set(state.userHashtags.map((t) => t.toLowerCase()));
      const updated = [...state.userHashtags];
      formatted.forEach((tag) => {
        if (!existingLower.has(tag.toLowerCase())) {
          existingLower.add(tag.toLowerCase());
          updated.push(tag);
          addedCount++;
        }
      });
      return { userHashtags: updated };
    });

    if (addedCount > 0) {
      get().showToast(`Added ${addedCount} hashtag${addedCount > 1 ? 's' : ''}!`);
    } else {
      get().showToast('Hashtag(s) already added');
    }
  },
  removeUserHashtag: (tag) => {
    set((state) => ({
      userHashtags: state.userHashtags.filter((t) => t.toLowerCase() !== tag.toLowerCase()),
    }));
  },
  clearUserHashtags: () => {
    set({ userHashtags: [] });
    get().showToast('Cleared all custom hashtags');
  },

  // Generated Post State
  generatedPost: DEFAULT_POST_TEXT,
  isGenerating: false,
  activePhotoIndex: 0,
  setActivePhotoIndex: (index) => set({ activePhotoIndex: index }),

  lastGeneratedAt: null as number | null,

  generatePost: async () => {
    set({ isGenerating: true });
    const { attendeeNotes, selectedTone, selectedDepth, eventConfig, userHashtags, attachments, activeEventName } = get();

    // 1. Try Gemini API via backend proxy
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventDesignation: eventConfig.designation,
          eventHashtags: eventConfig.hashtags,
          userHashtags,
          attendeeNotes,
          selectedTone,
          selectedDepth,
          personaRole: 'Sr. DX Engineer @HZTL',
          companyTag: 'Google Cloud',
          venue: eventConfig.venue,
          activeEventName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.post) {
          const allTags = Array.from(new Set([...userHashtags, ...eventConfig.hashtags]));
          let finalPost = data.post;
          
          if (attachments && attachments.length > 0 && !finalPost.includes('📸')) {
            const parts = finalPost.split('\n\n');
            const lastPart = parts[parts.length - 1];
            if (lastPart.startsWith('#')) {
              parts.splice(parts.length - 1, 0, '📸 (Photos attached from today\'s keynote & exhibition lounge)');
              finalPost = parts.join('\n\n');
            } else {
              finalPost += '\n\n📸 (Photos attached from today\'s keynote & exhibition lounge)';
            }
          }

          const newLiveItem: LivePost = {
            id: `user-post-${Date.now()}`,
            author: 'Neelam R',
            role: 'Sr. DX Engineer @HZTL',
            initials: 'NR',
            timeAgo: 'Just now',
            content: finalPost.slice(0, 180) + '...',
            status: 'shared',
            tagsCount: allTags.length,
            tags: allTags,
            likes: 1,
            comments: 0,
            reposts: 0,
            isCustom: true,
          };

          set((state) => ({
            generatedPost: finalPost,
            isGenerating: false,
            lastGeneratedAt: Date.now(),
            activePhotoIndex: 0,
            livePosts: [newLiveItem, ...state.livePosts],
            telemetry: {
              ...state.telemetry,
              postsGenerated: state.telemetry.postsGenerated + 1,
            },
          }));

          get().showToast(`✨ Real-time post generated with Gemini 3.8 Flash!`);
          return;
        }
      }
    } catch (apiError) {
      console.warn('Gemini API fetch error, switching to local synthesis engine:', apiError);
    }

    // 2. Intelligent local fallback if offline or backend unavailable
    setTimeout(() => {
      const rawNotes = attendeeNotes.trim();
      const lines = rawNotes ? rawNotes.split('\n').map((l) => l.trim()).filter(Boolean) : [];

      const customQuotes: string[] = [];
      const boothMentions: string[] = [];
      const teammateMentions: string[] = [];
      const coffeeSnippets: string[] = [];
      const coreInsights: string[] = [];

      lines.forEach((line) => {
        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
        if (/speaker quote:/i.test(clean) || (clean.startsWith('"') && clean.endsWith('"') && clean.length > 5)) {
          const qText = clean.replace(/speaker quote:\s*"?/i, '').replace(/"?$/, '').trim();
          if (qText) customQuotes.push(qText);
        } else if (/booth\s*#?/i.test(clean) || /developer sandbox/i.test(clean)) {
          boothMentions.push(clean);
        } else if (/@\w+/i.test(clean) || /teammate/i.test(clean) || /brainstorming with/i.test(clean)) {
          teammateMentions.push(clean);
        } else if (/coffee/i.test(clean) || /free to connect/i.test(clean) || /meet\s*up/i.test(clean)) {
          coffeeSnippets.push(clean);
        } else if (clean.length > 0) {
          coreInsights.push(clean);
        }
      });

      const city = "Ahmedabad, Gujarat, India";
      const venueShort = "Mahatma Mandir";
      const eventTag = eventConfig.designation.replace(/[^a-zA-Z0-9]/g, '');

      let titleHook = `Three game-changing takeaways from Day 1 at #${eventTag} in ${city} 🚀`;
      let middleSection = '';
      let ctaSection = `Drop a comment if you're here in Ahmedabad — let's connect and grab a coffee at the innovation pavilion! ☕👇`;

      // 1. TONE-BASED GENERATION
      if (selectedTone === 'takeaways') {
        titleHook = `Key takeaways and ground-level insights from #${eventTag} in ${city} 💡`;
        
        const pointsList: string[] = [];
        if (coreInsights.length > 0) {
          coreInsights.slice(0, 3).forEach((insight, idx) => {
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
            const bulletEmoji = emojis[idx] || '🔹';
            if (insight.length < 50 && idx === 0) {
              pointsList.push(`${bulletEmoji} ${insight} — Autonomous agentic loops with grounded reasoning engines are redefining software delivery.`);
            } else if (insight.length < 50 && idx === 1) {
              pointsList.push(`${bulletEmoji} ${insight} — Context window expansion is fundamentally altering telemetry ingest in real-time.`);
            } else {
              pointsList.push(`${bulletEmoji} ${insight}`);
            }
          });
        } else {
          pointsList.push(`1️⃣ Enterprise AI is shifting from experimentation to autonomous agentic loops with grounded reasoning engines.`);
          pointsList.push(`2️⃣ Context window expansion is fundamentally altering how enterprise teams ingest multi-terabyte system telemetry and logs in real-time.`);
          pointsList.push(`3️⃣ The developer energy at ${venueShort} is electric — human connection and real-world implementation are what truly push tech forward.`);
        }

        if (customQuotes.length > 0) {
          pointsList.push(`💬 Speaker Highlight: "${customQuotes[0]}"`);
        }
        if (boothMentions.length > 0) {
          pointsList.push(`📍 Floor Check-in: ${boothMentions[0]}`);
        }
        if (teammateMentions.length > 0) {
          pointsList.push(`🤝 Collaboration: ${teammateMentions[0]}`);
        }

        middleSection = pointsList.join('\n\n');

        if (coffeeSnippets.length > 0) {
          ctaSection = `${coffeeSnippets[0]} Drop a comment or connect with me if you're at the summit today! ☕👇`;
        } else {
          ctaSection = `Drop a comment if you're here in Ahmedabad — let's connect and grab a coffee at the innovation pavilion! ☕👇`;
        }

      } else if (selectedTone === 'professional') {
        titleHook = `Executive Briefing: Strategic takeaways from ${eventConfig.designation} (${city}) 💼`;

        const profBullets: string[] = [];
        profBullets.push(`Today's keynote sessions and architectural tracks highlighted several pivotal enterprise technology transitions:`);
        
        if (coreInsights.length > 0) {
          profBullets.push(`• Core Focus: ${coreInsights[0]}`);
          if (coreInsights[1]) profBullets.push(`• Infrastructure Impact: ${coreInsights[1]}`);
          if (coreInsights[2]) profBullets.push(`• Ecosystem Adoption: ${coreInsights[2]}`);
        } else {
          profBullets.push(`• Architecture Shift: Monolithic query structures are giving way to orchestrated agent pipelines with verifiable guardrails.`);
          profBullets.push(`• Observability: Deep vector telemetry and dynamic context retrieval ensure high-uptime resilience.`);
          profBullets.push(`• ROI & Implementation: Grounded domain models are driving measurable acceleration across scale-out infrastructures.`);
        }

        if (customQuotes.length > 0) {
          profBullets.push(`• Leadership Perspective: "${customQuotes[0]}"`);
        }
        if (boothMentions.length > 0 || teammateMentions.length > 0) {
          profBullets.push(`• Ground Partnerships: ${[...boothMentions, ...teammateMentions].join(' | ')}`);
        }

        middleSection = profBullets.join('\n\n');
        ctaSection = `Connecting with infrastructure and engineering leaders throughout the week in Ahmedabad. What architectural priorities are defining your roadmap this year?`;

      } else if (selectedTone === 'grateful') {
        titleHook = `Incredible Day 1 at ${eventConfig.designation} surrounded by such an inspiring developer community! 🙏✨`;

        const gratefulLines: string[] = [];
        gratefulLines.push(`Grateful to witness groundbreaking updates and connect with engineers tackling hard problems in production cloud and AI.`);
        
        if (coreInsights.length > 0) {
          gratefulLines.push(`Personal highlight from the sessions: "${coreInsights.join(' · ')}"`);
        } else {
          gratefulLines.push(`From the high-energy keynote to quiet technical deep dives at ${venueShort}, the spirit of open collaboration is contagious.`);
        }

        if (customQuotes.length > 0) {
          gratefulLines.push(`A quote that resonated deeply: "${customQuotes[0]}"`);
        }
        if (teammateMentions.length > 0) {
          gratefulLines.push(`Wonderful to collaborate on the ground with ${teammateMentions[0]}.`);
        }
        if (boothMentions.length > 0) {
          gratefulLines.push(`So glad I stopped by ${boothMentions[0]}!`);
        }

        middleSection = gratefulLines.join('\n\n');

        if (coffeeSnippets.length > 0) {
          ctaSection = `${coffeeSnippets[0]} Let's say hello in person! A huge thank you to ${eventConfig.officialHandle} and the entire organizing team for hosting this experience. ❤️`;
        } else {
          ctaSection = `A huge thank you to ${eventConfig.officialHandle} and the entire organizing team for hosting this experience. Drop a comment if you're around—would love to say hello! ☕👇`;
        }

      } else if (selectedTone === 'storyteller') {
        titleHook = `What happens when thousands of engineers and architects gather under one roof in ${city}? 🌟`;

        const storyParts: string[] = [];
        storyParts.push(`Standing in the keynote hall at ${venueShort} this morning watching live agent orchestration demos felt like a pivotal shift. Beyond the slides and product reveals, the most inspiring conversations happened between sessions—standing over coffee, sketching distributed workflows on napkins.`);

        if (coreInsights.length > 0) {
          storyParts.push(`My standout takeaway: ${coreInsights.join(' ')}`);
        } else {
          storyParts.push(`Real innovation isn't just about compute power; it's about engineers and domain practitioners solving friction together in real-time.`);
        }

        if (customQuotes.length > 0) {
          storyParts.push(`As someone said during the keynote: "${customQuotes[0]}" — and that captures the spirit of this entire summit.`);
        }
        if (boothMentions.length > 0) {
          storyParts.push(`Spent time checking out ${boothMentions[0]}—hands-on prototyping with live sandbox clusters made all the difference.`);
        }
        if (teammateMentions.length > 0) {
          storyParts.push(`Always energizing to brainstorm alongside ${teammateMentions[0]}.`);
        }

        middleSection = storyParts.join('\n\n');

        if (coffeeSnippets.length > 0) {
          ctaSection = `${coffeeSnippets[0]} Let's grab coffee and talk shop! ☕ What was your standout moment from today? 👇`;
        } else {
          ctaSection = `If you're roaming ${venueShort} Hall 2 or the Grand Atrium, let's grab coffee and talk distributed agents! ☕ What was your standout moment from today? 👇`;
        }
      }

      // 2. DEPTH ADAPTATION
      if (selectedDepth === 'short') {
        const linesArr = middleSection.split('\n\n');
        middleSection = linesArr.slice(0, 2).join('\n\n');
      } else if (selectedDepth === 'deep') {
        middleSection += `\n\n🔍 Architecture Deep-Dive: Enterprise teams are transitioning away from monolithic prompt pipelines toward multi-agent topologies with deterministic tool governance and stateful rollbacks.\n\n💡 Pro tip for attendees: Don't miss the hands-on labs at ${eventConfig.venue} for live cluster benchmarks.`;
      }

      // 3. COMBINE HASHTAGS
      const allTags = Array.from(new Set([...userHashtags, ...eventConfig.hashtags]));
      const tagsLine = allTags.join(' ');

      // 4. PHOTO REFERENCE IF ATTACHMENTS
      let mediaRef = '';
      if (attachments && attachments.length > 0) {
        mediaRef = `\n\n📸 (Photos attached from today's keynote & exhibition lounge)`;
      }

      const newPost = `${titleHook}\n\n${middleSection}\n\n${ctaSection}${mediaRef}\n\n${tagsLine}`;

      // Update live feed in organizer dashboard
      const newLiveItem: LivePost = {
        id: `user-post-${Date.now()}`,
        author: 'Neelam R',
        role: 'Sr. DX Engineer @HZTL',
        initials: 'NR',
        timeAgo: 'Just now',
        content: newPost.slice(0, 180) + '...',
        status: 'shared',
        tagsCount: allTags.length,
        tags: allTags,
        likes: 1,
        comments: 0,
        reposts: 0,
        isCustom: true,
      };

      set((state) => ({
        generatedPost: newPost,
        isGenerating: false,
        lastGeneratedAt: Date.now(),
        activePhotoIndex: 0,
        livePosts: [newLiveItem, ...state.livePosts],
        telemetry: {
          ...state.telemetry,
          postsGenerated: state.telemetry.postsGenerated + 1,
        },
      }));

      get().showToast(`✨ Generated post with ${selectedTone} tone & session highlights!`);
    }, 800);
  },

  regenerateWithVariant: async (variant) => {
    set({ isGenerating: true });
    const { generatedPost, eventConfig, userHashtags } = get();

    try {
      const response = await fetch('/api/regenerate-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantType: variant === 'shorter' ? 'concise' : variant === 'executive' ? 'executive' : variant === 'conversational' ? 'question' : 'hook',
          currentPost: generatedPost,
          eventDesignation: eventConfig.designation,
          eventHashtags: eventConfig.hashtags,
          userHashtags,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.post) {
          set({
            generatedPost: data.post,
            isGenerating: false,
            lastGeneratedAt: Date.now(),
          });
          get().showToast(`✨ Regenerated ${variant} variant with Gemini 3.8 Flash!`);
          return;
        }
      }
    } catch (err) {
      console.warn('Gemini variant regeneration failed, falling back:', err);
    }

    const allTags = Array.from(new Set([...userHashtags, ...eventConfig.hashtags])).join(' ');
    let updated = generatedPost;
    if (variant === 'shorter') {
      const parts = generatedPost.split('\n\n');
      updated = parts.slice(0, 3).join('\n\n') + '\n\n' + allTags;
    } else if (variant === 'emojis') {
      updated = generatedPost.replace(/\n/g, ' ⚡\n').replace(/takeaways/gi, 'takeaways 💡🔥');
    } else if (variant === 'executive') {
      updated = `Executive Briefing: ${eventConfig.designation}\n\nHigh-density strategic summaries on cloud compute, multi-agent frameworks, and governance from today's keynotes.\n\nKey finding: Autonomous agent workflows are yielding 3x acceleration in operational triage.\n\n${allTags}`;
    } else if (variant === 'conversational') {
      updated = `So many great conversations at ${eventConfig.designation} today! 👋\n\nLoved catching the keynote insights and trading notes with folks from across the tech community. Are you here in Ahmedabad? Let's meet up at the lounge!\n\n${allTags}`;
    }
    set({ generatedPost: updated, isGenerating: false, lastGeneratedAt: Date.now() });
    get().showToast(`✨ Generated ${variant} variant of post!`);
  },

  // LinkedIn Metrics & Social Simulation
  postMetrics: {
    likes: 142,
    comments: 28,
    reposts: 14,
    userLiked: false,
    userReposted: false,
  },
  toggleLike: () => {
    set((state) => {
      const isLiked = state.postMetrics.userLiked;
      return {
        postMetrics: {
          ...state.postMetrics,
          userLiked: !isLiked,
          likes: isLiked ? state.postMetrics.likes - 1 : state.postMetrics.likes + 1,
        },
      };
    });
  },
  toggleRepost: () => {
    set((state) => {
      const isReposted = state.postMetrics.userReposted;
      return {
        postMetrics: {
          ...state.postMetrics,
          userReposted: !isReposted,
          reposts: isReposted ? state.postMetrics.reposts - 1 : state.postMetrics.reposts + 1,
        },
      };
    });
    get().showToast(get().postMetrics.userReposted ? 'Reposted to your LinkedIn network! 🚀' : 'Removed repost');
  },
  addComment: (text) => {
    if (!text.trim()) return;
    set((state) => ({
      postMetrics: {
        ...state.postMetrics,
        comments: state.postMetrics.comments + 1,
      },
    }));
    get().showToast('Comment posted to LinkedIn thread!');
  },

  // Scheduling
  scheduledQueue: [],
  schedulePost: (date, time) => {
    const { generatedPost, eventConfig } = get();
    const newItem: ScheduledQueueItem = {
      id: `queue-${Date.now()}`,
      content: generatedPost,
      date,
      time,
      tags: eventConfig.hashtags,
      status: 'queued',
    };
    set((state) => ({
      scheduledQueue: [newItem, ...state.scheduledQueue],
    }));
    get().showToast(`🚀 Successfully scheduled to Buffer & LinkedIn for ${date}, ${time} IST!`);
  },

  // Event Config & Guardrails
  eventConfig: {
    id: 'gcloud-next-25',
    designation: "Google Cloud Next '25",
    hostOrg: 'Google Cloud Events & Developer Relations',
    timeframe: 'Oct 24 - 26, 2025',
    venue: 'Mahatma Mandir Convention Centre, Gandhinagar - Ahmedabad, Gujarat, India',
    hashtags: ['#GoogleCloudNext', '#GenerativeAI', '#CloudDev', '#EventPulse', '#AhmedabadTech'],
    linkedinOrg: 'google-cloud',
    officialHandle: '@GoogleCloud',
    resourceUrl: 'cloud.google.com/next',
    masterDirective:
      'Emphasize day 2 agentic AI architecture breakthroughs and encourage attendees to schedule tech consults at the Developer Sandbox (Mahatma Mandir Hall 2, Level 2). Always inject an authentic, collegial tone while eliminating generic AI boilerplate.',
    lastSyncedText: 'Synchronized 18 seconds ago',
  },
  updateEventConfig: (patch) => {
    set((state) => ({
      eventConfig: { ...state.eventConfig, ...patch },
    }));
  },
  addHashtag: (tag) => {
    let clean = tag.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    set((state) => {
      if (state.eventConfig.hashtags.includes(clean)) return state;
      return {
        eventConfig: {
          ...state.eventConfig,
          hashtags: [...state.eventConfig.hashtags, clean],
        },
      };
    });
  },
  removeHashtag: (tag) => {
    set((state) => ({
      eventConfig: {
        ...state.eventConfig,
        hashtags: state.eventConfig.hashtags.filter((t) => t !== tag),
      },
    }));
  },
  deployGuidelines: () => {
    set((state) => ({
      eventConfig: {
        ...state.eventConfig,
        lastSyncedText: 'Synchronized just now',
      },
    }));
    get().showToast('✅ Deployed master AI guardrails and hashtags to all 4,120 active attendees!');
  },

  // Telemetry & Feeds
  livePosts: INITIAL_LIVE_POSTS,
  champions: INITIAL_CHAMPIONS,
  telemetry: {
    postsGenerated: 1428,
    estimatedReach: '2.84M',
    attendeeAdoption: 68.2,
    velocityNextMsgs: 982,
    velocityPulseMsgs: 614,
    brandTagCompliance: 98.4,
  },
}));
