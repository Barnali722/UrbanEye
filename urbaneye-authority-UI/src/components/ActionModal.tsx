import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Send, 
  MapPin, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Incident, IncidentStatus } from '../types';

interface ActionModalProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateStatus: (incidentId: string, newStatus: IncidentStatus, notes: string) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  incident,
  onClose,
  onUpdateStatus,
}) => {
  if (!incident) return null;

  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>(incident.status);
  const [selectedCrew, setSelectedCrew] = useState<string>(incident.assignedCrew || 'Zone Rapid Response Unit');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateStatus(incident.id, selectedStatus, notes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div 
      id="modal-take-action"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-start justify-between bg-gradient-to-r from-red-50/50 via-white to-blue-50/50 dark:from-red-950/30 dark:via-gray-900 dark:to-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded">
                  Incident {incident.incidentNumber}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Priority {incident.priorityScore}/100
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-headline mt-1">
                Dispatch & Action Console
              </h3>
            </div>
          </div>

          <button
            id="close-action-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Recommended Action Callout */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommended Immediate Action:</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {incident.recommendedAction}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Location: {incident.location} ({incident.sector})
            </p>
          </div>

          {/* Action Status Selection */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Update Incident Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Investigating', 'Dispatched', 'In Progress', 'Resolved'] as IncidentStatus[]).map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`py-2 px-3 rounded-xl font-medium border text-center transition-all ${
                    selectedStatus === status
                      ? status === 'Resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                        : 'bg-blue-600 text-white border-blue-600 font-bold shadow-md'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Crew */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Assigned Field Response Unit
            </label>
            <div className="relative">
              <select
                value={selectedCrew}
                onChange={(e) => setSelectedCrew(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/15 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Zone 5 Quick Response Paving Unit">Zone 5 Quick Response Paving Unit</option>
                <option value="Drainage Rapid Clear Squad 2">Drainage Rapid Clear Squad 2</option>
                <option value="Hydro-Jetting Crew 04">Hydro-Jetting Crew 04</option>
                <option value="Sanitation Route 12 Compactors">Sanitation Route 12 Compactors</option>
                <option value="Emergency Structural Team Alpha">Emergency Structural Team Alpha</option>
              </select>
            </div>
          </div>

          {/* Dispatch Notes */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1.5">
              Dispatcher Directives / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`e.g., Crew dispatched with heavy cold-mix asphalt patcher. Priority lane cordon authorized.`}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-white/15 rounded-xl p-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-confirm-action"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all font-headline"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Directives
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
