import { useEffect } from 'react';
import { useEventStore } from './store/useEventStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AttendeeGenerator } from './components/AttendeeGenerator/AttendeeGenerator';
import { OrganizerDashboard } from './components/OrganizerDashboard/OrganizerDashboard';
import { ContentAnalytics } from './components/Analytics/ContentAnalytics';
import { ModalsContainer } from './components/Modals/ModalsContainer';
import { Toast } from './components/Toast';

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
        {currentTab === 'organizer-dashboard' && <OrganizerDashboard />}
        {currentTab === 'content-analytics' && <ContentAnalytics />}
      </main>

      <Footer />

      <ModalsContainer />
      <Toast />
    </div>
  );
}
