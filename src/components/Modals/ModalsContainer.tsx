import React, { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';

export const ModalsContainer: React.FC = () => {
  const {
    activeModal,
    closeModal,
    eventConfig,
    livePosts,
    showToast,
    setAttendeeNotes,
    attendeeNotes,
    telemetry,
  } = useEventStore();

  const [streamSearch, setStreamSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState<'all' | 'shared' | 'scheduled'>('all');

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* 1. EVENT GUIDELINES MODAL */}
      {activeModal === 'guidelines' && (
        <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">policy</span>
              <h2 className="text-lg font-semibold text-on-surface">Event & Social Guidelines</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-on-surface-variant">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 space-y-1">
              <h3 className="font-semibold text-on-surface">Official Brand Anchors</h3>
              <p>Canonical Event Name: <strong>{eventConfig.designation}</strong></p>
              <p>Primary Hashtags: <span className="font-mono text-primary">{eventConfig.hashtags.join(' ')}</span></p>
              <p>Official Mention: <span className="font-mono text-secondary">{eventConfig.officialHandle}</span></p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-on-surface">Content Best Practices</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Focus on actionable engineering takeaways over generic PR statements.</li>
                <li>Tag speakers, booth numbers, and demo stations to improve discovery in Ahmedabad.</li>
                <li>Respect NDA sessions (Mahatma Mandir Level 3 partner roundtables are strictly off-the-record).</li>
                <li>When sharing benchmark graphs, include attribution to the presenting team.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-on-surface">Live Moderation & Compliance</h3>
              <p>
                All posts generated through the EventPulse attendee portal automatically adhere to the host organization's AI guardrails and brand safety policies.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-mono font-medium hover:bg-inverse-primary transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPORT TELEMETRY MODAL */}
      {activeModal === 'exportTelemetry' && (
        <div className="relative w-full max-w-lg rounded-2xl bg-surface-container p-6 shadow-2xl border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">download</span>
              <h2 className="text-lg font-semibold text-on-surface">Export Telemetry & Stream</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <p className="text-xs text-on-surface-variant">
            Generate sanitized, export-ready datasets for marketing attribution, sponsor reporting, and executive retrospectives.
          </p>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => {
                showToast('Downloaded attendee_posts_day2.csv (1,428 rows)');
                closeModal();
              }}
              className="w-full p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-semibold text-on-surface block">CSV Feed (All Posts & Tags)</span>
                <span className="text-[11px] text-outline">Author, Timestamp, Text, Reactions, Reach, Tags</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-base">table_view</span>
            </button>

            <button
              onClick={() => {
                showToast('Downloaded telemetry_report_summary.json');
                closeModal();
              }}
              className="w-full p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-semibold text-on-surface block">JSON Telemetry Aggregate</span>
                <span className="text-[11px] text-outline">Velocity metrics, hourly histograms, viral coefficient</span>
              </div>
              <span className="material-symbols-outlined text-primary text-base">code</span>
            </button>

            <button
              onClick={() => {
                showToast('Executive slide deck summary generated (PDF)!');
                closeModal();
              }}
              className="w-full p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-semibold text-on-surface block">Executive 1-Pager PDF</span>
                <span className="text-[11px] text-outline">Formatted slide deck with charts and top champion leaderboard</span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-base">picture_as_pdf</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. FULL STREAM INSPECTOR MODAL */}
      {activeModal === 'streamInspector' && (
        <div className="relative w-full max-w-3xl rounded-2xl bg-surface-container p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">stream</span>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">Full Live Post Inspector</h2>
                <p className="text-xs text-on-surface-variant">
                  Monitoring {telemetry.postsGenerated.toLocaleString()} posts across Mahatma Mandir Convention Centre, Ahmedabad
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-outline pointer-events-none">
                <span className="material-symbols-outlined text-base">search</span>
              </span>
              <input
                type="text"
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
                placeholder="Search author, keyword, or tag..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="inline-flex p-1 rounded-lg bg-surface-container-low border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setStreamFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  streamFilter === 'all'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStreamFilter('shared')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  streamFilter === 'shared'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Shared
              </button>
              <button
                type="button"
                onClick={() => setStreamFilter('scheduled')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  streamFilter === 'scheduled'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Scheduled
              </button>
            </div>
          </div>

          {/* Scrollable Feed List */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1">
            {livePosts
              .filter((p) => {
                if (streamFilter !== 'all' && p.status !== streamFilter) return false;
                if (!streamSearch) return true;
                const q = streamSearch.toLowerCase();
                return (
                  p.author.toLowerCase().includes(q) ||
                  p.content.toLowerCase().includes(q) ||
                  p.tags.some((t) => t.toLowerCase().includes(q))
                );
              })
              .map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2 hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-mono text-xs font-bold text-primary">
                        {post.initials}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-on-surface">{post.author}</span>
                        <span className="block text-[11px] text-outline font-mono">{post.role}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-outline">{post.timeAgo}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    "{post.content}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-outline-variant/10 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      {post.tags.map((t) => (
                        <span key={t} className="text-primary hover:underline cursor-pointer">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-outline">
                      <span>👍 {post.likes}</span>
                      <span>💬 {post.comments}</span>
                      <span>🔁 {post.reposts}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. KEYNOTE SLIDE PROJECTOR MODAL */}
      {activeModal === 'keynoteSlide' && (
        <div className="relative w-full max-w-4xl rounded-2xl bg-surface-container-lowest p-8 shadow-2xl border border-secondary/40 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-mono uppercase tracking-wider">
              Keynote Projector Intermission Mode (16:9)
            </span>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#0c0d11] via-[#131722] to-[#0a1829] p-8 flex items-center justify-between border border-outline-variant/40 shadow-inner overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-md z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                  Stage Live Ghostwriter
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Share Your {eventConfig.designation} Insights on LinkedIn
              </h2>
              <p className="text-sm text-neutral-300">
                Scan the QR code with your phone camera to open the instant attendee post generator with curated session hooks and hashtags!
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-mono text-secondary">
                  eventpulse.ai/p/gcloud-next-25
                </div>
                <span className="text-xs text-neutral-400">#GoogleCloudNext</span>
              </div>
            </div>

            {/* Giant Stage QR Code */}
            <div className="relative z-10 bg-white p-5 rounded-2xl shadow-2xl flex flex-col items-center">
              <svg className="w-48 h-48 text-black" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="5" y="5" />
                <rect fill="currentColor" height="14" rx="1" width="14" x="12" y="12" />
                <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="67" y="5" />
                <rect fill="currentColor" height="14" rx="1" width="14" x="74" y="12" />
                <rect fill="none" height="28" rx="2" stroke="currentColor" strokeWidth="4" width="28" x="5" y="67" />
                <rect fill="currentColor" height="14" rx="1" width="14" x="12" y="74" />
                <rect height="8" rx="1" width="8" x="40" y="8" />
                <rect height="6" rx="1" width="6" x="52" y="14" />
                <rect height="6" rx="1" width="18" x="40" y="24" />
                <rect height="6" rx="1" width="14" x="10" y="42" />
                <rect height="14" rx="1" width="6" x="30" y="38" />
                <rect className="text-cyan-600" height="12" rx="1" width="12" x="44" y="38" />
                <rect height="6" rx="1" width="10" x="64" y="42" />
                <rect height="16" rx="1" width="8" x="82" y="40" />
                <rect height="10" rx="1" width="8" x="40" y="58" />
                <rect height="6" rx="1" width="14" x="54" y="56" />
                <rect height="6" rx="1" width="14" x="76" y="66" />
                <rect height="14" rx="1" width="6" x="42" y="76" />
                <rect height="8" rx="1" width="8" x="56" y="72" />
                <rect height="10" rx="1" width="18" x="70" y="80" />
              </svg>
              <span className="font-mono text-xs text-black font-semibold mt-2">
                SCAN TO DRAFT POST
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                showToast('Keynote 16:9 projection SVG downloaded!');
                closeModal();
              }}
              className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-mono transition-colors cursor-pointer"
            >
              Download SVG
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-mono font-medium hover:bg-inverse-primary transition-colors cursor-pointer"
            >
              Close Presentation
            </button>
          </div>
        </div>
      )}

      {/* 5. SPEAKER LIBRARY MODAL */}
      {activeModal === 'speakerLibrary' && (
        <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container p-6 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">record_voice_over</span>
              <h2 className="text-lg font-semibold text-on-surface">Keynote & Session Speaker Library</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <p className="text-xs text-on-surface-variant">
            Click any approved keynote quote to inject it directly into your post generation prompt.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-on-surface">Thomas Kurian</span>
                  <span className="text-[11px] text-outline font-mono ml-2">CEO, Google Cloud</span>
                </div>
                <button
                  onClick={() => {
                    setAttendeeNotes(`${attendeeNotes}\n• Thomas Kurian: "We are moving from generative experimentation to scalable autonomous multi-agent loops."`);
                    showToast('Injected quote into notes!');
                    closeModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-highest hover:bg-primary-container hover:text-white text-secondary font-mono text-[11px] transition-colors cursor-pointer"
                >
                  + Inject Quote
                </button>
              </div>
              <p className="text-on-surface-variant italic">
                "We are moving from generative experimentation to scalable autonomous multi-agent loops across enterprise data estates."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-on-surface">Amin Vahdat</span>
                  <span className="text-[11px] text-outline font-mono ml-2">Fellow & VP, Systems & Infrastructure</span>
                </div>
                <button
                  onClick={() => {
                    setAttendeeNotes(`${attendeeNotes}\n• Amin Vahdat: "The network fabric is the AI accelerator of the next decade."`);
                    showToast('Injected quote into notes!');
                    closeModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-highest hover:bg-primary-container hover:text-white text-secondary font-mono text-[11px] transition-colors cursor-pointer"
                >
                  + Inject Quote
                </button>
              </div>
              <p className="text-on-surface-variant italic">
                "The network fabric is the AI accelerator of the next decade—latency and bandwidth topology dictate model convergence speed."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-on-surface">Priya Ramaswamy</span>
                  <span className="text-[11px] text-outline font-mono ml-2">Director of AI Platform Developer Relations</span>
                </div>
                <button
                  onClick={() => {
                    setAttendeeNotes(`${attendeeNotes}\n• Priya Ramaswamy: "Real developer leverage comes when agents can inspect runtime errors and auto-repair pipelines safely."`);
                    showToast('Injected quote into notes!');
                    closeModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-highest hover:bg-primary-container hover:text-white text-secondary font-mono text-[11px] transition-colors cursor-pointer"
                >
                  + Inject Quote
                </button>
              </div>
              <p className="text-on-surface-variant italic">
                "Real developer leverage comes when agents can inspect runtime errors and auto-repair pipelines safely with human oversight."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. API ACCESS MODAL */}
      {activeModal === 'apiAccess' && (
        <div className="relative w-full max-w-xl rounded-2xl bg-surface-container p-6 shadow-2xl border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">api</span>
              <h2 className="text-lg font-semibold text-on-surface">EventPulse Developer API</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
            <p>
              Programmatically sync keynote transcripts, speaker slides, and automated hashtags to all attendee ghostwriting portals in real-time.
            </p>

            <div className="p-3 rounded-lg bg-surface-container-lowest font-mono text-[11px] space-y-1 border border-outline-variant/30">
              <span className="text-secondary block">// POST /v1/events/gcloud-next-25/guardrails</span>
              <span className="text-primary block">curl -X POST https://api.eventpulse.ai/v1/sync \</span>
              <span className="text-outline block">  -H "Authorization: Bearer ep_live_94827104..." \</span>
              <span className="text-outline block">  -d '&#123; "session_id": "keynote_day2", "hashtags": ["#GoogleCloudNext"] &#125;'</span>
            </div>

            <p>
              Compatible with Buffer, Hootsuite, Sprout Social, and LinkedIn Enterprise APIs for batch distribution and scheduling queues.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                showToast('Copied API Key to clipboard!');
                closeModal();
              }}
              className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-mono font-medium hover:bg-inverse-primary transition-colors cursor-pointer"
            >
              Copy API Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
