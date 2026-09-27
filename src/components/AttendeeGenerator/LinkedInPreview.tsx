import React, { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';

export const LinkedInPreview: React.FC = () => {
  const {
    generatedPost,
    previewView,
    setPreviewView,
    attachments,
    activePhotoIndex,
    setActivePhotoIndex,
    postMetrics,
    toggleLike,
    toggleRepost,
    addComment,
    regenerateWithVariant,
    schedulePost,
    showToast,
    isGenerating,
    lastGeneratedAt,
    selectedTone,
    selectedDepth,
  } = useEventStore();

  const [regenMenuOpen, setRegenMenuOpen] = useState(false);
  const [schedulePopoverOpen, setSchedulePopoverOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2025-10-25');
  const [scheduleTime, setScheduleTime] = useState('08:30');
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    showToast('Copied formatted post to clipboard with hashtags! ✓');
  };

  const handleScheduleConfirm = () => {
    schedulePost(scheduleDate, scheduleTime);
    setSchedulePopoverOpen(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(commentInput);
    setCommentInput('');
    setCommentDrawerOpen(false);
  };

  // Helper to highlight hashtags and mentions in post preview
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const words = line.split(/(\s+)/);
      return (
        <span key={idx} className="block min-h-[1.25rem]">
          {words.map((word, wIdx) => {
            if (word.startsWith('#')) {
              return (
                <span
                  key={wIdx}
                  className="text-primary font-medium hover:underline cursor-pointer"
                  onClick={() => showToast(`Filtering for tag: ${word}`)}
                >
                  {word}
                </span>
              );
            }
            if (word.startsWith('@')) {
              return (
                <span
                  key={wIdx}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  {word}
                </span>
              );
            }
            return <span key={wIdx}>{word}</span>;
          })}
        </span>
      );
    });
  };

  const currentPhoto = attachments[activePhotoIndex] || attachments[0];

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      {/* Top Preview Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-on-surface">Live LinkedIn Preview</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary text-[11px] font-mono">
            High Fidelity
          </span>
        </div>

        {/* Desktop / Mobile Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-inner">
          <button
            type="button"
            onClick={() => setPreviewView('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
              previewView === 'desktop'
                ? 'bg-surface-container-high text-on-surface shadow-sm font-medium'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">desktop_windows</span>
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewView('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
              previewView === 'mobile'
                ? 'bg-surface-container-high text-on-surface shadow-sm font-medium'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">smartphone</span>
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Realistic LinkedIn Post Card */}
      <div
        className={`relative rounded-2xl bg-surface-container-low p-5 space-y-4 shadow-2xl border transition-all ${
          lastGeneratedAt ? 'border-secondary/40 shadow-[0_0_24px_rgba(6,182,212,0.12)]' : 'border-outline-variant/20'
        } ${previewView === 'mobile' ? 'max-w-[390px] mx-auto' : 'w-full'}`}
      >
        {/* Loading Overlay when Generating */}
        {isGenerating && (
          <div className="absolute inset-0 bg-surface-container-lowest/85 backdrop-blur-sm z-30 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
              <span className="material-symbols-outlined absolute text-secondary text-xl">
                auto_awesome
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Synthesizing LinkedIn Post...</p>
              <p className="text-xs text-secondary font-mono">
                Structuring notes · {selectedTone} tone · {selectedDepth} depth
              </p>
            </div>
          </div>
        )}

        {/* Live Synchronization Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono border-b border-outline-variant/25 pb-2.5">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-on-surface font-medium">Gemini 3.8 Flash</span>
            <span className="text-outline">•</span>
            <span className="capitalize font-medium text-secondary">{selectedTone}</span>
            <span className="text-outline">•</span>
            <span className="capitalize text-on-surface-variant">{selectedDepth}</span>
          </div>
          <span className="text-outline flex items-center gap-1">
            {lastGeneratedAt ? (
              <>
                <span className="text-secondary font-medium">✨ Updated via Gemini</span>
              </>
            ) : (
              <span>Ready for generation</span>
            )}
          </span>
        </div>

        {/* Header: User Profile */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                alt="Neelam R portrait"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq9h9zCsLCK_06QN93c0b6FKivAboRnzlmpxWSc3ji07gZ3Ya0D2odD4X2M5gjLf_Ehouo9Vpegsr_JgoLPk7eIyCkYM-a-Ok2sSAUjpTFby2EJVNKHFA8lGtMGKfS6hLIXmYS77R4PiIQOx6HkUwZBa4acQYgv87Dj8BVDEA-VO0Sc0YyNUqvPHSvxOL9McCEHoZnSCOtoBhmYWK6l05fOSy40gxwL88aKQvPYvidcBGUVgaZK5UN"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-container text-white flex items-center justify-center text-[9px] font-bold">
                in
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer">
                  Neelam R
                </span>
                <span className="text-outline text-xs">• 1st</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-1">
                Sr. DX Engineer @HZTL
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono text-outline mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <span className="material-symbols-outlined text-[13px]">public</span>
                <span>Edited</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-outline">
            <button
              type="button"
              onClick={() => showToast('Post options: Neelam R · Public view')}
              className="p-1 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">more_horiz</span>
            </button>
          </div>
        </div>

        {/* Post Text Body */}
        <div className="text-sm text-on-surface leading-relaxed space-y-1">
          {renderFormattedContent(generatedPost)}
        </div>

        {/* Post Media Asset */}
        {currentPhoto && (
          <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest group border border-outline-variant/30">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.altText}
              className="w-full max-h-72 object-cover cursor-pointer"
              onClick={() => setFullscreenImage(currentPhoto.url)}
            />
            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-surface-dim/80 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-1.5 shadow">
              <span className="material-symbols-outlined text-[13px] text-secondary">
                view_carousel
              </span>
              <span>
                {activePhotoIndex + 1} / {attachments.length} Photos
              </span>
            </div>

            {attachments.length > 1 && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((activePhotoIndex + 1) % attachments.length)
                  }
                  className="w-7 h-7 rounded-full bg-surface-dim/80 hover:bg-surface-dim backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setFullscreenImage(currentPhoto.url)}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-surface-dim/80 hover:bg-surface-dim backdrop-blur-md text-white transition-colors cursor-pointer"
              title="Fullscreen Preview"
            >
              <span className="material-symbols-outlined text-sm">fullscreen</span>
            </button>
          </div>
        )}

        {/* Post Reactions & Stats Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-outline pt-1 border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary">
                👍
              </span>
              <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[10px] text-on-secondary">
                💡
              </span>
              <span className="w-4 h-4 rounded-full bg-error-container flex items-center justify-center text-[10px] text-white">
                ❤️
              </span>
            </div>
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={toggleLike}
            >
              {postMetrics.likes} reactions
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={() => setCommentDrawerOpen(!commentDrawerOpen)}
            >
              {postMetrics.comments} comments
            </span>
            <span>•</span>
            <span
              className="hover:text-primary cursor-pointer transition-colors"
              onClick={toggleRepost}
            >
              {postMetrics.reposts} reposts
            </span>
          </div>
        </div>

        {/* LinkedIn Social Action Buttons */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-xs font-mono cursor-pointer ${
              postMetrics.userLiked
                ? 'text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {postMetrics.userLiked ? 'thumb_up' : 'thumb_up'}
            </span>
            <span>Like</span>
          </button>

          <button
            type="button"
            onClick={() => setCommentDrawerOpen(!commentDrawerOpen)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors text-xs font-mono cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">comment</span>
            <span>Comment</span>
          </button>

          <button
            type="button"
            onClick={toggleRepost}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-xs font-mono cursor-pointer ${
              postMetrics.userReposted
                ? 'text-secondary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">repeat</span>
            <span>Repost</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors text-xs font-mono cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            <span>Send</span>
          </button>
        </div>

        {/* Interactive Comment Box */}
        {commentDrawerOpen && (
          <form
            onSubmit={handleCommentSubmit}
            className="pt-2 flex items-center gap-2 border-t border-outline-variant/30"
          >
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment on LinkedIn thread..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-primary-container text-white text-xs font-mono hover:bg-inverse-primary transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        )}
      </div>

      {/* Bottom Action Toolbar (Bento Glass Panel) */}
      <div className="relative rounded-2xl bg-surface-container-low/95 backdrop-blur-md p-4 space-y-3 shadow-2xl border border-outline-variant/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm border border-outline-variant/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              content_copy
            </span>
            <span>Copy Text</span>
          </button>

          {/* Regenerate Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRegenMenuOpen(!regenMenuOpen)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">cached</span>
              <span>Regenerate</span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>

            {regenMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-48 rounded-xl bg-surface-container-high border border-outline-variant/40 p-1.5 shadow-2xl z-30 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    regenerateWithVariant('shorter');
                    setRegenMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container-highest flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">⚡</span> Shorter version
                </button>
                <button
                  type="button"
                  onClick={() => {
                    regenerateWithVariant('emojis');
                    setRegenMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container-highest flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">🎉</span> Add more emojis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    regenerateWithVariant('executive');
                    setRegenMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container-highest flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">👔</span> Executive Tone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    regenerateWithVariant('conversational');
                    setRegenMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container-highest flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-sm">💬</span> Conversational
                </button>
              </div>
            )}
          </div>

          {/* Schedule Post Button */}
          <button
            type="button"
            onClick={() => setSchedulePopoverOpen(!schedulePopoverOpen)}
            className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm border border-outline-variant/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-tertiary">
              calendar_clock
            </span>
            <span>Schedule</span>
          </button>

          {/* Open in LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base text-primary">open_in_new</span>
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Schedule Popover Panel */}
        {schedulePopoverOpen && (
          <div className="rounded-xl bg-surface-container-lowest p-4 space-y-3.5 transition-all border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-tertiary">event</span>
                <span className="text-xs font-semibold text-on-surface">Auto-Scheduler Queue</span>
              </div>
              <button
                type="button"
                onClick={() => setSchedulePopoverOpen(false)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Recommended Peak Window */}
            <div className="p-2.5 rounded-lg bg-surface-container text-xs flex items-start gap-2 border border-outline-variant/20">
              <span className="text-base leading-none">🔥</span>
              <div>
                <span className="font-semibold text-secondary">
                  Recommended: Tomorrow 8:30 AM IST
                </span>
                <p className="text-outline text-[11px] mt-0.5">
                  Peak LinkedIn algorithm engagement for tech summit attendees
                </p>
              </div>
            </div>

            {/* Date & Time Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-outline">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-lg bg-surface-container px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-outline">Time (IST)</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-lg bg-surface-container px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleScheduleConfirm}
              className="w-full py-2 px-3 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Confirm & Sync to Buffer / LinkedIn</span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={fullscreenImage}
              alt="Fullscreen photo"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
