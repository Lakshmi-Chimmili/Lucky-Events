import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast, hideToast } = useAuth();

  if (!toast?.show) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  const borderColor = isError
    ? 'border-rose-500/50 bg-rose-950/80 text-rose-200'
    : isInfo
    ? 'border-sky-500/50 bg-sky-950/80 text-sky-200'
    : 'border-emerald-500/50 bg-emerald-950/80 text-emerald-200';

  const Icon = isError ? AlertCircle : isInfo ? Info : CheckCircle2;
  const iconColor = isError ? 'text-rose-400' : isInfo ? 'text-sky-400' : 'text-emerald-400';

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-md w-full px-4 animate-in slide-in-from-top-4 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${borderColor}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 text-sm font-medium leading-snug">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white transition p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
