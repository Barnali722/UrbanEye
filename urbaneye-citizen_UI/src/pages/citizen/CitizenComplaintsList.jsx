import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  PlusCircle, 
  ShieldCheck, 
  Layers,
  Eye,
  Calendar,
  Building2
} from 'lucide-react';

export const MOCK_COMPLAINTS = [
  {
    id: '#CIV-10482',
    issueType: 'Pothole',
    location: 'College Road, Kolkata',
    date: '30 Aug 2026',
    time: '12:11 PM',
    aiStatus: 'AI Verified ✓',
    aiConfidence: '98.4% Confidence',
    priority: 'Priority: High',
    priorityLevel: 'high',
    currentStatus: 'Status: Assigned',
    statusBadge: 'Assigned',
    department: 'PWD Road Infrastructure Division',
    ward: 'Ward 42, North Zone',
    description: 'Large pothole near college gate measuring ~1.2m diameter. Causing severe traffic slowdowns and hazard for two-wheelers.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf30O0mli5Pw_N6J4da_8fI4niuJA7zzgFxkbl6tRdyLU73BERcNb1QtqtF5B_65Gu815WAA88QeWCkAvSaOMzPwDqVQDK5QBnZKJQutKy0juwyQPySBQlyztNmY5TPxD32YSz5dBSXaONdSECStABSr5qLExlRl6xZMbF34-ryyHW_vb6tU8xmc5ozuIUJC7S9aqOw4w0Hp_8kfIdlD7Ue-lrcPgQpQ3rOSWAlJs_iiTC2CUyCII',
    clusterCount: 4,
    timeline: [
      { step: 'Report Submitted', time: '12:11 PM', done: true },
      { step: 'AI Vision Analysis & Severity Ranked', time: '12:12 PM', done: true },
      { step: 'Assigned to Ward 42 Rapid Response Unit', time: '12:15 PM', done: true },
      { step: 'Dispatch & Road Patching Work', time: 'Estimated 3:00 PM', done: false }
    ]
  },
  {
    id: '#CIV-10483',
    issueType: 'Garbage Dumping',
    location: 'Park Street Junction, Sector 2',
    date: '29 Aug 2026',
    time: '08:45 AM',
    aiStatus: 'AI Verified ✓',
    aiConfidence: '96.2% Confidence',
    priority: 'Priority: Critical',
    priorityLevel: 'critical',
    currentStatus: 'Status: In Progress',
    statusBadge: 'In Progress',
    department: 'Municipal Solid Waste Management',
    ward: 'Ward 38, Central Zone',
    description: 'Commercial waste overflowing onto the pedestrian pathway creating sanitation and odor hazards.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0uVUCAPgdWEinM7V-LWSRyzQdjhYgpYUulJGfJ6gvEGim4bAdEzIlH9yplhP_Efjf9pKDm_zxc88k--QcuzrZW-75-pdRfdtwDTqDLJjU-bR9_XNKyk3Gc5Y7nU9pybZC6o1mDHi95pAmSAy7l_kkJOBPdI3ZxUAl1qaZxOnOh900eMVIFOUCuIZw7ciHuYoT09YSXv_db_-o2LJ2zGdTtdZrjbFe5Y4ImJUnuKIZdj0pcJcWlU8',
    clusterCount: 7,
    timeline: [
      { step: 'Report Submitted', time: '08:45 AM', done: true },
      { step: 'AI Vision Analysis & Waste Volume Estimated', time: '08:46 AM', done: true },
      { step: 'Sanitation Truck Dispatched', time: '09:10 AM', done: true },
      { step: 'Site Clearance & Chemical Wash', time: 'In Progress', done: false }
    ]
  },
  {
    id: '#CIV-10484',
    issueType: 'Waterlogging',
    location: 'Salt Lake Bypass, Sector V',
    date: '28 Aug 2026',
    time: '04:20 PM',
    aiStatus: 'AI Verified ✓',
    aiConfidence: '99.1% Confidence',
    priority: 'Priority: High',
    priorityLevel: 'high',
    currentStatus: 'Status: Resolved',
    statusBadge: 'Resolved',
    department: 'Stormwater & Drainage Division',
    ward: 'Ward 14, East Zone',
    description: 'Clogged storm drain leading to 1.5ft water stagnation across two vehicular lanes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE6_X0wcNsJjdizbm0u5ZM6z7TXR02MlYKnOLojy2fED1TjfgEi4GgCUo_9qZnCi-CsrLTl5FhuQ4SVnGW3C2e_i33w5uXIULPxFE9vcwfK7yzkyvlZIb_g4EjDRIetYXhBPEiyrwHZfviX7pgiVA1Of9dKUlStdwoTz1EXDnPnWMWhT59we9ID368_qwxnmu8-RO5z1rlDiGP8e8M5mPCq1K_Gv6D_c_ag5MmvHOaYdCKwlBsimw',
    clusterCount: 3,
    timeline: [
      { step: 'Report Submitted', time: '04:20 PM', done: true },
      { step: 'AI Water Depth Analysis Verified', time: '04:22 PM', done: true },
      { step: 'Drain Pump Vehicle Deployed', time: '04:45 PM', done: true },
      { step: 'Complete Drainage & Route Cleared', time: '06:10 PM', done: true }
    ]
  },
  {
    id: '#CIV-10479',
    issueType: 'Electric Hazard',
    location: 'Rashbehari Avenue, South Zone',
    date: '27 Aug 2026',
    time: '11:05 AM',
    aiStatus: 'AI Verified ✓',
    aiConfidence: '97.8% Confidence',
    priority: 'Priority: Critical',
    priorityLevel: 'critical',
    currentStatus: 'Status: Resolved',
    statusBadge: 'Resolved',
    department: 'WBSEDCL Electrical Safety Response',
    ward: 'Ward 51, South Zone',
    description: 'Low-hanging transformer cable sparking against tree branch after storm.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAydtk1Uqmr4z1XYhYsIP7UvBKx7JIZcNRZXI5kBxNj_hqEIa4bk8j_EiuM9aUzIfk7wrP1z5hayklrdZFrz3Cde38IbdgDhxX0OTdcFSNAPY_NPNFw0VTRnc4ZQRx7H_V90EIxTNuC2ri2tGgSx4LZ16tXpcjdv-oy_lAR_W8PsWahG23PgGuXU-DoJumUFLnWjrc0HPx-EQtF6h0yAYR_nFpbFlVp2l6x8DDqTwyY-AKIYg2j9Kc',
    clusterCount: 2,
    timeline: [
      { step: 'Report Submitted', time: '11:05 AM', done: true },
      { step: 'AI Electrical Risk Flagged (Emergency)', time: '11:06 AM', done: true },
      { step: 'Feeder Line Tripped & Power Grid Safe', time: '11:12 AM', done: true },
      { step: 'High-voltage Insulation Restored', time: '12:30 PM', done: true }
    ]
  }
];

