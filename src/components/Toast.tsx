import React from 'react';
import { useEventStore } from '../store/useEventStore';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useEventStore();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface-container-high/95 backdrop-blur-xl text-on-surface shadow-2xl border border-secondary/30 text-xs font-mono">
        <div className="flex items-center gap-2 text-secondary">
          <span className="material-symbols-outlined text-lg">
            {toast.icon || 'check_circle'}
          </span>
          <span className="text-on-surface font-medium">{toast.message}</span>
        </div>
        <button
          onClick={hideToast}
          className="text-outline hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
