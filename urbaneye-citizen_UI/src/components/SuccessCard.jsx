import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessCard({ onReset }) {
  return (
    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4"/>
      <h3 className="text-xl font-bold text-emerald-400 mb-2">Report Verified & Merged</h3>
      <p className="text-slate-300">
        <strong>AI identified:</strong> Pothole.<br/>
        Your report has been successfully grouped with <strong>4 existing reports</strong> in this exact area.<br/>
        <span className="text-amber-400 mt-2 block font-medium">Incident upgraded to CRITICAL priority.</span>
      </p>
      <button 
        onClick={onReset}
        className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600"
      >
        Report Another Issue
      </button>
    </div>
  );
}
