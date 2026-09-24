import React from 'react';

export const StatCard = ({ icon, value, label, color = 'text-indigo-400' }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-slate-800 ${color}`}>{icon}</div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  </div>
);
