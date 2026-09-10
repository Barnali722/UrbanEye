import React from 'react';

export default function MetadataField({ icon: Icon, label, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-400"/>
        {label}
      </label>
      <div className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-400 flex items-center cursor-not-allowed">
        {value}
      </div>
    </div>
  );
}
