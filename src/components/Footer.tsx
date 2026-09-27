import React from 'react';
import { useEventStore } from '../store/useEventStore';

export const Footer: React.FC = () => {
  const { openModal } = useEventStore();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 py-8 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-on-surface">EventPulse Core AI</span>
          <span className="text-outline">•</span>
          <span>Autonomous LinkedIn Event Ghostwriter</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => openModal('speakerLibrary')}
            className="hover:text-on-surface transition-colors cursor-pointer"
          >
            Speaker Library
          </button>
          <button
            onClick={() => openModal('guidelines')}
            className="hover:text-on-surface transition-colors cursor-pointer"
          >
            Compliance & Guardrails
          </button>
          <button
            onClick={() => openModal('apiAccess')}
            className="hover:text-on-surface transition-colors cursor-pointer"
          >
            API Integration
          </button>
        </div>

        <div className="font-mono text-outline text-[11px]">
          © {new Date().getFullYear()} EventPulse Corp. Vercel / Linear Spec Engine.
        </div>
      </div>
    </footer>
  );
};
