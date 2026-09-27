import React, { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';

export const ContentAnalytics: React.FC = () => {
  const { eventConfig, openModal, showToast } = useEventStore();
  const [timeRange, setTimeRange] = useState<'day1' | 'day2' | 'cumulative'>('day2');

  const hourlyData = [
    { hour: '08:00', label: 'Doors & Breakfast', posts: 140, reach: '180k' },
    { hour: '09:30', label: 'Thomas Kurian Keynote', posts: 680, reach: '1.42M', peak: true },
    { hour: '11:30', label: 'Developer Sandbox', posts: 310, reach: '480k' },
    { hour: '13:00', label: 'Innovation Expo & Lunch', posts: 240, reach: '320k' },
    { hour: '15:00', label: 'Multi-Agent Breakouts', posts: 420, reach: '690k' },
    { hour: '17:30', label: 'Networking Mixer & Reception', posts: 290, reach: '410k' },
  ];

  const tagVelocity = [
    { tag: '#GoogleCloudNext', count: 982, pct: 68, color: 'bg-primary' },
    { tag: '#GenerativeAI', count: 642, pct: 45, color: 'bg-secondary' },
    { tag: '#EventPulse', count: 614, pct: 43, color: 'bg-tertiary' },
    { tag: '#CloudArchitecture', count: 388, pct: 27, color: 'bg-secondary-container' },
    { tag: '#Kubernetes', count: 210, pct: 15, color: 'bg-outline' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Header */}
      <div className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-6 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-mono text-xs text-secondary tracking-widest uppercase font-semibold">
              <span>Telemetry Intelligence Engine</span>
              <span>•</span>
              <span className="text-outline">Real-Time Aggregations</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight">
              Event Social Impact & Audience Analytics
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 rounded-lg bg-surface-container border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setTimeRange('day1')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  timeRange === 'day1'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Day 1
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('day2')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  timeRange === 'day2'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Day 2 (Live)
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('cumulative')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  timeRange === 'cumulative'
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Full Summit
              </button>
            </div>

            <button
              type="button"
              onClick={() => openModal('exportTelemetry')}
              className="h-9 px-3.5 rounded-lg bg-primary-container hover:bg-inverse-primary text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-xs text-outline uppercase tracking-wider">
              Total Impression Reach
            </span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-on-surface">2,842,100</span>
              <span className="text-xs font-mono text-secondary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +42.6%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Across 1,428 unique LinkedIn updates
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-xs text-outline uppercase tracking-wider">
              Avg. Post Multiplier
            </span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-on-surface">1,988</span>
              <span className="text-xs font-mono text-primary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Top Tier
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Impressions per attendee post</p>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-xs text-outline uppercase tracking-wider">
              Audience Sentiment Score
            </span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-secondary">96.8%</span>
              <span className="text-xs font-mono text-secondary-container">Positive</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '96.8%' }} />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-xs text-outline uppercase tracking-wider">
              Keynote Clip CTR
            </span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-tertiary">14.2%</span>
              <span className="text-xs font-mono text-tertiary">3.4x avg</span>
            </div>
            <p className="text-xs text-on-surface-variant">Direct clicks to cloud.google.com/next</p>
          </div>
        </div>

        {/* 2-Column Analytical Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Chart: Hourly Posting Velocity */}
          <div className="lg:col-span-7 bg-surface-container rounded-xl p-6 border border-outline-variant/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-on-surface">Hourly Viral Velocity</h2>
                <p className="text-xs text-on-surface-variant">
                  Attendee post publication volume mapped against conference session stages
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-secondary text-xs font-mono">
                Ahmedabad IST
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-3 pt-2">
              {hourlyData.map((item) => (
                <div key={item.hour} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-on-surface flex items-center gap-2">
                      <span className="text-secondary">{item.hour}</span>
                      <span className="text-on-surface-variant font-normal">{item.label}</span>
                      {item.peak && (
                        <span className="px-1.5 py-0.2 rounded bg-secondary-container/20 text-secondary text-[10px]">
                          ⚡ KEYNOTE PEAK
                        </span>
                      )}
                    </span>
                    <span className="text-outline">
                      {item.posts} posts · <strong className="text-on-surface">{item.reach}</strong> reach
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.peak
                          ? 'bg-gradient-to-r from-primary-container via-tertiary to-secondary'
                          : 'bg-primary/70'
                      }`}
                      style={{ width: `${Math.min(100, (item.posts / 700) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Chart: Hashtag Penetration & Compliance */}
          <div className="lg:col-span-5 bg-surface-container rounded-xl p-6 border border-outline-variant/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-on-surface">Hashtag Dispersion</h2>
                <p className="text-xs text-on-surface-variant">
                  Tag distribution across syndicated attendee posts
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Refreshed hashtag velocity metrics!')}
                className="text-outline hover:text-on-surface cursor-pointer"
                title="Refresh"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
              </button>
            </div>

            <div className="space-y-3.5 pt-2">
              {tagVelocity.map((tv) => (
                <div key={tv.tag} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-on-surface">{tv.tag}</span>
                    <span className="text-outline">{tv.count} posts ({tv.pct}%)</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tv.color}`}
                      style={{ width: `${tv.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface">Brand Tag Compliance</span>
                <span className="font-mono text-secondary font-bold">98.4%</span>
              </div>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                Attendee posts generated with EventPulse enforce canonical event tags, avoiding fragmented brand misspelling.
              </p>
            </div>
          </div>
        </div>

        {/* Geographic & Persona Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm space-y-2">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider">
              Audience Geographies
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Ahmedabad & Gujarat Region</span>
                <span className="font-mono text-secondary">44%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Bengaluru & Karnataka</span>
                <span className="font-mono text-secondary">22%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Mumbai & Pune (Maharashtra)</span>
                <span className="font-mono text-secondary">18%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface font-medium">Delhi NCR, Hyderabad & Remote</span>
                <span className="font-mono text-secondary">16%</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm space-y-2">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider">
              Top Persona Archetypes
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Key Takeaways (Bulleted)</span>
                <span className="font-mono text-primary">52%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Executive / Professional</span>
                <span className="font-mono text-primary">24%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span className="text-on-surface font-medium">Grateful / Community</span>
                <span className="font-mono text-primary">14%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface font-medium">Storyteller / Behind Scenes</span>
                <span className="font-mono text-primary">10%</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm space-y-2">
            <h3 className="text-xs font-mono text-outline uppercase tracking-wider">
              Peak Algorithmic Reach Window
            </h3>
            <p className="text-xs text-on-surface font-medium">
              Optimal publishing time for tomorrow:
            </p>
            <div className="p-2.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-center">
              <span className="font-mono text-base font-bold text-secondary">
                8:30 AM – 9:45 AM IST
              </span>
              <p className="text-[11px] text-outline mt-0.5">
                3.1x higher viral re-share velocity before main stage doors open
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
