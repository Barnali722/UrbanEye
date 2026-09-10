import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Building2, 
  MessageSquareDiff, 
  BarChart3, 
  Settings, 
  AlertOctagon, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Sun, 
  ShieldCheck 
} from 'lucide-react';

interface SideNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onTriggerEmergency: () => void;
  onOpenAdminProfile?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onTriggerEmergency,
  onOpenAdminProfile,
}) => {
  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live-intelligence', label: 'Live Intelligence', icon: BrainCircuit, badge: 'AI Live' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { id: 'citizen-reports', label: 'Citizen Reports', icon: MessageSquareDiff, badge: 'Clustered' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <nav 
      id="main-sidebar-nav"
      className="hidden md:flex h-screen w-80 fixed left-0 top-0 flex-col bg-white/90 dark:bg-[#101415]/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 shadow-xl z-40 transition-colors duration-300 select-none"
    >
      <div className="flex flex-col h-full py-8 px-5">
        {/* Header with Admin Profile & Theme Toggle */}
        <div className="flex items-center gap-3 px-1 mb-8">
          <button
            id="sidebar-admin-profile-btn"
            onClick={onOpenAdminProfile}
            className="flex items-center gap-3.5 flex-1 min-w-0 p-1.5 -m-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer"
            title="Open Admin Profile & Access Console"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-500/40 shadow-md shrink-0 group-hover:scale-105 group-hover:border-blue-500 transition-all">
              <img 
                alt="User Profile Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBxfw8gK00Xm7lZqKmPfMfcd2GjaRRCRu0XaB3QaGD20r77FPMDDIsAn4evRvo54Ij9n8gE4zHKxoK4CipEuutxsqF0h6XII-dToZQwe8uhR_ao9MGqdsvTjgCiorYc6xnYJ2M3bZ-78iLu2Ryzcun3bmeCE4lL-9P97lPa_S0JteqlA8jeS-YWaF7RKofdPahGe2Ultm9Mg4CTc6I_gRqPd5imDxpovPQ7q592_9bYzZ6RGHO8w"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-headline font-bold text-blue-600 dark:text-cyan-300 text-lg leading-tight truncate group-hover:text-blue-700 dark:group-hover:text-cyan-200 transition-colors">
                <span>UrbanEye AI</span>
                <ShieldCheck className="w-4 h-4 text-cyan-500 inline shrink-0" />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
                System Administrator
              </div>
            </div>
          </button>

          {/* Theme Toggle Button */}
          <button 
            id="theme-toggle-sidebar"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-cyan-300 font-bold border border-blue-200/60 dark:border-cyan-500/30 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-cyan-900/60 text-blue-700 dark:text-cyan-300' 
                      : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Emergency Protocol CTA */}
        <button 
          id="btn-emergency-protocol"
          onClick={onTriggerEmergency}
          className="mt-auto mb-4 bg-red-600 dark:bg-red-600/90 hover:bg-red-700 dark:hover:bg-red-600 text-white py-3 px-4 rounded-xl font-headline font-semibold text-xs flex items-center justify-center gap-2 border border-red-700/40 shadow-lg dark:shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all"
        >
          <AlertOctagon className="w-4 h-4 animate-pulse" />
          Initiate Emergency Protocol
        </button>

        {/* Footer Links */}
        <div className="flex flex-col gap-1 pt-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400">
          <button 
            onClick={() => alert("UrbanEye Support Hotline: 311 or admin-support@urbaneye.civic")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Help Support</span>
          </button>
          <button 
            onClick={() => alert("Session locked. Authority credentials active.")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
