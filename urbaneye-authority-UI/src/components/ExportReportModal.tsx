import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Table, 
  Map, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Building, 
  Filter,
  Sparkles,
  Printer
} from 'lucide-react';
import { mockIncidents } from '../data/mockIncidents';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState<'csv' | 'pdf' | 'geojson' | 'excel'>('pdf');
  const [dateRange, setDateRange] = useState<string>('last-7-days');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [includeAiClustering, setIncludeAiClustering] = useState<boolean>(true);
  const [includePhotos, setIncludePhotos] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleExport = () => {
    setIsGenerating(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
      setProgress(100);

      // Trigger actual download
      if (format === 'csv') {
        const headers = 'Incident ID,Title,Category,Status,Location,Coordinates,Reported Time,Assigned Crew,AI Confidence\n';
        const rows = mockIncidents.map(inc => 
          `"${inc.incidentNumber}","${inc.title.replace(/"/g, '""')}","${inc.category}","${inc.status}","${inc.location.replace(/"/g, '""')}","${inc.coordinates.lat}, ${inc.coordinates.lng}","${inc.reportedTimeAgo}","${inc.assignedCrew || 'Unassigned'}","${inc.aiConfidence}%"`
        ).join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `UrbanEye_Incidents_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'geojson') {
        const geojson = {
          type: 'FeatureCollection',
          features: mockIncidents.map(inc => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [inc.coordinates.lng, inc.coordinates.lat]
            },
            properties: {
              id: inc.id,
              incidentNumber: inc.incidentNumber,
              title: inc.title,
              category: inc.category,
              status: inc.status,
              confidence: inc.aiConfidence
            }
          }))
        };
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `UrbanEye_GIS_Layer_${new Date().toISOString().slice(0,10)}.geojson`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF / Excel simulation message with instant feedback
        onShowToast(`Report generated: UrbanEye_${format.toUpperCase()}_Summary.pdf downloaded.`);
      }

      onShowToast(`Export complete: ${format.toUpperCase()} municipal dossier generated.`);
      onClose();
    }, 900);
  };

  return (
    <div 
      id="modal-export-report"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#15191b] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/50 dark:from-blue-950/40 dark:via-[#15191b] dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                <span>Export Municipal Incident Report</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-cyan-800/40">
                  LIVE GIS
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Generate authenticated audit summaries, GIS layers, and executive briefing packages.
              </p>
            </div>
          </div>
          <button
            id="close-export-modal"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Choose Export Format</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'pdf', name: 'Executive PDF', desc: 'Charts & Briefing', icon: FileText, badge: 'Recommended' },
                { id: 'csv', name: 'CSV Dataset', desc: 'Raw Incident Table', icon: Table, badge: 'Standard' },
                { id: 'geojson', name: 'GeoJSON GIS', desc: 'Map Layer Bounds', icon: Map, badge: 'Spatial' },
                { id: 'excel', name: 'Excel Matrix', desc: 'SLA & Resolution', icon: Table, badge: 'Audited' },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as any)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/80 dark:bg-cyan-950/30 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
                      </div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{fmt.name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{fmt.desc}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold mt-2 text-blue-700 dark:text-cyan-300">
                      {fmt.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtering Criteria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Time Period</span>
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today" className="dark:bg-gray-900">Today (Last 24 Hours)</option>
                <option value="last-7-days" className="dark:bg-gray-900">Last 7 Days (Current Sprint)</option>
                <option value="month-to-date" className="dark:bg-gray-900">Month to Date (August 2026)</option>
                <option value="quarter" className="dark:bg-gray-900">Q3 Civic Resolution Quarter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Municipal Zone / Ward</span>
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="dark:bg-gray-900">All Zones (City-Wide Master Dataset)</option>
                <option value="sector-5" className="dark:bg-gray-900">Sector 5 (Arterial Corridor B)</option>
                <option value="ward-12" className="dark:bg-gray-900">Ward 12 (Market Square)</option>
                <option value="central" className="dark:bg-gray-900">Central Avenue (Underpass Grid)</option>
              </select>
            </div>
          </div>

          {/* Additional Inclusions */}
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Advanced Data Payload Options</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAiClustering}
                  onChange={(e) => setIncludeAiClustering(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-white/20 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Include AI Duplicate Clustering & Deduplication Metrics
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includePhotos}
                  onChange={(e) => setIncludePhotos(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-white/20 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Include High-Res Citizen Verification Photos
                </span>
              </label>
            </div>
          </div>

          {/* Dossier Preview Summary */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
              <span>
                <strong>Payload Preview:</strong> 1,284 logged incidents, 42 active tickets, 94.2% AI confidence score.
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-cyan-300">~2.4 MB</span>
          </div>

          {/* Progress bar during generation */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-blue-600 dark:text-cyan-300">
                <span>Compiling Dossier & Cryptographic Verification...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#101415] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="confirm-export-button"
            type="button"
            onClick={handleExport}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Dossier ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
