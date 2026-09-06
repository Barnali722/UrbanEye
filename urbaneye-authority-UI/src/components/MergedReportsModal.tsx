import React from 'react';
import { 
  X, 
  GitMerge, 
  Sparkles, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Bot, 
  PhoneCall, 
  Smartphone, 
  Twitter 
} from 'lucide-react';
import { Incident } from '../types';

interface MergedReportsModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const MergedReportsModal: React.FC<MergedReportsModalProps> = ({
  incident,
  onClose,
}) => {
  if (!incident) return null;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Civic App':
        return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
      case 'Twitter/X':
        return <Twitter className="w-3.5 h-3.5 text-sky-400" />;
      case 'WhatsApp Bot':
        return <Bot className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Hotline 311':
        return <PhoneCall className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div 
      id="modal-merged-reports"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-start justify-between bg-gradient-to-r from-cyan-50/50 via-white to-blue-50/50 dark:from-cyan-950/40 dark:via-gray-900 dark:to-blue-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <GitMerge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-cyan-950/80 px-2 py-0.5 rounded">
                  Incident {incident.incidentNumber}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Merged & Clustered
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-headline mt-1">
                {incident.title}
              </h3>
            </div>
          </div>

          <button
            id="close-merged-reports-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Deduplication Banner */}
        <div className="px-5 py-3 bg-cyan-50 dark:bg-cyan-950/30 border-b border-cyan-100 dark:border-cyan-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-200">
            <span className="font-bold">Core Intelligence:</span>
            <span>Synthesized <strong>{incident.reportsMergedCount} noisy complaints</strong> into 1 actionable urban incident.</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-200/80 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-mono font-bold">
            {incident.aiConfidence}% match
          </span>
        </div>

        {/* Scrollable List of Raw Reports */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Raw Incoming Citizen Complaints Sample
          </div>

          {incident.rawCitizenReports.map((report) => (
            <div 
              key={report.id}
              className="p-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10">
                    {getSourceIcon(report.source)}
                  </span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {report.citizen}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    via {report.source}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    report.sentiment === 'Urgent' 
                      ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300' 
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                  }`}>
                    {report.sentiment}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {report.timestamp}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{report.excerpt}"
              </p>

              <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-500" />
                <span>Reported location: {report.locationDetail}</span>
              </div>
            </div>
          ))}

          {incident.reportsMergedCount > incident.rawCitizenReports.length && (
            <div className="text-center py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded-lg border border-dashed border-gray-300 dark:border-white/10">
              + {incident.reportsMergedCount - incident.rawCitizenReports.length} more duplicate citizen messages clustered within 150m radius.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-950/50 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Target Action: <strong className="text-gray-800 dark:text-gray-200">{incident.recommendedAction}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
