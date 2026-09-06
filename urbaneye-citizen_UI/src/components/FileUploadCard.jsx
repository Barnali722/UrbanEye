import React from 'react';

export default function FileUploadCard({ icon: Icon, title, subtitle, colorClass = "text-blue-400" }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        {title}
      </label>
      <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-slate-800/50 transition-colors cursor-pointer group">
        <Icon className={`w-8 h-8 mb-2 mx-auto text-slate-500 group-hover:${colorClass} transition-colors`} />
        <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
        <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
