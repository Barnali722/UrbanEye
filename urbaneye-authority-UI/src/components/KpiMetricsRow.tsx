import React from 'react';
import { 
  AlertCircle, 
  GitMerge, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { KpiData } from '../types';

interface KpiMetricsRowProps {
  kpis: KpiData;
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({ kpis }) => {
  return (
    <section aria-label="Key Incident Intelligence Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* KPI 1: Active Incidents */}
      <div 
        id="kpi-card-active-incidents"
        className="glass-card rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group border border-gray-200/80 dark:border-white/10"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 dark:bg-blue-400/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Active Incidents
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-headline">
            {kpis.activeIncidents}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5 inline" /> In Hand
          </span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Consolidated civic clusters</p>
      </div>

      {/* KPI 2: Critical Priority */}
      <div 
        id="kpi-card-critical-priority"
        className="glass-card rounded-xl p-5 flex flex-col justify-between relative overflow-hidden border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-950/20 glow-critical group"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Critical Priority
          </span>
          <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-300">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl md:text-4xl font-extrabold text-red-600 dark:text-red-400 font-headline">
            {kpis.criticalPriority}
          </span>
          <span className="text-[11px] font-medium text-red-700 dark:text-red-300">🔴 P1 Urgent</span>
        </div>
        <p className="text-[11px] text-red-600/80 dark:text-red-300/80 mt-1">Requires immediate action</p>
      </div>

      {/* KPI 3: Duplicate Reports Merged by AI (HIGHLIGHTED to showcase system efficiency) */}
      <div 
        id="kpi-card-merged-reports"
        className="glass-card rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group border-cyan-300/60 dark:border-cyan-500/40 bg-gradient-to-br from-cyan-50/70 via-white/80 to-blue-50/70 dark:from-cyan-950/30 dark:via-gray-900/50 dark:to-blue-950/20 shadow-md ring-1 ring-cyan-400/30"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125" />
        
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300" />
            Duplicate Reports Merged by AI
          </span>
          <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
            <GitMerge className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-cyan-200 font-headline">
            {kpis.duplicateReportsMerged.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-0.5 rounded-full">
            97.8% Noise Reduced
          </span>
        </div>
        <p className="text-[11px] text-cyan-800 dark:text-cyan-300/80 mt-1 font-medium">
          Many noisy complaints → One actionable incident
        </p>
      </div>

      {/* KPI 4: Resolved this Week */}
      <div 
        id="kpi-card-resolved-week"
        className="glass-card rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group border border-gray-200/80 dark:border-white/10"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        
        <div className="flex items-center justify-between relative z-10 mb-2">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Resolved this Week
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-headline">
            {kpis.resolvedThisWeek}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            +18% vs prev week
          </span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Verified civic clearances</p>
      </div>
    </section>
  );
};
