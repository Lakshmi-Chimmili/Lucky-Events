import React from 'react';

export const LoadingSpinner = ({ size = '40px', label, padding = '48px 24px' }) => (
  <div
    style={{ padding }}
    className="flex flex-col items-center justify-center gap-4 text-center"
  >
    <div
      style={{ width: size, height: size }}
      className="border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"
    />
    {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
  </div>
);
