/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import CitizenComplaintsList from './pages/citizen/CitizenComplaintsList';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  defaultDesc: string;
  photoName: string;
}

const CIVIC_CATEGORIES: CategoryItem[] = [
  {
    id: 'pothole',
    name: 'Pothole',
    subtitle: 'Roadway damage & hazards',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf30O0mli5Pw_N6J4da_8fI4niuJA7zzgFxkbl6tRdyLU73BERcNb1QtqtF5B_65Gu815WAA88QeWCkAvSaOMzPwDqVQDK5QBnZKJQutKy0juwyQPySBQlyztNmY5TPxD32YSz5dBSXaONdSECStABSr5qLExlRl6xZMbF34-ryyHW_vb6tU8xmc5ozuIUJC7S9aqOw4w0Hp_8kfIdlD7Ue-lrcPgQpQ3rOSWAlJs_iiTC2CUyCII',
    defaultDesc: 'Large pothole near the college gate. It is dangerous for bikes and cars.',
    photoName: 'pothole_photo.jpg',
  },
  {
    id: 'garbage',
    name: 'Garbage',
    subtitle: 'Illegal dumping & waste',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0uVUCAPgdWEinM7V-LWSRyzQdjhYgpYUulJGfJ6gvEGim4bAdEzIlH9yplhP_Efjf9pKDm_zxc88k--QcuzrZW-75-pdRfdtwDTqDLJjU-bR9_XNKyk3Gc5Y7nU9pybZC6o1mDHi95pAmSAy7l_kkJOBPdI3ZxUAl1qaZxOnOh900eMVIFOUCuIZw7ciHuYoT09YSXv_db_-o2LJ2zGdTtdZrjbFe5Y4ImJUnuKIZdj0pcJcWlU8',
    defaultDesc: 'Illegal garbage dumping piling up and overflowing onto the main walkway.',
    photoName: 'garbage_dump.jpg',
  },
  {
    id: 'waterlogging',
    name: 'Waterlogging',
    subtitle: 'Flooding & drainage issues',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBE6_X0wcNsJjdizbm0u5ZM6z7TXR02MlYKnOLojy2fED1TjfgEi4GgCUo_9qZnCi-CsrLTl5FhuQ4SVnGW3C2e_i33w5uXIULPxFE9vcwfK7yzkyvlZIb_g4EjDRIetYXhBPEiyrwHZfviX7pgiVA1Of9dKUlStdwoTz1EXDnPnWMWhT59we9ID368_qwxnmu8-RO5z1rlDiGP8e8M5mPCq1K_Gv6D_c_ag5MmvHOaYdCKwlBsimw',
    defaultDesc: 'Severe waterlogging blocking traffic and pedestrians near the intersection.',
    photoName: 'waterlogging_site.jpg',
  },
  {
    id: 'electric',
    name: 'Electric',
    subtitle: 'Power lines & transformer issues',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAydtk1Uqmr4z1XYhYsIP7UvBKx7JIZcNRZXI5kBxNj_hqEIa4bk8j_EiuM9aUzIfk7wrP1z5hayklrdZFrz3Cde38IbdgDhxX0OTdcFSNAPY_NPNFw0VTRnc4ZQRx7H_V90EIxTNuC2ri2tGgSx4LZ16tXpcjdv-oy_lAR_W8PsWahG23PgGuXU-DoJumUFLnWjrc0HPx-EQtF6h0yAYR_nFpbFlVp2l6x8DDqTwyY-AKIYg2j9Kc',
    defaultDesc: 'Exposed power wires dangling near the sidewalk posing electrical hazard.',
    photoName: 'electric_wires.jpg',
  },
  {
    id: 'other',
    name: 'Other',
    subtitle: 'General infrastructure damage',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC7AGDOy6chs5Y99Uixsv9zafhkZA4do0zATeJXcYJjlMQDLcuLOeeakOGSjvy-aSSwlzy_UA3cleWm1jCvpxvTv7g9POEWWCAD_k80d6M4KokNcPP3BlGTbbsU5hwwT6XqLOvxHuXapFw8iJSYdK61VAwGP1hRATSRSVHGDZw84lrIQ1RAMdTCPmjTTCWlTpgL-kDWHts9gbyqYuPlpwVO8UJvSvtbS3sNO7E841zQsSzPdQLVgZg',
    defaultDesc: 'Damaged civic infrastructure and broken street fixtures requiring maintenance.',
    photoName: 'infrastructure_issue.jpg',
  },
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modalView, setModalView] = useState<'category' | 'form' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem>(CIVIC_CATEGORIES[0]);
  const [activeNav, setActiveNav] = useState<string>('Citizen Portal');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
  // Navigation View State ('home' or 'complaints')
  const [currentView, setCurrentView] = useState<'home' | 'complaints'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/citizen/complaints')) {
      return 'complaints';
    }
    return 'home';
  });

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      icon: 'build',
      iconEmoji: '🔧',
      title: 'Status: Work Started',
      message: 'Your pothole complaint #10482 is now In Progress.',
      time: '10m ago',
      unread: true,
      badgeColor: 'blue',
    },
    {
      id: 'notif-2',
      icon: 'engineering',
      iconEmoji: '👷',
      title: 'Status: Assigned',
      message: 'Complaint #10482 has been Assigned to the Road Maintenance Department.',
      time: '45m ago',
      unread: true,
      badgeColor: 'purple',
    },
    {
      id: 'notif-3',
      icon: 'link',
      iconEmoji: '🔗',
      title: 'Status: Duplicate/Merged',
      message: 'Duplicate Detected: Your report was grouped with 17 others into Incident #44.',
      time: '2h ago',
      unread: false,
      badgeColor: 'amber',
    },
    {
      id: 'notif-4',
      icon: 'psychology',
      iconEmoji: '🧠',
      title: 'Status: AI Verified',
      message: "AI Verified: Your submission has been classified as a 'Pothole' with High Confidence.",
      time: '3h ago',
      unread: false,
      badgeColor: 'emerald',
    },
  ]);

  // Profile Dropdown State
  const [showProfile, setShowProfile] = useState(false);

  const navigateTo = (view: 'home' | 'complaints') => {
    setCurrentView(view);
    const path = view === 'complaints' ? '/citizen/complaints' : '/';
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('/citizen/complaints')) {
        setCurrentView('complaints');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Form State
  const [description, setDescription] = useState(
    'Large pothole near the college gate. It is dangerous for bikes and cars.'
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedPhotoNames, setUploadedPhotoNames] = useState<string[]>([]);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaintId, setSubmittedComplaintId] = useState('#UE-1042');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      return next;
    });
  };

  const openReportModal = (categoryName?: unknown) => {
    if (typeof categoryName === 'string') {
      const targetCat = CIVIC_CATEGORIES.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (targetCat) {
        setSelectedCategory(targetCat);
        setDescription(targetCat.defaultDesc);
      }
    }
    setModalView('category');
    setShowReportModal(true);
    setIsSubmitting(false);
  };

  const selectCategoryAndOpenForm = (category: CategoryItem) => {
    setSelectedCategory(category);
    setDescription(category.defaultDesc);
    setModalView('form');
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setModalView('category');
    setIsSubmitting(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newUrls = files.map((file) => URL.createObjectURL(file));
      const newNames = files.map((file) => file.name);
      setUploadedPhotos((prev) => [...prev, ...newUrls]);
      setUploadedPhotoNames((prev) => [...prev, ...newNames]);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setUploadedPhotoNames((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedVideoName(file.name);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedComplaintId('#UE-1042');
      setModalView('success');
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn backdrop-blur-md">
          <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
          <span className="font-medium text-sm text-slate-100">{showToast}</span>
          <button
            onClick={() => setShowToast(null)}
            className="ml-2 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}

      {currentView === 'complaints' ? (
        <CitizenComplaintsList
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onBack={() => navigateTo('home')}
          onReportNew={() => openReportModal()}
        />
      ) : (
        <>
          {/* TopNavBar */}
          <header className={`docked full-width top-0 sticky z-50 backdrop-blur-md transition-colors duration-200 shadow-sm ${
            isDarkMode 
              ? 'bg-slate-900 border-b border-slate-800 text-white' 
              : 'bg-white border-b border-slate-200 text-[#191c1e]'
          }`}>
            <div className={`flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full transition-colors duration-200 ${
              isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-[#191c1e]'
            }`}>
              {/* Brand */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
                <img
                  alt="UrbanEye Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=200&auto=format&fit=crop';
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md block shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8E2zYE08ZWxBbJmuwbQmhpttlMXnCJuzxwjsIWe0POUGLfPgVffQDSGbZ9YZPAXwynkMGUzVBD3aFbO6_Tc_acVGsyP80grGuYV1hpllJKf_xTYwuyatRfUy_iMCFjugTpOtD49XvkmH7WnAd14YFwlP15kh9NkguygW9JxoY3JqwC3l_25DqVSEssCXghgK0VWG3NTku9ZpbvrTBJbW3l03H4nJ1g-dpGq6eEoqFkY1Z88LZc6k"
                />
                <span className={`font-headline-md text-headline-md md:text-headline-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>UrbanEye AI</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-[#424753]'}`}>
                  
                  {/* Notifications Bell & Dropdown */}
                  <div className="relative">
                    <button
                      className={`p-2 hover:text-electric-blue transition-colors rounded-full flex items-center justify-center scale-95 active:opacity-80 transition-all relative cursor-pointer ${
                        showNotifications
                          ? isDarkMode ? 'bg-slate-800 text-electric-blue' : 'bg-slate-100 text-electric-blue'
                          : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-[#424753]'
                      }`}
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowProfile(false);
                      }}
                      aria-label="Notifications"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                        notifications
                      </span>
                      {notifications.some(n => n.unread) && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                      )}
                    </button>

                    {/* Notifications Dropdown Panel */}
                    {showNotifications && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowNotifications(false)} 
                        />
                        <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden transition-all animate-fadeIn ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#191c1e]'
                        }`}>
                          {/* Dropdown Header */}
                          <div className={`px-4 py-3 border-b flex items-center justify-between ${
                            isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="text-base">🔔</span>
                              <h3 className="font-bold text-sm">Incident Notifications</h3>
                              <span className="text-xs bg-electric-blue/10 text-electric-blue font-semibold px-2 py-0.5 rounded-full border border-electric-blue/20">
                                {notifications.filter(n => n.unread).length} New
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setNotifications(notifications.map(n => ({ ...n, unread: false })));
                                setShowToast('All notifications marked as read.');
                              }}
                              className="text-xs font-semibold text-electric-blue hover:underline cursor-pointer"
                            >
                              Mark all read
                            </button>
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                            {notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  setShowNotifications(false);
                                  navigateTo('complaints');
                                }}
                                className={`p-4 transition-colors cursor-pointer flex gap-3 items-start ${
                                  notif.unread
                                    ? isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-blue-50/40 hover:bg-blue-50/80'
                                    : isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border ${
                                  notif.badgeColor === 'blue'
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                    : notif.badgeColor === 'purple'
                                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                                      : notif.badgeColor === 'amber'
                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                }`}>
                                  <span>{notif.iconEmoji}</span>
                                </div>

                                <div className="space-y-1 flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-electric-blue">
                                      {notif.title}
                                    </span>
                                    <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                      {notif.time}
                                    </span>
                                  </div>
                                  <p className={`text-xs leading-relaxed ${
                                    notif.unread 
                                      ? isDarkMode ? 'text-slate-100 font-medium' : 'text-slate-900 font-medium' 
                                      : isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                  }`}>
                                    {notif.message}
                                  </p>
                                </div>

                                {notif.unread && (
                                  <div className="w-2 h-2 rounded-full bg-electric-blue shrink-0 mt-1.5" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className={`p-3 text-center border-t ${
                            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
                          }`}>
                            <button
                              onClick={() => {
                                setShowNotifications(false);
                                navigateTo('complaints');
                              }}
                              className="text-xs font-semibold text-electric-blue hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                            >
                              <span>View All Complaints & Statuses</span>
                              <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dark / Light Mode Toggle */}
                  <button
                    className={`p-2 hover:text-electric-blue transition-colors rounded-full flex items-center justify-center scale-95 active:opacity-80 transition-all border shadow-sm cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                        : 'bg-white border-slate-200 text-[#424753] hover:bg-slate-100'
                    }`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    <span className="material-symbols-outlined" id="theme-toggle-icon" style={{ fontVariationSettings: "'FILL' 0" }}>
                      {isDarkMode ? 'dark_mode' : 'light_mode'}
                    </span>
                  </button>

                  {/* Profile Avatar & Dropdown */}
                  <div className="relative">
                    <button
                      className={`p-2 hover:text-electric-blue transition-colors rounded-full flex items-center justify-center scale-95 active:opacity-80 transition-all cursor-pointer ${
                        showProfile
                          ? isDarkMode ? 'bg-slate-800 text-electric-blue' : 'bg-slate-100 text-electric-blue'
                          : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-[#424753]'
                      }`}
                      onClick={() => {
                        setShowProfile(!showProfile);
                        setShowNotifications(false);
                      }}
                      aria-label="Account Profile"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                        account_circle
                      </span>
                    </button>

                    {/* Simple Profile Dropdown Card */}
                    {showProfile && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowProfile(false)} 
                        />
                        <div className={`absolute right-0 mt-3 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden transition-all animate-fadeIn ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-[#191c1e]'
                        }`}>
                          {/* User Details */}
                          <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-electric-blue text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                                AH
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-base truncate">
                                  Aftab Hossain
                                </h3>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} truncate`}>
                                  +91 98765 43210
                                </p>
                              </div>
                            </div>

                            <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}>
                              <div className="font-semibold text-on-surface">aftab@example.com</div>
                              <div className="text-[11px] text-electric-blue mt-0.5 flex items-center gap-1 font-medium">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                Verified Resident #CR-8820
                              </div>
                            </div>
                          </div>

                          {/* Action / Logout */}
                          <div className={`p-3 border-t ${
                            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
                          }`}>
                            <button
                              onClick={() => {
                                setShowProfile(false);
                                setShowToast('Logged out of Citizen Portal successfully.');
                              }}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                isDarkMode
                                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50'
                                  : 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">logout</span>
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </div>
                {/* Mobile Menu Toggle */}
                <button
                  className={`md:hidden p-2 flex items-center justify-center scale-95 active:opacity-80 transition-all ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}
                  onClick={() => openReportModal()}
                  aria-label="Mobile Menu"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>
            </div>
          </header>

          <main>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida/AEtjO1UH3UDUuH-4Kh60JC_uqo5BVQdMm1XG_22zReVbI9F2oc-TN4zXk7tBobwZfZmnFfhrJlwytpcM5nE4tSBsBxBSImy4Cr2DJks-Ph_8jLxeMLwgE0BurB5DQ9V-gLRbNAmg56mYDC0o5pUYNnrY3fBSzdvw-3slNvXD2cBq3zQW5ZWfiWxfBzbrnaqyRqyfPBkEeFK2NW2OLpAVlWcaAkeNJW3KI0HWz2JBqiovF4YSu-NSSK3dR0XI1A'), url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 hero-gradient" />
                <div className="absolute inset-0 bg-surface-container-lowest/10 backdrop-blur-[2px]" />
              </div>

              <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-8 flex flex-col justify-center gap-6">
                  <div className="space-y-2 mb-4">
                    <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-[#ebf2f2] border-[#31a4a4] leading-tight uppercase tracking-tight">
                      SEE THE PROBLEM.
                    </h1>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-[#9eddea] uppercase tracking-tight">
                      PRIORITIZE THE SOLUTION.
                    </h2>
                  </div>
                  <p className="font-body-lg text-body-lg text-[#e9ebeb] max-w-2xl leading-relaxed">
                    UrbanEye transforms citizen complaints into AI-powered infrastructure intelligence. We connect civic voices with actionable data to build safer, more responsive cities in real-time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      className="px-8 py-4 rounded-md bg-electric-blue text-white font-label-md flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,90,194,0.4)] hover:bg-primary transition-all hover:scale-[1.02] cursor-pointer"
                      onClick={openReportModal}
                    >
                      Report a Problem
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      className="px-8 py-4 rounded-md border border-white/50 bg-white/10 backdrop-blur-sm text-white font-label-md flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => navigateTo('complaints')}
                    >
                      My Previous Complaints
                      <span className="material-symbols-outlined text-sm">history</span>
                    </button>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden relative group shadow-lg transition-all duration-300 p-3.5 flex items-center gap-2.5 w-fit">
                    <span className="material-symbols-outlined text-secondary-fixed text-base">verified_user</span>
                    <span className="text-on-surface font-label-md text-base font-semibold">AI-Powered • Real-Time Intelligence • Smart City</span>
                  </div>
                </div>
              </div>

              {/* Bottom Fade to Next Section */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface to-transparent z-10" />
            </section>

        {/* 🗺️ Nearby Issues (Incident Intelligence Clustering) Section */}
        <section id="nearby-issues" className="relative z-20 py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-border-subtle">
          <div className="max-w-container-max mx-auto">
            {/* Header & Subtitle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-electric-blue/10 text-electric-blue border border-electric-blue/20 flex items-center gap-1.5 w-fit">
                    <span className="material-symbols-outlined text-sm">hub</span> AI Incident Intelligence
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Ward 42 &bull; 1.5 km Active Radius
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg font-bold text-on-surface tracking-tight flex items-center gap-2">
                  🗺️ Nearby Issues
                </h2>
                <p className="text-on-surface-variant text-sm md:text-base mt-1 max-w-2xl">
                  Multiple citizen reports in this zone are automatically consolidated by AI into single prioritized incidents to eliminate duplicates and accelerate emergency response.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowToast('Refreshing geo-clustered telemetry from Ward 42 sensor grid...')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-variant/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Live Grid
                </button>
                <button
                  onClick={() => navigateTo('complaints')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-electric-blue text-white hover:bg-primary transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">history</span>
                  My Complaints
                </button>
              </div>
            </div>

            {/* Consolidated Incidents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Incident 1: Pothole | College Road | 17 reports merged */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-error/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Top Meta Row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-error/10 text-error border border-error/30">
                        <span className="text-base leading-none">🔴</span> Critical Priority
                      </span>
                      <span className="font-headline-md text-lg font-bold text-on-surface">
                        Pothole
                      </span>
                    </div>

                    {/* AI Merged Reports Highlight Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-electric-blue/10 text-electric-blue border border-electric-blue/30 text-xs font-bold shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-sm">layers</span>
                      <span>17 reports merged</span>
                    </div>
                  </div>

                  {/* Location & AI Clustering Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-error text-lg">location_on</span>
                      <span>College Road</span>
                      <span className="text-xs text-on-surface-variant font-normal">&bull; Near Gate 3 Junction</span>
                    </div>

                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      AI computer vision has merged 17 citizen uploads into a single high-priority road fracture incident (~1.2m depth). PWD rapid dispatch alert dispatched.
                    </p>

                    {/* Telemetry Pill Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Reports</div>
                        <div className="text-sm font-bold text-electric-blue">17 Citizen Files</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Cluster Radius</div>
                        <div className="text-sm font-bold text-on-surface">120m Zone</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Dispatch Status</div>
                        <div className="text-sm font-bold text-error">Crew Assigned</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                    AI Consolidated Incident #INC-4209
                  </span>
                  <button
                    onClick={() => setShowToast("You've upvoted Incident #INC-4209 (College Road). Severity score boosted.")}
                    className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold transition-all border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm text-electric-blue">thumb_up</span>
                    I'm Affected (+1)
                  </button>
                </div>
              </div>

              {/* Incident 2: Waterlogging | Station Road | 8 reports merged */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-amber-500/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  {/* Top Meta Row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        <span className="text-base leading-none">🟠</span> High Priority
                      </span>
                      <span className="font-headline-md text-lg font-bold text-on-surface">
                        Waterlogging
                      </span>
                    </div>

                    {/* AI Merged Reports Highlight Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-electric-blue/10 text-electric-blue border border-electric-blue/30 text-xs font-bold shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-sm">layers</span>
                      <span>8 reports merged</span>
                    </div>
                  </div>

                  {/* Location & AI Clustering Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-amber-500 text-lg">location_on</span>
                      <span>Station Road</span>
                      <span className="text-xs text-on-surface-variant font-normal">&bull; Metro Underpass Sector</span>
                    </div>

                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      AI spatial telemetry has grouped 8 citizen submissions regarding severe stormwater drain blockage into one municipal action item with automated pump routing.
                    </p>

                    {/* Telemetry Pill Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Reports</div>
                        <div className="text-sm font-bold text-electric-blue">8 Citizen Files</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Cluster Radius</div>
                        <div className="text-sm font-bold text-on-surface">85m Zone</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-xl text-center border border-border-subtle">
                        <div className="text-[11px] text-on-surface-variant font-medium">Dispatch Status</div>
                        <div className="text-sm font-bold text-amber-600 dark:text-amber-400">Pump En Route</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                    AI Consolidated Incident #INC-4210
                  </span>
                  <button
                    onClick={() => setShowToast("You've upvoted Incident #INC-4210 (Station Road). Priority updated.")}
                    className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold transition-all border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm text-electric-blue">thumb_up</span>
                    I'm Affected (+1)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Process Flow / Storytelling Section */}
        <section id="process-section" className="relative z-20 py-24 px-margin-mobile md:px-margin-desktop bg-background">
          <div className="max-w-container-max mx-auto">
            <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-sm border border-border-subtle">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-outline-variant/30 -translate-y-1/2 z-0" />
                {/* Connecting Line (Mobile) */}
                <div className="md:hidden absolute left-1/2 top-[10%] bottom-[10%] w-[1px] bg-outline-variant/30 -translate-x-1/2 z-0" />

                {/* Step 1 */}
                <div
                  className="relative z-10 flex flex-col items-center gap-4 text-center group bg-surface-container-lowest p-4 rounded-lg cursor-pointer hover:scale-105 transition-all"
                  onClick={() => openReportModal('Pothole')}
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-on-surface group-hover:text-secondary group-hover:border-secondary transition-colors duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                      record_voice_over
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Citizen Report</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Data ingested via app</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden relative group shadow-lg transition-all duration-300 p-4 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-on-surface group-hover:text-primary group-hover:border-primary transition-colors duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">AI Understands</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Classification &amp; severity</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center gap-4 text-center group bg-surface-container-lowest p-4 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-on-surface group-hover:text-error group-hover:border-error transition-colors duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                      format_list_numbered
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">UrbanEye Prioritizes</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Impact-based routing</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-col items-center gap-4 text-center group bg-surface-container-lowest p-4 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center text-electric-blue shadow-[0_0_15px_rgba(0,90,194,0.2)]">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      engineering
                    </span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">City Responds</h3>
                    <p className="text-on-surface-variant text-sm mt-1">Targeted action taken</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-border-subtle">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg font-bold text-on-surface uppercase tracking-tight">
                FROM REPORT TO RESOLUTION
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl mx-auto">
                Real impact driven by intelligent categorization and rapid municipal deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter relative">
              {/* Center Badge (Desktop Overlay) */}
              <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
                <div className="bg-surface-container-lowest border border-border-subtle rounded-full px-6 py-3 flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-md text-label-md text-on-surface">Resolved in 18 hours</span>
                </div>
              </div>

              {/* Before Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden relative group shadow-lg transition-all duration-300">
                <div className="absolute top-4 left-4 z-10 bg-error text-white font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-error/50">
                  Critical Issue (Before)
                </div>
                <div className="aspect-square w-full relative">
                  <img
                    alt="Real photograph of a large severe pothole on busy asphalt road"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover filter saturate-50 contrast-125 group-hover:saturate-100 transition-all duration-700 block"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UBuUzcyrq5iBYGSxZ-qUVuozHFMUM90a8RBXNn5TrGvI4tKc3rHOqnlGiPmO-e9eawTrhNdeAGxqdWIcq-SuskeOmrpwiqzMdsHfj8yeSklDzEpgLoMP_FjA01pOs31N7Ktu_rXFm92rYy755EXWEZfZRvHC0laUypOE96vA-pVpsyb9Ig22Ir-EsjTOpmV8pIopEAo49EUw4c6iPjoPXeYkbKdkNWzMFn_FV-M1FE-FY6KPPjxhYX"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                </div>
                <div className="p-6 absolute bottom-0 left-0 w-full backdrop-blur-md bg-surface-container-lowest/70">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Severe Surface Degradation</h3>
                  <div className="flex items-center gap-4 mt-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> Sector 42, Main Arterial
                    </span>
                    <span className="flex items-center gap-1 text-error">
                      <span className="material-symbols-outlined text-[16px]">warning</span> High Impact
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Badge */}
              <div className="lg:hidden flex justify-center py-4">
                <div className="bg-surface-container-lowest border border-border-subtle rounded-full px-6 py-3 flex items-center gap-2 shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-md text-label-md text-on-surface">Resolved in 18 hours</span>
                </div>
              </div>

              {/* After Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden relative group shadow-lg transition-all duration-300">
                <div className="absolute top-4 left-4 z-10 bg-electric-blue text-white font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(0,90,194,0.3)] border border-electric-blue/50">
                  Resolution (After)
                </div>
                <div className="aspect-square w-full relative">
                  <img
                    alt="High-quality real photograph of newly repaired road smooth asphalt"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578991624414-276ef23a534f?q=80&w=1000&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1VHZixlcvhM6Qe3XCNpvY3reGKXegp9WJXhlXLv78dhJkWM4q79SnWPtKuZh9koNaj-zktDt-N5JuSOKSkXocnYV11gzaz3w-AmsxEr_exlkHNxa-Ha3HopPmXKJCBT_tcTPJPdUfpn3nOutme7zOEi-O3-4OQfHvuVq48hPxI7Capapze7LbG8ySxYRNdwycQwIFr_N9fDpv7v9xU16v6Z6x9nWos_yquP2_0e3cJ8RxvY8MXdbXLBDQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                </div>
                <div className="p-6 absolute bottom-0 left-0 w-full backdrop-blur-md bg-surface-container-lowest/70">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Infrastructure Restored</h3>
                  <div className="flex items-center gap-4 mt-2 font-label-sm text-label-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Verified by Municipal AI
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span> Traffic Flow Optimal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-border-subtle w-full py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-4">
          <div className="font-label-md text-label-md font-bold text-primary">UrbanEye AI</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-100 hover:opacity-80 transition-opacity"
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                setShowToast('UrbanEye privacy policy conforms to civic data anonymity guidelines.');
              }}
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-100 hover:opacity-80 transition-opacity"
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                setShowToast('Standard Municipal Service Terms applied.');
              }}
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-100 hover:opacity-80 transition-opacity"
              href="#api"
              onClick={(e) => {
                e.preventDefault();
                setShowToast('UrbanEye Open Civic API v2.4 endpoint active.');
              }}
            >
              API Docs
            </a>
            <a
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-100 hover:opacity-80 transition-opacity"
              href="#support"
              onClick={(e) => {
                e.preventDefault();
                setShowToast('Municipal AI Dispatch Hotline: 1-800-URBAN-EYE');
              }}
            >
              Support
            </a>
          </div>
          <div className="text-on-surface-variant font-body-md text-[12px]">
            © 2024 UrbanEye AI. All intelligence secured.
          </div>
        </div>
      </footer>
      </>
      )}

      {/* Citizen Reporting Flow Modal / Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 overflow-y-auto">
          {/* Container (Max Width 480px) matching Citizen Reporting Flow */}
          <div className="w-full max-w-[480px] bg-surface relative max-h-[92vh] shadow-2xl flex flex-col rounded-2xl overflow-hidden border border-outline-variant/20 animate-fadeIn">
            {/* Top Bar */}
            <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {modalView === 'form' ? (
                  <button
                    className="text-on-surface-variant hover:text-secondary transition-colors flex items-center justify-center p-1.5 -ml-1.5 rounded-full hover:bg-surface-variant/50 cursor-pointer"
                    onClick={() => setModalView('category')}
                    aria-label="Back to categories"
                  >
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      arrow_back
                    </span>
                  </button>
                ) : (
                  <button
                    className="text-on-surface-variant hover:text-secondary transition-colors flex items-center justify-center p-1.5 -ml-1.5 rounded-full hover:bg-surface-variant/50 cursor-pointer"
                    onClick={closeReportModal}
                    aria-label="Close modal"
                  >
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      close
                    </span>
                  </button>
                )}
                <div className="font-headline-md text-xl font-bold text-on-surface">
                  Report Issue
                </div>
              </div>
              <button
                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  {isDarkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto w-full p-5 space-y-6">
              {modalView === 'category' && (
                /* SCREEN 1: What did you spot? Category Selection */
                <div className="flex flex-col gap-5 animate-fadeIn">
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-headline-lg-mobile text-2xl font-bold text-on-surface tracking-tight">
                      What did you spot?
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                      Select a category to begin intelligent reporting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 mt-1">
                    {CIVIC_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategoryAndOpenForm(cat)}
                        className={`relative w-full ${cat.id === 'pothole' ? 'h-36' : 'h-28'} rounded-xl overflow-hidden group border border-outline-variant/20 shadow-md text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-lg cursor-pointer`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url('${cat.image}')` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 w-full flex items-end justify-between z-10">
                          <div>
                            <h3 className="font-headline-md text-xl font-bold text-white tracking-wide">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-white/80 mt-0.5 font-normal">
                              {cat.subtitle}
                            </p>
                          </div>
                          <span
                            className="material-symbols-outlined text-white bg-black/50 group-hover:bg-electric-blue backdrop-blur-md p-2 rounded-full text-base transition-colors"
                            style={{ fontVariationSettings: "'FILL' 0" }}
                          >
                            arrow_forward
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modalView === 'form' && (
                /* SCREEN 2: Report Issue Form */
                <form onSubmit={handleSubmitComplaint} className="space-y-5 animate-fadeIn">
                  {/* Category Chip Display */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Selected:</span>
                      <span className="bg-electric-blue/15 text-electric-blue text-xs font-bold px-2.5 py-1 rounded-full border border-electric-blue/30">
                        {selectedCategory.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalView('category')}
                      className="text-xs text-on-surface-variant hover:text-electric-blue underline cursor-pointer"
                    >
                      Change category
                    </button>
                  </div>

                  {/* Hidden inputs for real file triggers */}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />

                  {/* 1. Upload Photo */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-electric-blue text-[18px]">photo_camera</span>
                        Upload Photo (1–3 photos)
                      </span>
                      <span className="text-xs font-normal text-on-surface-variant">
                        {uploadedPhotoNames.length} selected
                      </span>
                    </label>

                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="border-2 border-dashed border-outline-variant/40 hover:border-electric-blue bg-surface-container-lowest hover:bg-surface-container-low/50 rounded-xl p-4 text-center cursor-pointer transition-all group"
                    >
                      {uploadedPhotos.length > 0 ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {uploadedPhotos.map((photoUrl, idx) => (
                              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant/30 group/item">
                                <img
                                  src={photoUrl}
                                  alt={`Uploaded preview ${idx + 1}`}
                                  className="w-full h-full object-cover block"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(idx);
                                  }}
                                  className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors z-10 cursor-pointer"
                                  title="Remove photo"
                                >
                                  ✕
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white truncate px-1 py-0.5 text-center">
                                  {uploadedPhotoNames[idx] || `photo_${idx + 1}.jpg`}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-secondary font-medium flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            {uploadedPhotoNames.join(', ')}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[11px] text-on-surface-variant">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                photoInputRef.current?.click();
                              }}
                              className="text-xs text-electric-blue hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">add_a_photo</span>
                              Add More Photos
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-electric-blue transition-colors mb-1">
                            add_photo_alternate
                          </span>
                          <p className="text-sm font-medium text-on-surface">Click to upload photos</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">JPEG, PNG up to 10MB (e.g., pothole_photo.jpg)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. What's the problem? */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-electric-blue text-[18px]">edit_note</span>
                      What's the problem?
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Large pothole near the college gate. It is dangerous for bikes and cars."
                      rows={3}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3.5 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue text-sm transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* 3. Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
                      Location
                    </label>
                    <div className="w-full bg-surface-container-low/70 border border-outline-variant/30 rounded-xl p-3.5 text-on-surface flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">📍</span>
                        <div>
                          <div className="text-sm font-semibold text-on-surface">
                            College Road, Kolkata — GPS detected
                          </div>
                          <div className="text-xs text-on-surface-variant">Ward 42 • Accuracy ±3 meters</div>
                        </div>
                      </div>
                      <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-2.5 py-1 rounded-full border border-secondary/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        Live GPS
                      </span>
                    </div>
                  </div>

                  {/* 4. Add Video (Optional) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-500 text-[18px]">videocam</span>
                        Add Video
                      </label>
                      <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-medium">
                        Optional
                      </span>
                    </div>
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="border border-outline-variant/30 hover:border-purple-400 bg-surface-container-lowest rounded-xl p-3.5 flex items-center justify-between cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-purple-500 transition-colors">
                          video_file
                        </span>
                        <div>
                          <div className="text-xs font-medium text-on-surface">
                            {uploadedVideoName ? uploadedVideoName : 'Upload a short video for complex cases'}
                          </div>
                          <div className="text-[11px] text-on-surface-variant">
                            Recommended for waterlogging &amp; structural movement (MP4, MOV up to 50MB)
                          </div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:text-purple-500">
                        {uploadedVideoName ? 'check_circle' : 'file_upload'}
                      </span>
                    </div>
                  </div>

                  {/* 5. Submit Action Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-electric-blue hover:bg-primary text-white font-label-md py-4 rounded-xl font-semibold shadow-lg shadow-electric-blue/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-lg animate-spin">
                            progress_activity
                          </span>
                          <span>Submitting complaint…</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">
                            send
                          </span>
                          <span>Submit Complaint</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {modalView === 'success' && (
                /* SCREEN 3: Success Confirmation */
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-secondary/15 border-2 border-secondary flex items-center justify-center text-secondary shadow-lg">
                    <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                      Complaint Successfully Submitted
                    </h3>
                    <p className="text-on-surface-variant text-body-md text-sm">
                      Your complaint has been successfully submitted to UrbanEye.
                    </p>
                  </div>

                  {/* Confirmation Detail Card */}
                  <div className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between text-left shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl">confirmation_number</span>
                      <div>
                        <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Confirmation</div>
                        <div className="text-xs text-on-surface-variant">Complaint ID</div>
                      </div>
                    </div>
                    <div className="font-headline-md text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                      {submittedComplaintId}
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="w-full pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex-1 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md py-3.5 px-4 rounded-xl border border-outline-variant/30 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => {
                        closeReportModal();
                        navigateTo('complaints');
                        setShowToast(`Viewing Complaint ${submittedComplaintId}: Track resolution in real time.`);
                      }}
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                      View Complaint
                    </button>
                    <button
                      className="flex-1 bg-electric-blue hover:bg-primary text-white font-label-md py-3.5 px-4 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      onClick={closeReportModal}
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
