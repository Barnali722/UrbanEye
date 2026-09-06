import React, { useState } from 'react';
import roadDamageUploadedImg from '../assets/images/regenerated_image_1788097811288.jpg';
import garbageUploadedImg from '../assets/images/regenerated_image_1788099264363.jpg';
import waterloggingUploadedImg from '../assets/images/regenerated_image_1788099266227.jpg';

interface CitizenReportsViewProps {
  onShowToast: (msg: string) => void;
  onTakeAction: (incident: { title: string; location: string; category: string }) => void;
}

export const CitizenReportsView: React.FC<CitizenReportsViewProps> = ({
  onShowToast,
  onTakeAction,
}) => {
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Dynamic incident images with localStorage persistence
  const [incidentImages, setIncidentImages] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('urban_pulse_incident_images');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      roadDamage: roadDamageUploadedImg,
      garbage: garbageUploadedImg,
      waterlogging: waterloggingUploadedImg,
    };
  });

  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setIncidentImages((prev) => {
          const updated = { ...prev, [key]: dataUrl };
          try {
            localStorage.setItem('urban_pulse_incident_images', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
        onShowToast('Report image updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const reports = [
    {
      id: 'REP-8492',
      imageKey: 'roadDamage',
      title: 'Massive Pothole & Damaged Road Bed',
      location: 'Sector 5, Arterial Corridor B',
      citizen: 'Rahul S. (Verified Citizen • 98 pts)',
      time: '14 mins ago',
      category: 'Roadways',
      status: 'P1 CRITICAL',
      statusColor: 'bg-red-600 text-white dark:bg-error dark:text-on-error',
      duplicatesMerged: 20,
      image: incidentImages.roadDamage || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
      description: 'Multiple vehicles bottoming out. Sharp asphalt edges exposed after yesterday\'s rainfall. High risk for two-wheelers.',
      aiTriage: 'Automatically merged 20 identical geotagged complaints into single high-priority incident.',
    },
    {
      id: 'REP-8488',
      imageKey: 'garbage',
      title: 'Commercial Waste Container Overflow',
      location: 'Ward 12, Market Square',
      citizen: 'Priya Sharma (Resident Assoc. Secretary)',
      time: '42 mins ago',
      category: 'Sanitation',
      status: 'P2 HIGH',
      statusColor: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-black',
      duplicatesMerged: 12,
      image: incidentImages.garbage || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
      description: 'Waste has spilled across both pedestrian lanes creating sanitation obstruction.',
      aiTriage: 'Automated sanitation dispatch ticket generated and clustered.',
    },
    {
      id: 'REP-8475',
      imageKey: 'waterlogging',
      title: 'Underpass Waterlogging & Stalled Traffic',
      location: 'Central Avenue Underpass 4',
      citizen: 'Vikram K. (Commuter)',
      time: '1 hour ago',
      category: 'Drainage',
      status: 'P2 HIGH',
      statusColor: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-black',
      duplicatesMerged: 14,
      image: incidentImages.waterlogging || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      description: 'Water depth approximately 15-20cm under the rail bridge. Sump pump appears inactive.',
      aiTriage: 'Hydrology sensor correlation confirmed. Pump maintenance crew alerted.',
    },
  ];

  const filteredReports =
    activeStatus === 'All'
      ? reports
      : reports.filter((r) => r.status.toLowerCase().includes(activeStatus.toLowerCase()) || r.category.toLowerCase().includes(activeStatus.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-secondary">
              Citizen Reporting Feed & AI Clustering
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-on-surface font-bold tracking-tight">
            Citizen Reports
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-on-surface-variant mt-1">
            Direct mobile complaints deduplicated and verified by AI vision models before escalation.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', 'P1 Critical', 'Sanitation', 'Drainage', 'Roadways'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeStatus === status
                  ? 'bg-blue-600 text-white dark:bg-primary dark:text-on-primary border-transparent shadow-sm'
                  : 'bg-white/80 dark:bg-surface-variant/30 text-gray-700 dark:text-on-surface-variant border-gray-200 dark:border-outline-variant/30 hover:bg-gray-100 dark:hover:bg-surface-variant/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="glass-card rounded-2xl overflow-hidden border border-gray-200 dark:border-outline-variant/20 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div>
              {/* Photo Evidence */}
              <div className="relative h-48 w-full bg-black overflow-hidden group">
                <img
                  src={report.image}
                  alt={report.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow ${report.statusColor}`}>
                    {report.status}
                  </span>
                  <span className="bg-cyan-950/80 text-cyan-300 backdrop-blur text-[10px] font-semibold px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">call_merge</span>
                    {report.duplicatesMerged} Merged
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-cyan-400">schedule</span>
                    {report.time}
                  </span>
                  <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded border border-white/20">
                    {report.id}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-primary uppercase tracking-wider">
                    {report.category}
                  </div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-on-surface mt-0.5 leading-snug">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {report.location}
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-on-surface-variant leading-relaxed line-clamp-3">
                  {report.description}
                </p>

                {/* AI Clustering Box */}
                <div className="bg-cyan-50/70 dark:bg-surface-variant/40 rounded-xl p-3 text-xs text-cyan-900 dark:text-cyan-200 border border-cyan-200 dark:border-outline-variant/30 flex items-start gap-2">
                  <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-300 text-[18px] shrink-0 mt-0.5">
                    psychology
                  </span>
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-cyan-700 dark:text-cyan-300">
                      AI Triage Summary
                    </span>
                    <p className="text-[11px] text-gray-700 dark:text-on-surface-variant mt-0.5 leading-tight">
                      {report.aiTriage}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 dark:text-on-surface-variant pt-2 border-t border-gray-100 dark:border-outline-variant/20 flex items-center justify-between">
                  <span>Reported by: <strong className="text-gray-800 dark:text-on-surface">{report.citizen}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-2">
              <button
                onClick={() =>
                  onTakeAction({
                    title: report.title,
                    location: report.location,
                    category: report.category,
                  })
                }
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:text-on-primary text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Approve & Dispatch
              </button>
              <button
                onClick={() => onShowToast(`Opened merged evidence cluster for ${report.id}`)}
                className="px-3 py-2 border border-gray-300 dark:border-outline-variant rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-surface-variant/30 text-gray-700 dark:text-on-surface transition-colors"
              >
                Evidence ({report.duplicatesMerged})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
