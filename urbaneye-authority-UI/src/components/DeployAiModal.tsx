import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Server, 
  RefreshCw,
  Gauge
} from 'lucide-react';

interface DeployAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const DeployAiModal: React.FC<DeployAiModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-pro');
  const [visionDetection, setVisionDetection] = useState<boolean>(true);
  const [dedupClustering, setDedupClustering] = useState<boolean>(true);
  const [sentimentPriority, setSentimentPriority] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      onShowToast(`AI Model (${selectedModel}) successfully synchronized across all municipal nodes.`);
      onClose();
    }, 1000);
  };

  return (
    <div 
      id="modal-deploy-ai"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#15191b] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-50/70 via-white to-blue-50/50 dark:from-cyan-950/40 dark:via-[#15191b] dark:to-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                <span>Deploy AI Priority Pipeline</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/40">
                  v2.4 Active
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Configure civic vision models, deduplication clustering, and triage heuristics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Active Model Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Inference Engine Selection</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Deep multimodal reasoning & OCR', latency: '42ms', perf: '98.4%' },
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Ultra-low latency triage stream', latency: '12ms', perf: '96.1%' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedModel === m.id
                      ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/30 ring-2 ring-cyan-500/20'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{m.name}</span>
                      {selectedModel === m.id && <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{m.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-gray-500 dark:text-gray-400 border-t border-gray-200/60 dark:border-white/10 pt-2">
                    <span>Latency: {m.latency}</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-300">Accuracy: {m.perf}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Feature Toggles */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              Active Neural Pipelines
            </span>

            {[
              { label: 'Computer Vision Road & Flood Severity Analysis', state: visionDetection, set: setVisionDetection, desc: 'Auto-measures pothole depth and flood level from citizen photos.' },
              { label: 'Spatial-Temporal Incident Deduplication Clustering', state: dedupClustering, set: setDedupClustering, desc: 'Merges identical geotagged reports within 50m radius into a single master ticket.' },
              { label: 'Citizen Sentiment & Crisis Tone Analysis', state: sentimentPriority, set: setSentimentPriority, desc: 'Escalates emergencies when multiple citizens report traffic blockage or hazard.' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">{feature.label}</div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{feature.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={feature.state}
                    onChange={(e) => feature.set(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Model Health Telemetry */}
          <div className="p-3.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-300 font-medium">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>Current GPU Cluster Load: <strong>34%</strong> (Nominal)</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">ALL SYSTEMS HEALTHY</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#101415] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synchronizing Nodes...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Deploy & Sync Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
