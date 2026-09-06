import React, { useState } from 'react';

interface SystemSettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onShowToast: (msg: string) => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  isDarkMode,
  onToggleTheme,
  onShowToast,
}) => {
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);
  const [clusterThreshold, setClusterThreshold] = useState<number>(50); // meters
  const [minConfidence, setMinConfidence] = useState<number>(85); // %
  const [activeTab, setActiveTab] = useState<string>('General');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-primary">
              Control Panel & System Parameters
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-on-surface font-bold tracking-tight">
            System Settings
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-on-surface-variant mt-1">
            Configure AI computer vision thresholds, automated dispatch triggers, and role permissions.
          </p>
        </div>

        {/* Save Settings Button */}
        <button
          onClick={() => onShowToast('All system configurations saved successfully!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:text-on-primary text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          Save Preferences
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-outline-variant/20 pb-3">
        {['General', 'AI Models & Triage', 'Integrations & Webhooks', 'Access Control'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white dark:bg-primary dark:text-on-primary shadow-sm'
                : 'text-gray-600 dark:text-on-surface-variant hover:bg-gray-100 dark:hover:bg-surface-variant/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Appearance & Theme Setting */}
          <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-outline-variant/20">
            <h3 className="font-bold text-base text-gray-900 dark:text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500 text-[20px]">palette</span>
              Appearance & Theme
            </h3>
            <p className="text-xs text-gray-500 dark:text-on-surface-variant mb-4">
              Select your preferred visual mode for high-contrast day operations or low-light command rooms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  if (isDarkMode) onToggleTheme();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  !isDarkMode
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50'
                    : 'border-gray-200 dark:border-outline-variant/20 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white shadow border border-gray-200 flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined">light_mode</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-on-surface">Light Theme</div>
                  <div className="text-xs text-gray-500">Crisp daylight operational layout</div>
                </div>
              </div>

              <div
                onClick={() => {
                  if (!isDarkMode) onToggleTheme();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isDarkMode
                    ? 'border-cyan-400 ring-2 ring-cyan-400/20 bg-cyan-950/20'
                    : 'border-gray-200 dark:border-outline-variant/20 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-900 shadow border border-gray-700 flex items-center justify-center text-cyan-400">
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-on-surface">Dark Command Mode</div>
                  <div className="text-xs text-gray-500">High-tech night visual command palette</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Deduplication & Classification Thresholds */}
          <div className="glass-card rounded-2xl p-6 border border-gray-200 dark:border-outline-variant/20">
            <h3 className="font-bold text-base text-gray-900 dark:text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-500 dark:text-secondary text-[20px]">psychology</span>
              AI Vision & Triage Parameters
            </h3>
            <p className="text-xs text-gray-500 dark:text-on-surface-variant mb-5">
              Tune confidence levels required before tickets automatically elevate to emergency escalation.
            </p>

            <div className="space-y-5">
              {/* Slider 1: Confidence Threshold */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-800 dark:text-on-surface mb-1">
                  <span>Minimum AI Confidence for Auto-Escalation</span>
                  <span className="font-mono text-blue-600 dark:text-primary">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-surface-variant rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>50% (Permissive)</span>
                  <span>99% (Strict verification)</span>
                </div>
              </div>

              {/* Slider 2: Geo-clustering radius */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-800 dark:text-on-surface mb-1">
                  <span>Geographic Duplicate Clustering Radius</span>
                  <span className="font-mono text-cyan-600 dark:text-secondary">{clusterThreshold} meters</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={clusterThreshold}
                  onChange={(e) => setClusterThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-surface-variant rounded-lg appearance-none cursor-pointer accent-cyan-500 dark:accent-secondary"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>10m (Tight)</span>
                  <span>200m (Broad intersection radius)</span>
                </div>
              </div>

              {/* Toggle: Automated Field Crew Dispatch */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-outline-variant/20">
                <div>
                  <div className="font-semibold text-xs text-gray-900 dark:text-on-surface">
                    Automated Field Crew Dispatch for P1 Critical Incidents
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-on-surface-variant">
                    Instantly notifies closest available municipal rapid response truck when AI confidence exceeds 95%.
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAutoDispatch(!autoDispatch);
                    onShowToast(
                      autoDispatch ? 'Automated dispatch disabled' : 'Automated dispatch enabled for P1 criticals'
                    );
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    autoDispatch ? 'bg-blue-600 dark:bg-primary' : 'bg-gray-300 dark:bg-surface-variant'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoDispatch ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: System Info & Status (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-outline-variant/20">
            <h3 className="font-bold text-sm text-gray-900 dark:text-on-surface mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
              System Environment
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-outline-variant/20">
                <span className="text-gray-500">Core Engine:</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-on-surface">UrbanEye v2.8.4</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-outline-variant/20">
                <span className="text-gray-500">AI Vision Model:</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-on-surface">Gemini 1.5 Flash</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-outline-variant/20">
                <span className="text-gray-500">Database Engine:</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-on-surface">Cloud Firestore Cluster</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">System Uptime:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">99.98%</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-outline-variant/20">
            <h3 className="font-bold text-sm text-gray-900 dark:text-on-surface mb-2">Emergency Protocols</h3>
            <p className="text-xs text-gray-500 dark:text-on-surface-variant mb-4">
              Trigger broadcast notifications to district supervisors and emergency services.
            </p>
            <button
              onClick={() => onShowToast('Sent test ping to all district supervisor pagers')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-surface-variant/50 dark:hover:bg-surface-variant text-gray-800 dark:text-on-surface rounded-lg text-xs font-semibold transition-colors"
            >
              Test Rapid Notification Ping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
