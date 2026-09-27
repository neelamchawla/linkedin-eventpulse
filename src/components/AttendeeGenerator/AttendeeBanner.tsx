import React from 'react';
import { useEventStore } from '../../store/useEventStore';

export const AttendeeBanner: React.FC = () => {
  const { eventConfig, openModal, setAttendeeNotes, attendeeNotes, showToast, addUserHashtags } = useEventStore();

  const handleHashtagClick = (tag: string) => {
    addUserHashtags(tag);
    if (!attendeeNotes.includes(tag)) {
      setAttendeeNotes(`${attendeeNotes} ${tag}`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-5 shadow-2xl border border-outline-variant/20">
      {/* Background radial gradient halos */}
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-tertiary-container/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-3">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-secondary text-[11px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Official Event Partner
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-mono">
              <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
              Hosted by Google Cloud
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-[11px] font-mono">
              <span className="material-symbols-outlined text-[14px] text-secondary">calendar_today</span>
              {eventConfig.timeframe} · {eventConfig.venue.split(',')[0]}
            </span>
          </div>

          {/* Title & subtitle */}
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
              {eventConfig.designation} · Ahmedabad, Gujarat, India
            </h1>
            <span className="text-xs font-mono text-outline">
              Stage & Session AI Ghostwriter
            </span>
          </div>

          {/* Clickable Hashtags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {eventConfig.hashtags.map((tag, idx) => {
              const tagColors = [
                'text-primary',
                'text-secondary',
                'text-tertiary',
                'text-on-surface-variant',
              ];
              const color = tagColors[idx % tagColors.length];
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleHashtagClick(tag)}
                  className={`group flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-xs font-mono ${color} hover:bg-surface-container-high hover:text-white transition-all cursor-pointer`}
                  title="Click to inject into notes"
                >
                  <span>{tag}</span>
                  <span className="material-symbols-outlined text-xs opacity-50 group-hover:opacity-100">
                    add
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Badges / Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-surface-container flex items-center gap-2.5 shadow-sm border border-outline-variant/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-container" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-on-surface">All-Access VIP Pass</span>
              <span className="text-[10px] font-mono text-outline">Attendee #4829</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openModal('guidelines')}
            className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-base text-primary">policy</span>
            <span>Event Guidelines</span>
          </button>
        </div>
      </div>
    </div>
  );
};
