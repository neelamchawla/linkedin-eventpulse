import React, { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';

export const OrganizerDashboard: React.FC = () => {
  const {
    eventConfig,
    updateEventConfig,
    addHashtag,
    removeHashtag,
    deployGuidelines,
    telemetry,
    livePosts,
    champions,
    openModal,
    showToast,
    setTab,
  } = useEventStore();

  const [tagInput, setTagInput] = useState('');
  const [copyLinkText, setCopyLinkText] = useState('Copy Link');
  const [isDeploying, setIsDeploying] = useState(false);

  const portalUrl = 'https://eventpulse.ai/p/gcloud-next-25';

  const handleCopyPortal = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopyLinkText('Copied!');
    showToast('Portal link copied to clipboard!');
    setTimeout(() => setCopyLinkText('Copy Link'), 2000);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addHashtag(tagInput.trim());
      setTagInput('');
      showToast(`Added ${tagInput.trim()} to automated hashtag matrix`);
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      deployGuidelines();
      setIsDeploying(false);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Command Header & Telemetry Bar */}
      <div className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-6 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-secondary tracking-widest uppercase font-semibold">
                Live Command Matrix
              </span>
              <span className="text-outline-variant">•</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-mono text-[11px] text-on-surface">
                  Live Day 2 of 3 · Synchronized
                </span>
              </div>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight flex flex-wrap items-center gap-2">
              <span>Event Command Center</span>
              <span className="font-headline-md text-base sm:text-xl text-on-surface-variant font-normal">
                / {eventConfig.designation} Ahmedabad
              </span>
            </h1>
          </div>

          {/* Quick Global Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openModal('exportTelemetry')}
              className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono flex items-center gap-2 transition-all cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-outline text-lg">download</span>
              <span>Export Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => openModal('guidelines')}
              className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono flex items-center gap-2 transition-all cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-secondary text-lg">tune</span>
              <span>Guardrails</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('attendee-generator')}
              className="h-10 px-4 rounded-lg bg-primary-container text-white hover:bg-inverse-primary text-xs font-mono shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">qr_code_2</span>
              <span>Attendee Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Space */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* KPI Bento Ribbon (4 Metric Cells) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Posts Generated */}
          <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between hover:bg-surface-container-high transition-colors group border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-mono text-xs uppercase tracking-wider">Posts Generated</span>
              <span className="p-1.5 rounded-lg bg-surface-container-highest text-secondary material-symbols-outlined text-lg">
                electric_bolt
              </span>
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <span className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight font-mono">
                {telemetry.postsGenerated.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs text-secondary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+34.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-outline text-xs">
              <span className="text-on-surface-variant">vs. Day 1 Benchmark</span>
              <svg className="w-20 h-6 text-secondary" fill="none" viewBox="0 0 80 24">
                <path
                  d="M1 20L15 17L28 19L42 12L56 14L70 4L79 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Metric 2: Estimated Reach */}
          <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between hover:bg-surface-container-high transition-colors group border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-mono text-xs uppercase tracking-wider">Estimated Reach</span>
              <span className="p-1.5 rounded-lg bg-surface-container-highest text-primary material-symbols-outlined text-lg">
                public
              </span>
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <span className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight font-mono">
                {telemetry.estimatedReach}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-mono text-[10px]">
                Viral Index 94
              </span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant text-xs">
              <span>LinkedIn Feed Impressions</span>
              <svg className="w-20 h-6 text-primary" fill="none" viewBox="0 0 80 24">
                <path
                  d="M1 18L18 16L32 20L48 10L62 7L79 3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Metric 3: Attendee Adoption */}
          <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between hover:bg-surface-container-high transition-colors group border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-mono text-xs uppercase tracking-wider">Attendee Adoption</span>
              <span className="p-1.5 rounded-lg bg-surface-container-highest text-secondary-container material-symbols-outlined text-lg">
                groups
              </span>
            </div>
            <div className="my-3 flex items-baseline justify-between">
              <span className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight font-mono">
                {telemetry.attendeeAdoption}%
              </span>
              <span className="font-mono text-xs text-secondary-container font-medium">
                4,120 of 6k
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary-container h-full rounded-full transition-all duration-700"
                style={{ width: `${telemetry.attendeeAdoption}%` }}
              />
            </div>
          </div>

          {/* Metric 4: Dominant Velocity */}
          <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between hover:bg-surface-container-high transition-colors group border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-mono text-xs uppercase tracking-wider">Dominant Velocity</span>
              <span className="p-1.5 rounded-lg bg-surface-container-highest text-tertiary material-symbols-outlined text-lg">
                tag
              </span>
            </div>
            <div className="my-3 flex flex-col gap-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-on-surface font-medium">#GoogleCloudNext</span>
                <span className="text-tertiary">{telemetry.velocityNextMsgs} msgs</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-on-surface-variant">#EventPulse</span>
                <span className="text-outline">{telemetry.velocityPulseMsgs} msgs</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span>{telemetry.brandTagCompliance}% brand tag compliance</span>
            </div>
          </div>
        </div>

        {/* Main Asymmetric Bento: 7 Cols Left / 5 Cols Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Operations & AI Guardrails (Column Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card A: Event Context & AI Guardrails */}
            <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden border border-outline-variant/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center material-symbols-outlined text-lg">
                    tune
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-on-surface">
                      Event Context & AI Guardrails
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Parameters governing attendee post synthesis & tone calibration.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-mono text-[10px]">
                  Active Engine v4.2
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Event Designation
                  </label>
                  <input
                    type="text"
                    value={eventConfig.designation}
                    onChange={(e) => updateEventConfig({ designation: e.target.value })}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Host Organization
                  </label>
                  <input
                    type="text"
                    value={eventConfig.hostOrg}
                    onChange={(e) => updateEventConfig({ hostOrg: e.target.value })}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Event Timeframe
                  </label>
                  <input
                    type="text"
                    value={eventConfig.timeframe}
                    onChange={(e) => updateEventConfig({ timeframe: e.target.value })}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Physical Venue
                  </label>
                  <input
                    type="text"
                    value={eventConfig.venue}
                    onChange={(e) => updateEventConfig({ venue: e.target.value })}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface text-sm border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Hashtag Matrix */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Automated Post Hashtag Matrix
                  </label>
                  <span className="font-mono text-[11px] text-outline">
                    Included automatically in all generated drafts
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  {eventConfig.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-primary font-mono text-xs border border-outline-variant/20"
                    >
                      {tag}
                      <span
                        className="material-symbols-outlined text-xs cursor-pointer hover:text-white"
                        onClick={() => removeHashtag(tag)}
                      >
                        close
                      </span>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 pl-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="+ Add tag..."
                      className="bg-transparent text-on-surface text-xs font-mono w-24 focus:w-32 focus:outline-none transition-all placeholder:text-outline"
                    />
                  </div>
                </div>
              </div>

              {/* Social Anchors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-outline">LinkedIn Organization</span>
                  <div className="flex items-center gap-2 px-3 h-9 bg-surface-container-low rounded-lg text-on-surface font-mono text-xs border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-base">domain</span>
                    <span className="truncate">{eventConfig.linkedinOrg}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-outline">Official Handle</span>
                  <div className="flex items-center gap-2 px-3 h-9 bg-surface-container-low rounded-lg text-on-surface font-mono text-xs border border-outline-variant/30">
                    <span className="font-mono text-secondary">@</span>
                    <span className="truncate">{eventConfig.officialHandle.replace('@', '')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-outline">Resource URL</span>
                  <div className="flex items-center gap-2 px-3 h-9 bg-surface-container-low rounded-lg text-on-surface font-mono text-xs border border-outline-variant/30">
                    <span className="material-symbols-outlined text-tertiary text-base">link</span>
                    <span className="truncate">{eventConfig.resourceUrl}</span>
                  </div>
                </div>
              </div>

              {/* Master System Directive */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Master System Directive for Attendee Generator
                  </label>
                  <span className="font-mono text-[11px] text-secondary">
                    Strict Compliance Enforcement
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={eventConfig.masterDirective}
                  onChange={(e) => updateEventConfig({ masterDirective: e.target.value })}
                  className="w-full p-3 bg-surface-container-low rounded-lg text-on-surface text-xs leading-relaxed border border-outline-variant/30 focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              {/* Action Commit Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20">
                <span className="font-mono text-xs text-outline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  {eventConfig.lastSyncedText}
                </span>
                <button
                  type="button"
                  disabled={isDeploying}
                  onClick={handleDeploy}
                  className="h-10 px-5 rounded-lg bg-primary-container hover:bg-inverse-primary text-white text-xs font-mono font-medium shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-lg ${isDeploying ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{isDeploying ? 'Deploying...' : 'Deploy Updates to All Sessions'}</span>
                </button>
              </div>
            </div>

            {/* Card B: Attendee Viral Sharing Hub (Stage & Badge QR) */}
            <div className="bg-surface-container rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden border border-outline-variant/20 shadow-lg">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

              {/* QR Container */}
              <div className="relative shrink-0 flex flex-col items-center gap-2 bg-surface-container-lowest p-4 rounded-xl shadow-lg border border-outline-variant/30">
                <svg className="w-36 h-36 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
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
                  <rect className="text-secondary" height="12" rx="1" width="12" x="44" y="38" />
                  <rect height="6" rx="1" width="10" x="64" y="42" />
                  <rect height="16" rx="1" width="8" x="82" y="40" />
                  <rect height="10" rx="1" width="8" x="40" y="58" />
                  <rect height="6" rx="1" width="14" x="54" y="56" />
                  <rect height="6" rx="1" width="14" x="76" y="66" />
                  <rect height="14" rx="1" width="6" x="42" y="76" />
                  <rect height="8" rx="1" width="8" x="56" y="72" />
                  <rect height="10" rx="1" width="18" x="70" y="80" />
                </svg>
                <span className="font-mono text-[11px] text-outline">Scan to Draft Post</span>
              </div>

              {/* Share Details */}
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-mono text-[10px]">
                    Stage-Ready Asset
                  </span>
                  <span className="font-mono text-[11px] text-outline">• Self-Authenticating Link</span>
                </div>
                <h3 className="text-base font-semibold text-on-surface">
                  Attendee Post Generator Portal
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Project this URL or QR on keynote display monitors and stage intermission slides. Attendees can immediately access contextual post templates without login friction.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center justify-between flex-1 px-3 h-10 bg-surface-container-low rounded-lg text-on-surface font-mono text-xs border border-outline-variant/30 overflow-hidden">
                    <span className="truncate text-secondary">{portalUrl}</span>
                    <span className="material-symbols-outlined text-outline text-base ml-2 shrink-0">
                      lock
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPortal}
                    className="h-10 px-4 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg font-mono text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer border border-outline-variant/40"
                  >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                    <span>{copyLinkText}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openModal('keynoteSlide')}
                    className="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-base">slideshow</span>
                    <span>Download Keynote SVG (16:9)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Generated print-ready 300 DPI vector PDF with badge registration specs!');
                    }}
                    className="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-base">badge</span>
                    <span>Badge Print Spec (Vector)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-Time Telemetry & Champions (Column Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card C: Real-Time Stream of Generated Posts */}
            <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-4 border border-outline-variant/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center material-symbols-outlined text-lg">
                    stream
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-on-surface">Live Post Stream</h2>
                    <p className="text-xs text-on-surface-variant">Real-time pulses from Mahatma Mandir halls.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                  <span className="font-mono text-[10px] text-secondary font-bold">LIVE</span>
                </div>
              </div>

              {/* Feed Items Stack */}
              <div className="flex flex-col gap-3">
                {livePosts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2 hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-mono text-xs text-primary font-bold">
                          {post.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-on-surface">
                            {post.author}
                          </span>
                          <span className="font-mono text-[10px] text-outline">{post.role}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-outline">{post.timeAgo}</span>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      "{post.content}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant/10 text-[11px] font-mono">
                      {post.status === 'shared' ? (
                        <span className="inline-flex items-center gap-1 text-secondary-container">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Shared on LinkedIn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          Scheduled ({post.scheduledTime || '5:00 PM'})
                        </span>
                      )}
                      <span className="text-outline">{post.tagsCount} tags included</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openModal('streamInspector')}
                className="w-full py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-mono text-xs text-center transition-colors cursor-pointer border border-outline-variant/20"
              >
                Open Full Stream Inspector ({telemetry.postsGenerated.toLocaleString()} Posts) →
              </button>
            </div>

            {/* Card D: Attendee Leaderboard & Engagement Champions */}
            <div className="bg-surface-container rounded-xl p-6 flex flex-col gap-4 border border-outline-variant/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center material-symbols-outlined text-lg">
                    workspace_premium
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-on-surface">Engagement Champions</h2>
                    <p className="text-xs text-on-surface-variant">Top attendee amplification contributors.</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-outline">Total Score</span>
              </div>

              {/* Leaderboard Rows */}
              <div className="flex flex-col gap-2">
                {champions.map((champ) => (
                  <div
                    key={champ.name}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                          champ.rank === 1
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container-highest text-on-surface'
                        }`}
                      >
                        {champ.rank}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{champ.name}</span>
                        <span className="font-mono text-[10px] text-secondary">{champ.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-on-surface font-bold">
                        {champ.impressions}
                      </div>
                      <div className="font-mono text-[10px] text-outline">Impressions</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between border border-outline-variant/20">
                <span className="font-mono text-[11px] text-on-surface-variant">
                  Rewards Incentive active: "VIP Speaker Lounge Access"
                </span>
                <span className="material-symbols-outlined text-secondary text-base">
                  card_giftcard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
