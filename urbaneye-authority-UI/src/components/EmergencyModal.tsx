import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  ShieldAlert, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Siren 
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [protocolActivated, setProtocolActivated] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    setProtocolActivated(true);
    setTimeout(() => {
      // Keep state or auto close
    }, 2000);
  };

  return (
    <div 
      id="modal-emergency-protocol"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden text-center p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-500 border border-red-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Siren className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white font-headline">
          Emergency Civic Protocol
        </h3>

        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
          This initiates highest-priority municipal mobilization. Multi-agency alert channels will be activated across all 12 Wards and emergency responders will be dispatched.
        </p>

        {protocolActivated ? (
          <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm font-headline">Protocol Activated across Wards 1-12</span>
          </div>
        ) : (
          <div className="my-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-left text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Target Escalations:</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              • Incident #104 (College Rd Pothole) - Cordon Route<br />
              • Incident #108 (Station Rd Flood) - Activate Pumps<br />
              • AI Broadcast to Commuter Transit Grid
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {protocolActivated ? 'Close Window' : 'Cancel'}
          </button>
          {!protocolActivated && (
            <button
              id="btn-confirm-emergency"
              onClick={handleActivate}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-headline shadow-lg shadow-red-600/40 flex items-center gap-2"
            >
              <AlertOctagon className="w-4 h-4" />
              Authorize Emergency Dispatch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
