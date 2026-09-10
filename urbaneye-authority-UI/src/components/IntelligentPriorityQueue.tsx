import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users, 
  Wrench, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  GitMerge
} from 'lucide-react';
import { Incident, PriorityTier } from '../types';

interface IntelligentPriorityQueueProps {
  incidents: Incident[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSelectIncident: (incident: Incident) => void;
  onTakeAction: (incident: Incident) => void;
  onViewMergedReports: (incident: Incident) => void;
  selectedIncidentId?: string;
}

export const IntelligentPriorityQueue: React.FC<IntelligentPriorityQueueProps> = ({
  incidents,
  activeFilter,
  onFilterChange,
  onSelectIncident,
  onTakeAction,
  onViewMergedReports,
  selectedIncidentId,
}) => {
  const filteredIncidents = incidents.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'P1 Critical') return item.priorityTier === 'P1 Critical';
    if (activeFilter === 'P2 High') return item.priorityTier === 'P2 High';
    if (activeFilter === 'P3 Medium') return item.priorityTier === 'P3 Medium';
    return true;
  });

  // Top featured incident (Priority #104 or the selected one)
  const featuredIncident = incidents.find(i => i.id === (selectedIncidentId || 'inc-104')) || incidents[0];

  const getPriorityBadgeClass = (tier: PriorityTier) => {
    switch (tier) {
      case 'P1 Critical':
        return 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/60';
      case 'P2 High':
        return 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
      case 'P3 Medium':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      default:
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60';
    }
  };

  const getPriorityDot = (tier: PriorityTier) => {
    switch (tier) {
      case 'P1 Critical':
        return '🔴';
      case 'P2 High':
        return '🟠';
      case 'P3 Medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-headline">
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-5 h-5 inline" />
            </span>
            Intelligent Priority Queue
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Consolidated civic incidents ranked by AI Priority Score
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-200/80 dark:bg-white/5 rounded-xl border border-gray-300/60 dark:border-white/10 text-xs">
          {['All', 'P1 Critical', 'P2 High', 'P3 Medium'].map((filter) => (
            <button
              key={filter}
              id={`filter-btn-${filter.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter === 'P1 Critical' ? '🔴 P1 Critical' : filter === 'P2 High' ? '🟠 High' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Featured / Focus Incident Highlight Card */}
      {featuredIncident && (
        <div 
          id={`featured-incident-${featuredIncident.id}`}
          className="glass-card rounded-2xl overflow-hidden border-red-200/80 dark:border-red-500/30 glow-critical flex flex-col md:flex-row relative group bg-red-50/20 dark:bg-red-950/10 transition-all duration-300"
        >
          {/* Urgent indicator strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-red-600 z-20" />

          {/* Image Area */}
          <div className="w-full md:w-5/12 h-52 md:h-auto min-h-[220px] relative overflow-hidden bg-gray-900">
            {featuredIncident.imageSrc ? (
              <img
                alt={featuredIncident.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={featuredIncident.imageSrc}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-400 bg-gray-900/90">
                <Wrench className="w-12 h-12 mb-2 text-cyan-400 opacity-60" />
                <span className="text-xs font-mono">Telemetry & Satellite Feed</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
            
            {/* Top Badge: AI Priority */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="bg-red-600 dark:bg-red-500 text-white px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                {featuredIncident.priorityTier} ({featuredIncident.priorityScore}/100)
              </span>
            </div>

            {/* AI Reports Merged Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewMergedReports(featuredIncident);
              }}
              className="absolute top-3 right-3 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold border border-cyan-500/40 flex items-center gap-1.5 shadow-lg transition-all"
            >
              <GitMerge className="w-3.5 h-3.5 text-cyan-400" />
              <span>{featuredIncident.reportsMergedCount} Reports Merged</span>
            </button>

            {/* Bottom Meta Tags */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-xs">
              <div className="bg-black/60 backdrop-blur-md text-gray-200 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{featuredIncident.sector}</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md text-gray-200 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-300" />
                <span>{featuredIncident.reportedTimeAgo}</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                  Incident {featuredIncident.incidentNumber}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  AI Confidence: {featuredIncident.aiConfidence}%
                </span>
              </div>

              <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white font-headline mb-1.5">
                {featuredIncident.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                {featuredIncident.summary}
              </p>

              {/* High Impact Zone Box */}
              <div className="bg-white/70 dark:bg-white/5 rounded-xl p-3 mb-4 border border-red-200/60 dark:border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600 dark:text-red-400">High Impact Zone</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {featuredIncident.impactEstimation}
                  </div>
                </div>
              </div>

              {/* Recommended Action Pill */}
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-blue-50/80 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                  Target Action:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {featuredIncident.recommendedAction}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 mt-3 pt-3 border-t border-gray-200/80 dark:border-white/10">
              <button
                id="btn-take-action-featured"
                onClick={() => onTakeAction(featuredIncident)}
                className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all font-headline"
              >
                <Wrench className="w-4 h-4" />
                Take Action
              </button>

              <button
                id="btn-view-merged-reports"
                onClick={() => onViewMergedReports(featuredIncident)}
                className="px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <GitMerge className="w-4 h-4" />
                {featuredIncident.reportsMergedCount} Reports
              </button>

              <button
                id="btn-details-featured"
                onClick={() => onSelectIncident(featuredIncident)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High Priority Consolidated Incidents List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            All AI-Ranked Civic Incidents ({filteredIncidents.length})
          </h4>
          <span className="text-[11px] text-gray-400">Sorted by AI Priority Score</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredIncidents.map((incident) => {
            const isSelected = incident.id === featuredIncident?.id;
            return (
              <div
                key={incident.id}
                id={`incident-item-${incident.id}`}
                onClick={() => onSelectIncident(incident)}
                className={`glass-card rounded-xl p-3.5 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 dark:ring-cyan-400 bg-blue-50/40 dark:bg-blue-950/30'
                    : 'hover:bg-white dark:hover:bg-white/5'
                }`}
              >
                {/* Thumbnail & Image */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-gray-800 border border-gray-200 dark:border-white/10">
                    {incident.imageSrc ? (
                      <img
                        alt={incident.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        src={incident.imageSrc}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cyan-400 bg-gray-900">
                        <Wrench className="w-6 h-6 opacity-60" />
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-black/70 text-[9px] font-mono text-gray-300 px-1 rounded-bl">
                      {incident.incidentNumber}
                    </div>
                  </div>

                  {/* Main Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Priority Score Pill */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${getPriorityBadgeClass(incident.priorityTier)}`}>
                        <span>{getPriorityDot(incident.priorityTier)}</span>
                        <span>Priority: {incident.priorityScore}/100</span>
                      </span>

                      {/* AI Merge Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewMergedReports(incident);
                        }}
                        className="bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-cyan-300 dark:border-cyan-700/50 flex items-center gap-1"
                        title="Click to view raw complaints deduplicated by AI"
                      >
                        <GitMerge className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        <span>{incident.reportsMergedCount} Reports Merged</span>
                      </button>

                      {incident.status === 'Resolved' && (
                        <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate font-headline">
                      {incident.title}
                    </h5>

                    {/* Location & Action */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300 mt-1">
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[200px]">{incident.location}</span>
                      </span>

                      <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>

                      <span className="text-blue-600 dark:text-cyan-300 font-medium flex items-center gap-1">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Action:</span> {incident.recommendedAction}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Quick Action Button */}
                <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTakeAction(incident);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-white/5 hover:bg-blue-100 dark:hover:bg-white/10 text-blue-600 dark:text-cyan-400 text-xs font-semibold border border-blue-200/60 dark:border-white/10 transition-colors flex items-center gap-1"
                  >
                    Action
                  </button>
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors shrink-0 bg-white/80 dark:bg-black/20">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
