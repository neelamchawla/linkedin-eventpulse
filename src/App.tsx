import React, { useEffect, Suspense, lazy } from 'react';
import { useEventStore } from './store/useEventStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AttendeeGenerator } from './components/AttendeeGenerator/AttendeeGenerator';
import { Toast } from './components/Toast';

// Code-split secondary heavy tabs & modals for maximum initial load performance
const OrganizerDashboard = lazy(() =>
  import('./components/OrganizerDashboard/OrganizerDashboard').then((m) => ({ default: m.OrganizerDashboard }))
);
const ContentAnalytics = lazy(() =>
  import('./components/Analytics/ContentAnalytics').then((m) => ({ default: m.ContentAnalytics }))
);
const ModalsContainer = lazy(() =>
  import('./components/Modals/ModalsContainer').then((m) => ({ default: m.ModalsContainer }))
);

const TabLoadingFallback: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-secondary/30 border-t-secondary animate-spin" />
    <span className="font-mono text-xs text-outline animate-pulse">Loading telemetry matrix...</span>
  </div>
);

export default function App() {
  const { currentTab, theme } = useEventStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased transition-colors duration-200">
      <Header />

      <main className="w-full pt-16 flex-1 flex flex-col">
        {currentTab === 'attendee-generator' && <AttendeeGenerator />}
        {currentTab === 'organizer-dashboard' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <OrganizerDashboard />
          </Suspense>
        )}
        {currentTab === 'content-analytics' && (
          <Suspense fallback={<TabLoadingFallback />}>
            <ContentAnalytics />
          </Suspense>
        )}
      </main>

      <Footer />

      <Suspense fallback={null}>
        <ModalsContainer />
      </Suspense>
      <Toast />
    </div>
  );
}
