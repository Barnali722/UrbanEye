import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Plus, 
  Minus, 
  Compass, 
  Maximize2, 
  Sparkles, 
  MapPin, 
  GitMerge, 
  ArrowRight,
  ShieldAlert,
  Crosshair
} from 'lucide-react';
import { Incident, PriorityTier } from '../types';

interface CivicIncidentMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  onTakeAction: (incident: Incident) => void;
}

export const CivicIncidentMap: React.FC<CivicIncidentMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onTakeAction,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'heatmap' | 'sat'>('all');
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);

  const getPinColorClass = (tier: PriorityTier) => {
    switch (tier) {
      case 'P1 Critical':
        return 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] border-red-200';
      case 'P2 High':
        return 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.6)] border-orange-200';
      case 'P3 Medium':
        return 'bg-amber-400 text-gray-900 shadow-[0_0_10px_rgba(245,158,11,0.5)] border-amber-100';
      case 'P4 Low':
        return 'bg-cyan-400 text-gray-900 shadow-[0_0_10px_rgba(34,211,238,0.5)] border-cyan-100';
    }
  };

  const getPinDotGlow = (tier: PriorityTier) => {
    switch (tier) {
      case 'P1 Critical':
        return 'bg-red-500 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.8)]';
      case 'P2 High':
        return 'bg-orange-500 border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.7)]';
      case 'P3 Medium':
        return 'bg-amber-400 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.6)]';
      case 'P4 Low':
        return 'bg-cyan-400 border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.6)]';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[460px] lg:min-h-[580px]">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-headline">
          <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <MapIcon className="w-5 h-5 inline" />
          </span>
          Civic Incident Map
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live GIS Feeds</span>
        </div>
      </div>

      {/* Main Map Container */}
      <div 
        id="civic-incident-map-container"
        className="rounded-2xl flex-1 relative overflow-hidden flex flex-col bg-slate-900 shadow-xl border border-gray-200 dark:border-white/10 select-none group"
      >
        {/* Background GIS Grid & Radar Aesthetics */}
        <div className="absolute inset-0 bg-[#0c1219] overflow-hidden">
          {/* Tech GIS Grid */}
          <svg className="opacity-25 absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gis-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4a5568" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gis-grid-pattern)" />
          </svg>

          {/* City Road Network Vector Simulation */}
          <svg className="opacity-35 absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Primary arterial routes */}
            <path d="M -20 180 Q 150 140, 300 220 T 600 200" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 3" />
            <path d="M 200 -20 Q 220 200, 180 400 T 320 650" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M 50 350 L 550 320" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 380 -10 L 410 500" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="210" cy="200" r="45" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="210" cy="200" r="90" fill="none" stroke="#0284c7" strokeWidth="0.5" />
          </svg>

          {/* Dynamic AI Heatmap Blobs */}
          {activeLayer !== 'sat' && (
            <>
              {/* College Rd / Sector 5 heat spot (Critical) */}
              <div 
                className="absolute w-44 h-44 bg-red-600 rounded-full blur-[65px] opacity-35 pointer-events-none transition-all duration-700"
                style={{ top: '22%', left: '30%' }}
              />
              {/* Station Road heat spot (Critical) */}
              <div 
                className="absolute w-36 h-36 bg-red-500 rounded-full blur-[55px] opacity-30 pointer-events-none transition-all duration-700"
                style={{ top: '15%', left: '60%' }}
              />
              {/* Sector V heat spot (High) */}
              <div 
                className="absolute w-32 h-32 bg-orange-500 rounded-full blur-[50px] opacity-25 pointer-events-none transition-all duration-700"
                style={{ top: '48%', left: '20%' }}
              />
              {/* Park Street heat spot (Medium) */}
              <div 
                className="absolute w-28 h-28 bg-amber-400 rounded-full blur-[45px] opacity-20 pointer-events-none transition-all duration-700"
                style={{ top: '55%', left: '62%' }}
              />
            </>
          )}

          {/* Compass / Watermark in background */}
          <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono text-cyan-400/60 pointer-events-none">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>GRID: 28.6139° N, 77.2090° E</span>
          </div>
        </div>

        {/* Floating Map Controls */}
        <div className="absolute top-3.5 right-3.5 z-20 flex flex-col gap-2">
          {/* Zoom Buttons */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col bg-gray-900/80 border border-white/15 backdrop-blur-md shadow-lg">
            <button 
              id="map-btn-zoom-in"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="w-8 h-8 flex items-center justify-center text-gray-200 hover:bg-white/10 hover:text-white transition-colors border-b border-white/10"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              id="map-btn-zoom-out"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="w-8 h-8 flex items-center justify-center text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Layer Toggle */}
          <button 
            id="map-btn-toggle-layers"
            onClick={() => setActiveLayer(prev => prev === 'all' ? 'heatmap' : prev === 'heatmap' ? 'sat' : 'all')}
            className={`glass-panel w-8 h-8 rounded-xl flex items-center justify-center transition-colors border border-white/15 backdrop-blur-md shadow-lg ${
              activeLayer !== 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-900/80 text-gray-200 hover:bg-white/10'
            }`}
            title={`Active layer: ${activeLayer}`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Recenter */}
          <button 
            id="map-btn-recenter"
            onClick={() => setZoomLevel(1)}
            className="glass-panel w-8 h-8 rounded-xl flex items-center justify-center text-gray-200 hover:bg-white/10 bg-gray-900/80 border border-white/15 backdrop-blur-md shadow-lg transition-colors"
            title="Reset Map View"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Incident Map Pins */}
        <div 
          className="absolute inset-0 z-10 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {incidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const isHovered = hoveredIncident?.id === incident.id;
            
            return (
              <div
                key={incident.id}
                id={`map-pin-${incident.id}`}
                style={{
                  top: `${incident.coordinates.mapYPercent}%`,
                  left: `${incident.coordinates.mapXPercent}%`,
                }}
                onMouseEnter={() => setHoveredIncident(incident)}
                onMouseLeave={() => setHoveredIncident(null)}
                onClick={() => onSelectIncident(incident)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group/pin transition-all duration-300 z-10"
              >
                {/* Floating Tooltip / Info Card */}
                {(isSelected || isHovered) && (
                  <div className="absolute bottom-full mb-2.5 w-56 p-2.5 rounded-xl bg-gray-950/95 text-white border border-white/20 backdrop-blur-xl shadow-2xl z-30 animate-in fade-in zoom-in-95 pointer-events-auto">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">
                        Incident {incident.incidentNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800/60 font-bold">
                        {incident.priorityScore}/100
                      </span>
                    </div>

                    <div className="text-xs font-bold text-gray-100 truncate mb-1">
                      {incident.title}
                    </div>

                    <div className="text-[11px] text-gray-300 flex items-center gap-1 mb-2">
                      <GitMerge className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{incident.reportsMergedCount} complaints merged</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTakeAction(incident);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors text-center"
                      >
                        Take Action
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(incident);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-gray-200 text-[10px] font-medium py-1 px-2 rounded-lg transition-colors"
                      >
                        Focus
                      </button>
                    </div>

                    {/* Caret arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-950" />
                  </div>
                )}

                {/* Pin Head & Pulsing Ring */}
                <div className="relative flex items-center justify-center">
                  {/* Pulsing ring for critical/high incidents */}
                  {(incident.priorityTier === 'P1 Critical' || isSelected) && (
                    <div className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                  )}

                  {/* Pin Circle Body */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] transition-all duration-300 marker-pulse ${
                      getPinDotGlow(incident.priorityTier)
                    } ${
                      isSelected
                        ? 'scale-135 ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.9)]'
                        : 'hover:scale-125'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                {/* Subtitle tag */}
                <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium font-mono bg-black/80 text-gray-200 border border-white/10 whitespace-nowrap shadow-md">
                  {incident.incidentNumber}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Map Legend (Critical 🔴, High 🟠, Medium 🟡, Low 🟢) */}
        <div className="mt-auto z-20 p-3.5">
          <div className="glass-panel rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs bg-gray-950/85 text-white backdrop-blur-md border border-white/15 shadow-xl">
            {/* Title */}
            <div className="flex items-center gap-1.5 font-semibold text-gray-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Severity Legend:</span>
            </div>

            {/* Severity Items */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-gray-200 font-medium">🔴 Critical (P1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                <span className="text-gray-200 font-medium">🟠 High (P2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-gray-200 font-medium">🟡 Medium (P3)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-gray-200 font-medium">🟢 Low (P4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
