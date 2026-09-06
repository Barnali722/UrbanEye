import React, { useState } from 'react';

interface AnalyticsViewProps {
  onShowToast: (msg: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onShowToast }) => {
  const [timeRange, setTimeRange] = useState<string>('This Week');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-primary">
              City Civic Intelligence Metrics
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-on-surface font-bold tracking-tight">
            Municipal Analytics
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-on-surface-variant mt-1">
            Response times, AI triage accuracy, duplicate suppression efficiency, and department workloads.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['Today', 'This Week', 'This Month', 'Q3 2026'].map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                onShowToast(`Showing analytics for ${range}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white dark:bg-primary dark:text-on-primary border-transparent shadow-sm'
                  : 'bg-white/80 dark:bg-surface-variant/30 text-gray-700 dark:text-on-surface-variant border-gray-200 dark:border-outline-variant/30 hover:bg-gray-100 dark:hover:bg-surface-variant/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level Scorecard Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Mean Response Time
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-on-surface">38m</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">-14m vs avg</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-on-surface-variant">SLA adherence: 94.2%</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-cyan-300 dark:border-cyan-500/30 bg-cyan-50/30 dark:bg-cyan-950/20 flex flex-col justify-between">
          <div className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">
            AI Deduplication Rate
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-cyan-900 dark:text-cyan-200">97.8%</span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">1,240 merged</span>
          </div>
          <p className="text-[11px] text-cyan-700 dark:text-cyan-300">Clean single-ticket dispatch</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Resolution Velocity
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-on-surface">312</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+18% vs LW</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-on-surface-variant">Verified fixes closed</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 dark:text-on-surface-variant uppercase tracking-wider">
            Citizen Satisfaction
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-on-surface">4.82</span>
            <span className="text-xs font-bold text-amber-500">★ ★ ★ ★ ★</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-on-surface-variant">Based on 840 ratings</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Workload & Performance (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500 text-[20px]">domain</span>
                Department Resolution Performance
              </h3>
              <span className="text-xs text-gray-400 font-mono">Live SLA Tracking</span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Roads & Asphalt Maintenance', count: 184, resolved: 142, pct: 77, color: 'bg-blue-600 dark:bg-primary' },
                { name: 'Sanitation & Solid Waste', count: 128, resolved: 114, pct: 89, color: 'bg-cyan-500 dark:bg-secondary' },
                { name: 'Stormwater & Flood Control', count: 96, resolved: 68, pct: 71, color: 'bg-amber-500' },
                { name: 'Electrical & Street Lighting', count: 74, resolved: 70, pct: 95, color: 'bg-emerald-500' },
              ].map((dept, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-800 dark:text-on-surface">
                    <span>{dept.name}</span>
                    <span className="text-gray-500 dark:text-on-surface-variant font-mono">
                      {dept.resolved} / {dept.count} ({dept.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 dark:bg-surface-variant rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-outline-variant/20 flex items-center justify-between text-xs text-gray-500 dark:text-on-surface-variant">
            <span>Overall civic efficiency index: <strong className="text-gray-900 dark:text-on-surface">83%</strong></span>
            <button
              onClick={() => onShowToast('Downloaded department SLA report (CSV)')}
              className="text-blue-600 dark:text-primary font-bold hover:underline"
            >
              Export Breakdown →
            </button>
          </div>
        </div>

        {/* AI Confidence & Model Metrics (5 Cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-500 dark:text-secondary text-[20px]">psychology</span>
                Gemini Vision Triage Accuracy
              </h3>
            </div>

            <div className="bg-gray-50 dark:bg-surface-variant/30 rounded-xl p-4 border border-gray-200 dark:border-outline-variant/20 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-on-surface-variant font-medium">Auto-Classification Accuracy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">98.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-on-surface-variant font-medium">Duplicate Cluster Precision</span>
                <span className="font-bold text-cyan-600 dark:text-secondary font-mono">99.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-on-surface-variant font-medium">False Positive Suppression</span>
                <span className="font-bold text-blue-600 dark:text-primary font-mono">96.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-on-surface-variant font-medium">Avg Triage Latency</span>
                <span className="font-bold text-gray-900 dark:text-on-surface font-mono">320ms</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-on-surface-variant mt-4 leading-relaxed">
              Automated image validation reduces manual inspection dispatch load by <strong>64%</strong> across all metropolitan districts.
            </p>
          </div>

          <button
            onClick={() => onShowToast('Model weights and telemetry verified.')}
            className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-surface-variant/50 dark:hover:bg-surface-variant text-gray-800 dark:text-on-surface rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Configure AI Confidence Bounds
          </button>
        </div>
      </div>
    </div>
  );
};
