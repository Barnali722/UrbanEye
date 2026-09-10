import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Building, 
  KeyRound, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  RefreshCw, 
  Sliders,
  LogOut,
  Sparkles,
  MapPin,
  Cpu
} from 'lucide-react';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onTriggerEmergency: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onTriggerEmergency,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'permissions' | 'audit'>('profile');
  const [aiThreshold, setAiThreshold] = useState<number>(85);
  const [autoDispatchEnabled, setAutoDispatchEnabled] = useState<boolean>(true);
  const [sessionToken, setSessionToken] = useState<string>('auth_jwt_9842_sec_lvl4');

  const regenerateToken = () => {
    const newToken = `auth_jwt_${Math.floor(1000 + Math.random() * 9000)}_sec_lvl4`;
    setSessionToken(newToken);
    onShowToast('Session token refreshed & re-encrypted.');
  };

  return (
    <div 
      id="modal-admin-profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#15191b] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden text-gray-900 dark:text-gray-100">
        {/* Banner with Profile Cover */}
        <div className="relative h-28 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 p-6 flex items-start justify-between">
          <div className="flex items-center gap-2 text-white/90">
            <ShieldCheck className="w-5 h-5 text-cyan-300" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-black/30 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
              Security Level 4 • Super Administrator
            </span>
          </div>
          <button
            id="close-admin-profile-modal"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-lg backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header Floating Card */}
        <div className="px-6 pb-2 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border-4 border-white dark:border-[#15191b] shadow-xl shrink-0">
              <img 
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBxfw8gK00Xm7lZqKmPfMfcd2GjaRRCRu0XaB3QaGD20r77FPMDDIsAn4evRvo54Ij9n8gE4zHKxoK4CipEuutxsqF0h6XII-dToZQwe8uhR_ao9MGqdsvTjgCiorYc6xnYJ2M3bZ-78iLu2Ryzcun3bmeCE4lL-9P97lPa_S0JteqlA8jeS-YWaF7RKofdPahGe2Ultm9Mg4CTc6I_gRqPd5imDxpovPQ7q592_9bYzZ6RGHO8w"
              />
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
                <span>Commander Aftab Hossain</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="Online" />
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-blue-500" />
                <span>Municipal Operations & Crisis Dispatch Division</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1 w-full sm:w-auto">
            <button
              onClick={regenerateToken}
              className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 transition-colors border border-gray-200 dark:border-white/10"
              title="Refresh auth signature"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Token</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-gray-200 dark:border-white/10 flex gap-6 mt-4">
          {[
            { id: 'profile', label: 'Identity & Access', icon: User },
            { id: 'permissions', label: 'AI Controls & Overrides', icon: Sliders },
            { id: 'audit', label: 'Audit Activity Log', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-300'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 max-h-[55vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    System Identity
                  </span>
                  <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>aftabhossain0080@gmail.com</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <span className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 block mb-1">
                    Jurisdiction & Sector Clearance
                  </span>
                  <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span>All Metropolitan Zones (Sector 1-14)</span>
                  </div>
                </div>
              </div>

              {/* Active Session & Auth Token */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-cyan-300 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" />
                    Active Encrypted Bearer Token
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded font-semibold">
                    ACTIVE (14ms)
                  </span>
                </div>
                <div className="font-mono text-xs bg-white/80 dark:bg-black/40 p-2.5 rounded-lg border border-blue-200/50 dark:border-blue-900/50 text-gray-700 dark:text-gray-300 select-all break-all">
                  {sessionToken}
                </div>
              </div>

              {/* Department Roles */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
                  Authorizations & Credentials
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Emergency Dispatch Authority',
                    'AI Model Classifier Overrides',
                    'GIS Sensor Calibration',
                    'Citizen Duplicate Deconfliction',
                    'Budget Authorization (₹50M/Sprint)',
                  ].map((role) => (
                    <span 
                      key={role}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>{role}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      <span>AI Triage Confidence Threshold</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Incidents below this threshold require manual supervisor review before crew dispatch.
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-blue-600 dark:text-cyan-300 bg-blue-100 dark:bg-cyan-950 px-2.5 py-1 rounded-lg">
                    {aiThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiThreshold}
                  onChange={(e) => setAiThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Automated Rapid Response Crew Assignment
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Allow system to auto-dispatch nearest available civic units for P1 Critical road and flood hazards.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDispatchEnabled}
                    onChange={(e) => {
                      setAutoDispatchEnabled(e.target.checked);
                      onShowToast(`Auto-dispatch ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    City-Wide Emergency Override Mode
                  </div>
                  <p className="text-xs text-red-600/80 dark:text-red-300/70 mt-0.5">
                    Broadcast priority alerts to all field vehicles and escalate all triage queues.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerEmergency();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md"
                >
                  Trigger Protocol
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {[
                { time: '12m ago', action: 'Reviewed P1 Roadbed Damage', loc: 'Sector 5, Corridor B', badge: 'CRITICAL' },
                { time: '28m ago', action: 'Approved Sanitation Dispatch Ticket #8488', loc: 'Ward 12 Market', badge: 'APPROVED' },
                { time: '1h ago', action: 'Exported GIS Spatial GeoJSON Layer', loc: 'Metropolitan Grid', badge: 'EXPORT' },
                { time: '2h ago', action: 'Rotated API Security Bearer Token', loc: 'Admin Terminal 01', badge: 'SECURITY' },
              ].map((log, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{log.action}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px]">{log.loc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300">
                      {log.badge}
                    </span>
                    <span className="text-gray-400 text-[11px]">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#101415] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onShowToast('Session signed out. Re-authenticating...');
              onClose();
            }}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Terminal</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