export default function CitizenComplaintsList({ 
  onBack, 
  onReportNew, 
  isDarkMode = false,
  toggleTheme
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = MOCK_COMPLAINTS.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      item.statusBadge.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getPriorityBadgeClass = (priorityLevel) => {
    switch (priorityLevel) {
      case 'critical':
        return isDarkMode 
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
          : 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return isDarkMode 
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
          : 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return isDarkMode 
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
          : 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadgeClass = (statusBadge) => {
    switch (statusBadge) {
      case 'Resolved':
        return isDarkMode 
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return isDarkMode 
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
          : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Assigned':
      default:
        return isDarkMode 
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
          : 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className={`min-h-screen font-body-md transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#f8f8f9] text-[#191c1e]'
    }`}>
      {/* Top Header */}
      <header className={`docked full-width top-0 sticky z-40 backdrop-blur-md transition-colors duration-200 shadow-sm ${
        isDarkMode ? 'bg-slate-900 border-b border-slate-800 text-white' : 'bg-white border-b border-slate-200 text-[#191c1e]'
      }`}>
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Return to Citizen Portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 object-contain rounded-md block shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=200&auto=format&fit=crop';
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8E2zYE08ZWxBbJmuwbQmhpttlMXnCJuzxwjsIWe0POUGLfPgVffQDSGbZ9YZPAXwynkMGUzVBD3aFbO6_Tc_acVGsyP80grGuYV1hpllJKf_xTYwuyatRfUy_iMCFjugTpOtD49XvkmH7WnAd14YFwlP15kh9NkguygW9JxoY3JqwC3l_25DqVSEssCXghgK0VWG3NTku9ZpbvrTBJbW3l03H4nJ1g-dpGq6eEoqFkY1Z88LZc6k"
                alt="UrbanEye AI"
              />
              <span className="font-headline-md text-lg md:text-xl font-bold tracking-tight">
                UrbanEye AI <span className="text-electric-blue font-normal text-sm md:text-base ml-1">/ My Complaints</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReportNew}
              className="px-4 py-2 rounded-lg bg-electric-blue hover:bg-primary text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report New Issue</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        
        {/* Page Hero Banner */}
        <div className={`p-6 md:p-8 rounded-2xl border mb-8 transition-all ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 shadow-xl' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen Record
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  • User ID: #CR-8820
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                My Previous Complaints
              </h1>
              <p className={`text-sm md:text-base max-w-2xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Track real-time resolution status, AI verification telemetry, and municipal dispatch updates for all your submitted civic reports.
              </p>
            </div>

            {/* Quick Stats Widget */}
            <div className="grid grid-cols-3 gap-3 self-start md:self-auto w-full md:w-auto">
              <div className={`p-3.5 rounded-xl border text-center ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-electric-blue">
                  {MOCK_COMPLAINTS.length}
                </div>
                <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Total Filed
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border text-center ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-emerald-500">
                  {MOCK_COMPLAINTS.filter(c => c.statusBadge === 'Resolved').length}
                </div>
                <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Resolved
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border text-center ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-amber-500">
                  {MOCK_COMPLAINTS.filter(c => c.statusBadge !== 'Resolved').length}
                </div>
                <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, issue type, location, or keyword..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all outline-none ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-electric-blue' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-electric-blue'
                }`}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Assigned', 'In Progress', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-electric-blue text-white shadow-sm'
                      : isDarkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Grid List */}
        {filteredComplaints.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold">No matching complaints found</h3>
            <p className={`text-sm mt-1 max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Try changing your search term or filter status to view your report history.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="mt-4 px-4 py-2 rounded-lg bg-electric-blue text-white text-sm font-medium hover:bg-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Card Header Top Row */}
                  <div className={`p-5 pb-4 flex items-start justify-between border-b ${
                    isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/70'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-electric-blue bg-electric-blue/10 px-2.5 py-0.5 rounded-md border border-electric-blue/20">
                          {complaint.id}
                        </span>
                        <span className="font-headline-md text-base font-bold">
                          {complaint.issueType}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{complaint.date}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{complaint.time}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(complaint.statusBadge)}`}>
                        {complaint.currentStatus}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityBadgeClass(complaint.priorityLevel)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Image Preview & Details */}
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={complaint.image}
                        alt={complaint.issueType}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop';
                        }}
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 block shadow-inner"
                      />
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Location */}
                        <div className="flex items-start gap-1.5 text-xs font-medium">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span className="truncate">{complaint.location}</span>
                        </div>

                        {/* Ward / Dept */}
                        <div className={`flex items-center gap-1.5 text-xs ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{complaint.ward}</span>
                        </div>

                        {/* Description */}
                        <p className={`text-xs line-clamp-2 leading-relaxed ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    {/* AI Verification & Cluster Box */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isDarkMode 
                        ? 'bg-slate-950/60 border-emerald-500/30 text-emerald-400' 
                        : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold">{complaint.aiStatus}</span>
                        <span className="text-[11px] opacity-80">({complaint.aiConfidence})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Layers className="w-3 h-3" />
                        <span>{complaint.clusterCount} Reports Clustered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
                  isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'
                }`}>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Department: <span className="font-medium text-on-surface">{complaint.department}</span>
                  </span>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="text-xs font-semibold text-electric-blue hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Detail Modal Overlay */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden animate-fadeIn ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#191c1e]'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-electric-blue bg-electric-blue/10 px-2.5 py-1 rounded-md text-sm border border-electric-blue/20">
                  {selectedComplaint.id}
                </span>
                <h3 className="font-bold text-lg">{selectedComplaint.issueType}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Photo Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedComplaint.image}
                  alt={selectedComplaint.issueType}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop';
                  }}
                  className="w-full h-48 object-cover block"
                />
              </div>

              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Status</div>
                  <div className="font-bold text-sm mt-0.5">{selectedComplaint.currentStatus}</div>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Priority</div>
                  <div className="font-bold text-sm mt-0.5">{selectedComplaint.priority}</div>
                </div>
              </div>

              {/* Location & AI Telemetry */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{selectedComplaint.location} ({selectedComplaint.ward})</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{selectedComplaint.aiStatus} — {selectedComplaint.aiConfidence}</span>
                </div>
                <p className={`text-xs pt-1 border-t ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Municipal Action Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resolution Progress & Dispatch Timeline
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                  {selectedComplaint.timeline.map((item, index) => (
                    <div key={index} className="relative pl-4">
                      <div className={`absolute -left-[13px] top-1 w-3 h-3 rounded-full border-2 ${
                        item.done 
                          ? 'bg-emerald-500 border-white dark:border-slate-900' 
                          : 'bg-slate-400 border-white dark:border-slate-900'
                      }`} />
                      <div className="text-xs font-semibold">{item.step}</div>
                      <div className="text-[11px] text-slate-400">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-4 border-t flex justify-end ${
              isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
            }`}>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2.5 rounded-xl bg-electric-blue hover:bg-primary text-white text-sm font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
