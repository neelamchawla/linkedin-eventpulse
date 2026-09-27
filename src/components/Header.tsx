import React, { useState } from 'react';
import { useEventStore } from '../store/useEventStore';
import { NavTab } from '../types';

export const Header: React.FC = () => {
  const {
    currentTab,
    setTab,
    theme,
    toggleTheme,
    activeEventName,
    setActiveEventName,
    openModal,
  } = useEventStore();

  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const eventsList = [
    "Google Cloud Next '25 Ahmedabad",
    "Google Cloud Summit '25 Bengaluru",
    "Microsoft Build '25 Hyderabad",
    "AWS Summit '25 Mumbai",
  ];

  const handleNavClick = (tab: NavTab) => {
    setTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_16px_rgba(0,0,0,0.2)]">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('attendee-generator')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-full bg-secondary/30 blur-sm animate-pulse" />
              <img
                alt="EventPulse Logo"
                className="relative h-8 w-8 object-contain rounded-lg"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Vho8uv7kHmmO1LVRSCBMl-ofAVVD5Jn0Wow95dD1QwXKv2sU5hV7c1xdEpT8VUX4pi8Ay4w5lxFTgphElPiirg-kvK5Q5ME5I8LfQL_u2Q8xULBCdf8Ramg_gn9fKW5rQck2fmjU-Kn7EhDQSIdRDNfzJgU01Ee7-w9wP-HDB_Hr_4g4CxFgi8vslu0TTTz2UcNhMGjtVkmr5IzZVCLe6ttydDaL5mtrXNICLXztLLqL7n9kRodXg7GPM"
              />
            </div>
            <span className="font-headline-md text-lg sm:text-xl font-bold tracking-tight text-on-surface">
              EventPulse
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/50">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-semibold">
                AI PRO
              </span>
            </div>
          </button>
        </div>

        {/* Center: Navigation Bar (Pill Container) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="p-1 rounded-full bg-surface-container-low border border-outline-variant/40 shadow-inner flex items-center">
            <nav className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNavClick('attendee-generator')}
                className={`px-4 py-1.5 rounded-full transition-all font-body-md text-sm whitespace-nowrap cursor-pointer ${
                  currentTab === 'attendee-generator'
                    ? 'bg-surface-container-highest text-on-surface font-medium shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Attendee Generator
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('organizer-dashboard')}
                className={`px-4 py-1.5 rounded-full transition-all font-body-md text-sm whitespace-nowrap cursor-pointer ${
                  currentTab === 'organizer-dashboard'
                    ? 'bg-surface-container-highest text-on-surface font-medium shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Organizer Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('content-analytics')}
                className={`px-4 py-1.5 rounded-full transition-all font-body-md text-sm whitespace-nowrap cursor-pointer ${
                  currentTab === 'content-analytics'
                    ? 'bg-surface-container-highest text-on-surface font-medium shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Right: Controls & Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Event Dropdown */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-xs font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_#03b5d3]" />
              <span className="truncate max-w-[170px]">{activeEventName}</span>
              <span className="material-symbols-outlined text-outline text-base leading-none">
                expand_more
              </span>
            </button>

            {eventDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-container-high border border-outline-variant/50 p-1.5 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-mono text-outline uppercase tracking-wider">
                  Select Event Context
                </div>
                {eventsList.map((evt) => (
                  <button
                    key={evt}
                    onClick={() => {
                      setActiveEventName(evt);
                      setEventDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      evt === activeEventName
                        ? 'bg-surface-container-highest text-secondary'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span>{evt}</span>
                    {evt === activeEventName && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            aria-label="Toggle theme mode"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Button & Popover */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-container-high border border-outline-variant/50 p-3 shadow-2xl z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <span className="font-semibold text-xs text-on-surface">Event Notifications</span>
                  <span className="text-[10px] font-mono text-secondary">3 New Pulses</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                    <p className="text-on-surface font-medium">Keynote reach surge!</p>
                    <p className="text-on-surface-variant text-[11px]">
                      Posts tagged #GoogleCloudNext crossed 2.8M impressions.
                    </p>
                    <span className="text-[10px] font-mono text-outline">4m ago</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                    <p className="text-on-surface font-medium">New attendee post published</p>
                    <p className="text-on-surface-variant text-[11px]">
                      Neelam R shared live insights from Mahatma Mandir Hall 2.
                    </p>
                    <span className="text-[10px] font-mono text-outline">12m ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 pl-1 cursor-pointer focus:outline-none"
            >
              <div className="relative flex items-center justify-center">
                <img
                  alt="Neelam R profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/60 hover:ring-secondary transition-all"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq9h9zCsLCK_06QN93c0b6FKivAboRnzlmpxWSc3ji07gZ3Ya0D2odD4X2M5gjLf_Ehouo9Vpegsr_JgoLPk7eIyCkYM-a-Ok2sSAUjpTFby2EJVNKHFA8lGtMGKfS6hLIXmYS77R4PiIQOx6HkUwZBa4acQYgv87Dj8BVDEA-VO0Sc0YyNUqvPHSvxOL9McCEHoZnSCOtoBhmYWK6l05fOSy40gxwL88aKQvPYvidcBGUVgaZK5UN"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest" />
              </div>
              <span className="material-symbols-outlined text-outline text-sm leading-none hidden sm:inline-block">
                expand_more
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-high border border-outline-variant/50 p-2 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-2 border-b border-outline-variant/30">
                  <p className="font-semibold text-xs text-on-surface">Neelam R</p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    Sr. DX Engineer @HZTL
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-secondary-container/20 text-secondary">
                    VIP Attendee #4829
                  </span>
                </div>
                <button
                  onClick={() => {
                    openModal('guidelines');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-primary">policy</span>
                  <span>Event Guidelines</span>
                </button>
                <button
                  onClick={() => {
                    openModal('speakerLibrary');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-on-surface hover:bg-surface-container flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">record_voice_over</span>
                  <span>Speaker Library</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface-container-lowest px-4 py-3 space-y-2">
          <button
            onClick={() => handleNavClick('attendee-generator')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'attendee-generator'
                ? 'bg-surface-container-highest text-secondary'
                : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            Attendee Generator
          </button>
          <button
            onClick={() => handleNavClick('organizer-dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'organizer-dashboard'
                ? 'bg-surface-container-highest text-secondary'
                : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            Organizer Dashboard
          </button>
          <button
            onClick={() => handleNavClick('content-analytics')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'content-analytics'
                ? 'bg-surface-container-highest text-secondary'
                : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            Analytics
          </button>
        </div>
      )}
    </header>
  );
};
