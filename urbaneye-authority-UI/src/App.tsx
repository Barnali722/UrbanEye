import React, { useState, useEffect, useRef } from 'react';
import { CitizenReportsView } from './components/CitizenReportsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { ExportReportModal } from './components/ExportReportModal';
import { AdminProfileModal } from './components/AdminProfileModal';
import { DeployAiModal } from './components/DeployAiModal';
import roadDamageUploadedImg from './assets/images/regenerated_image_1788097811288.jpg';
import garbageUploadedImg from './assets/images/regenerated_image_1788099264363.jpg';
import waterloggingUploadedImg from './assets/images/regenerated_image_1788099266227.jpg';

export default function App() {
  const [activeNav, setActiveNav] = useState<string>('Command Center');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    return document.documentElement.classList.contains('dark');
  });
  const [actionModal, setActionModal] = useState<{ title: string; location: string; category: string } | null>(null);
  const [detailsModal, setDetailsModal] = useState<{ title: string; location: string; desc: string; impact: string; time: string } | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [exportReportModalOpen, setExportReportModalOpen] = useState<boolean>(false);
  const [adminProfileModalOpen, setAdminProfileModalOpen] = useState<boolean>(false);
  const [deployAiModalOpen, setDeployAiModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic incident images with user upload support and localStorage persistence
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
        showToast('Image uploaded and updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync theme with document element and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // WebGL Shader Background Animation (from uploaded templates)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      varying highp vec2 v_texCoord;
      void main(void) {
        gl_Position = aVertexPosition;
        v_texCoord = aTextureCoord;
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        
        // Create slow, organic movement using layered sines
        float n = sin(uv.x * 2.0 + u_time * 0.1) * cos(uv.y * 2.0 - u_time * 0.08);
        float n2 = sin(uv.y * 3.0 - u_time * 0.05) * cos(uv.x * 1.5 + u_time * 0.12);
        
        vec3 color1 = vec3(0.2, 0.4, 0.8); // Tech Blue
        vec3 color2 = vec3(0.4, 0.2, 0.6); // Deep Violet
        
        vec3 finalColor = mix(color1, color2, n * 0.5 + 0.5);
        finalColor += mix(vec3(0.0), vec3(0.1, 0.2, 0.4), n2);
        
        // Subtle breathing pulse
        float pulse = sin(u_time * 0.3) * 0.05 + 0.95;
        finalColor *= pulse;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function loadShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) return;

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, 'u_time'),
        resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
      },
    };

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]), gl.STATIC_DRAW);

    let animationFrameId: number;
    const startTime = performance.now();

    function render(now: number) {
      if (!canvas || !gl) return;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programInfo.program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

      const time = (now - startTime) * 0.001;
      gl.uniform1f(programInfo.uniformLocations.time, time);
      gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-background dark:text-on-background font-body-md antialiased min-h-screen flex selection:bg-primary selection:text-on-primary w-full relative transition-colors duration-300">
      {/* Ambient Background with Shader & Orbs */}
      <div className="ambient-bg">
        <div className="ambient-orb dark:block hidden" style={{ top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: '#002e6a', animationDelay: '0s' }}></div>
        <div className="ambient-orb dark:block hidden" style={{ bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: '#00515d', animationDelay: '-5s' }}></div>
        <div className="ambient-orb dark:block hidden" style={{ top: '40%', left: '30%', width: '30vw', height: '30vw', background: '#93000a', opacity: 0.05, animationDelay: '-10s' }}></div>
      </div>
      <canvas ref={canvasRef} id="shader-container" width={800} height={600}></canvas>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-white/90 dark:bg-surface-container-high text-gray-900 dark:text-on-surface px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium border border-gray-200 dark:border-outline-variant/30 transition-all duration-300">
          <span className="material-symbols-outlined text-cyan-600 dark:text-secondary text-lg">info</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* SideNavBar (Exact matching template) */}
      <nav className="hidden md:flex h-screen w-80 fixed left-0 top-0 flex-col bg-white/90 dark:bg-surface/10 backdrop-blur-xl border-r border-gray-200 dark:border-outline-variant/20 shadow-xl z-40 transition-colors duration-300">
        <div className="flex flex-col h-full py-10 px-2 gap-6">
          {/* Header */}
          <div className="flex items-center gap-3.5 px-3 mb-8">
            <button
              onClick={() => setAdminProfileModalOpen(true)}
              className="flex items-center gap-3 flex-1 min-w-0 p-1.5 -m-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer"
              title="Open Admin Profile & Access Console"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-surface-container-high border-2 border-blue-200 dark:border-primary-container shrink-0 group-hover:scale-105 group-hover:border-blue-500 transition-all shadow-sm">
                <img
                  alt="User Profile Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBxfw8gK00Xm7lZqKmPfMfcd2GjaRRCRu0XaB3QaGD20r77FPMDDIsAn4evRvo54Ij9n8gE4zHKxoK4CipEuutxsqF0h6XII-dToZQwe8uhR_ao9MGqdsvTjgCiorYc6xnYJ2M3bZ-78iLu2Ryzcun3bmeCE4lL-9P97lPa_S0JteqlA8jeS-YWaF7RKofdPahGe2Ultm9Mg4CTc6I_gRqPd5imDxpovPQ7q592_9bYzZ6RGHO8w"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="font-headline-md text-blue-600 dark:text-primary font-bold text-lg leading-none truncate group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>UrbanEye AI</span>
                  <span className="material-symbols-outlined text-[14px] text-cyan-500">verified</span>
                </div>
                <div className="font-label-sm text-xs text-gray-500 dark:text-on-surface-variant truncate mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  System Administrator
                </div>
              </div>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-on-surface-variant dark:hover:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-variant/30 transition-colors shrink-0 flex items-center justify-center"
              id="themeToggleBtn"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-2 flex-grow">
            {[
              { name: 'Command Center', icon: 'dashboard', fill: true },
              { name: 'Citizen Reports', icon: 'record_voice_over', fill: false },
              { name: 'Analytics', icon: 'query_stats', fill: false },
              { name: 'System Settings', icon: 'settings', fill: false },
            ].map((tab) => {
              const isActive = activeNav === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveNav(tab.name);
                    showToast(`Navigated to ${tab.name}`);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 text-left ${
                    isActive
                      ? 'text-blue-600 dark:text-primary font-bold bg-blue-50 dark:bg-primary/5 hover:bg-blue-100 dark:hover:bg-surface-variant/50 hover:text-blue-700 dark:hover:text-on-surface'
                      : 'text-gray-700 dark:text-on-surface-variant font-medium hover:bg-gray-100 dark:hover:bg-surface-variant/50 hover:text-gray-900 dark:hover:text-on-surface'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={tab.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tab.icon}
                  </span>
                  <span className="font-label-md text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="mt-auto mb-4 bg-red-600 dark:bg-error-container text-white dark:text-on-error-container py-3 px-4 rounded-lg font-label-md text-sm font-semibold flex items-center justify-center gap-2 border border-red-700/30 dark:border-error/30 hover:bg-red-700 dark:hover:bg-error dark:hover:text-on-error transition-colors shadow-lg dark:shadow-[0_0_15px_rgba(147,0,10,0.3)]"
          >
            <span className="material-symbols-outlined">warning</span>
            Initiate Emergency Protocol
          </button>

          {/* Footer Tabs */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-outline-variant/20">
            <button
              onClick={() => showToast('Help Support')}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span className="font-label-sm text-xs">Help Support</span>
            </button>
            <button
              onClick={() => showToast('Sign Out')}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-label-sm text-xs">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-80 min-h-screen flex flex-col relative z-10">
        {/* TopNavBar (Mobile fallback) */}
        <header className="docked full-width top-0 sticky z-50 bg-white/80 dark:bg-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-outline-variant/10 shadow-sm md:hidden transition-colors duration-300">
          <div className="flex justify-between items-center w-full px-4 py-4 max-w-[1440px] mx-auto">
            <div className="font-headline-md text-xl font-black text-blue-600 dark:text-primary">
              UrbanEye Intelligence
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-on-surface-variant dark:hover:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-variant/30 transition-colors flex items-center justify-center"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
              <button onClick={() => showToast('No unread notifications')} className="p-2 text-gray-500 dark:text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-on-surface"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="px-4 py-3 bg-white/95 dark:bg-surface/95 backdrop-blur-md border-b border-gray-200 dark:border-outline-variant/20 flex flex-col gap-1 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {[
                { name: 'Command Center', icon: 'dashboard' },
                { name: 'Citizen Reports', icon: 'record_voice_over' },
                { name: 'Analytics', icon: 'query_stats' },
                { name: 'System Settings', icon: 'settings' },
              ].map((tab) => {
                const isActive = activeNav === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveNav(tab.name);
                      setMobileMenuOpen(false);
                      showToast(`Navigated to ${tab.name}`);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                      isActive
                        ? 'text-blue-600 dark:text-primary font-bold bg-blue-50 dark:bg-primary/10'
                        : 'text-gray-700 dark:text-on-surface-variant font-medium hover:bg-gray-100 dark:hover:bg-surface-variant/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </header>

        <div className="p-4 md:p-10 flex-1 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
          {activeNav === 'Citizen Reports' && (
            <CitizenReportsView
              onShowToast={showToast}
              onTakeAction={(inc) => setActionModal(inc)}
            />
          )}

          {activeNav === 'Analytics' && (
            <AnalyticsView onShowToast={showToast} />
          )}

          {activeNav === 'System Settings' && (
            <SystemSettingsView
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'Command Center' && (
            <>
              {/* Page Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-gray-200 dark:border-outline-variant/20">
                <div>
                  <h2 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl text-gray-900 dark:text-on-surface font-bold tracking-tight">
                    UrbanEye Command Center
                  </h2>
                  <p className="font-body-lg text-base md:text-lg text-gray-600 dark:text-on-surface-variant mt-2 max-w-2xl">
                    Know what needs attention. Act where it matters most.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    id="btn-export-report-command-center"
                    onClick={() => setExportReportModalOpen(true)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-outline-variant text-gray-700 dark:text-on-surface font-label-md text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-surface-variant/30 transition-colors bg-white/50 dark:bg-transparent shadow-xs cursor-pointer"
                    title="Export Municipal Incident Reports, Geospatial Layers, and Audit Tables"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Export Report</span>
                  </button>
                  <button
                    id="btn-deploy-ai-command-center"
                    onClick={() => setDeployAiModalOpen(true)}
                    className="px-4 py-2 rounded-lg ai-gradient text-white dark:text-on-primary-fixed font-label-md text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity glow-primary border-none shadow-md cursor-pointer"
                    title="Configure & Deploy Civic AI Vision and Prioritization Pipeline"
                  >
                    <span className="material-symbols-outlined text-[20px]">robot_2</span>
                    <span>Deploy AI</span>
                  </button>
                </div>
              </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 dark:bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <span className="font-label-sm text-xs text-gray-500 dark:text-on-surface-variant uppercase tracking-wider relative z-10 font-semibold">
                Open Issues
              </span>
              <div className="flex items-end gap-2 relative z-10">
                <span className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-gray-900 dark:text-on-surface font-bold">
                  1,284
                </span>
                <span className="font-label-sm text-xs text-red-600 dark:text-error flex items-center mb-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> 12%
                </span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden border-red-200 dark:border-error/30 bg-red-50/50 dark:bg-error-container/5 glow-critical group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 dark:bg-error/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <span className="font-label-sm text-xs text-red-600 dark:text-error uppercase tracking-wider font-bold relative z-10">
                Critical
              </span>
              <div className="flex items-end gap-2 relative z-10">
                <span className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-red-600 dark:text-error font-bold">
                  47
                </span>
                <span className="font-label-sm text-xs text-gray-500 dark:text-on-surface-variant flex items-center mb-1">
                  Requires immediate action
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-50 dark:bg-secondary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <span className="font-label-sm text-xs text-cyan-600 dark:text-secondary uppercase tracking-wider font-bold flex items-center gap-1 relative z-10">
                <span className="material-symbols-outlined text-[14px]">verified</span> AI Verified
              </span>
              <div className="flex items-end gap-2 relative z-10">
                <span className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-gray-900 dark:text-on-surface font-bold">
                  936
                </span>
                <span className="font-label-sm text-xs text-blue-600 dark:text-primary flex items-center mb-1 font-semibold">
                  72% accuracy rating
                </span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 dark:bg-primary-fixed/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <span className="font-label-sm text-xs text-gray-500 dark:text-on-surface-variant uppercase tracking-wider relative z-10 font-semibold">
                Resolved This Week
              </span>
              <div className="flex items-end gap-2 relative z-10">
                <span className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-gray-900 dark:text-on-surface font-bold">
                  312
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout Grid (Bento Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
            {/* Left Column: AI PRIORITY QUEUE (Spans 8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-xl md:text-2xl text-gray-900 dark:text-on-surface flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-cyan-500 dark:text-secondary">sort</span> AI Priority Queue
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter('All')}
                    className={`px-3 py-1 rounded-full font-label-sm text-xs font-semibold border transition-colors ${
                      activeFilter === 'All'
                        ? 'bg-gray-200 dark:bg-surface-variant text-gray-700 dark:text-on-surface-variant border-gray-300 dark:border-outline-variant/30'
                        : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-on-surface'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter('P1 Critical')}
                    className={`px-3 py-1 rounded-full font-label-sm text-xs font-semibold border ${
                      activeFilter === 'P1 Critical'
                        ? 'bg-red-100 dark:bg-error-container/20 text-red-600 dark:text-error border-red-200 dark:border-error/30'
                        : 'border-transparent text-red-600 dark:text-error hover:bg-red-50 dark:hover:bg-error-container/10'
                    }`}
                  >
                    P1 Critical
                  </button>
                </div>
              </div>

              {/* Dominant P1 CRITICAL Card */}
              <div className="glass-card rounded-2xl overflow-hidden border-red-200 dark:border-error/40 glow-critical flex flex-col md:flex-row relative group bg-red-50/30 dark:bg-transparent">
                {/* Urgent indicator strip */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 dark:bg-error z-10"></div>
                {/* Image Area */}
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden shrink-0">
                  <img
                    alt="Major Road Damage Incident"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={incidentImages.roadDamage}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 dark:from-[#0b0f10]/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-red-600 dark:bg-error text-white dark:text-on-error px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-lg">
                    <span className="material-symbols-outlined text-[12px]">emergency</span> P1 Critical
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="bg-white/90 dark:bg-surface-container-lowest/80 backdrop-blur text-gray-900 dark:text-on-surface px-2 py-1 rounded text-xs border border-gray-300/50 dark:border-outline-variant/30 flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px] text-cyan-600 dark:text-secondary">my_location</span> Sector 5
                    </div>
                    <div className="bg-white/90 dark:bg-surface-container-lowest/80 backdrop-blur text-gray-900 dark:text-on-surface px-2 py-1 rounded text-xs border border-gray-300/50 dark:border-outline-variant/30 flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 14m ago
                    </div>
                  </div>
                </div>
                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-headline-md text-xl md:text-2xl text-gray-900 dark:text-on-surface mb-2 font-bold">
                      Major Road Damage
                    </h4>
                    <p className="font-body-md text-sm md:text-base text-gray-700 dark:text-on-surface-variant mb-4 line-clamp-3 leading-relaxed">
                      Severe structural degradation identified on primary arterial route. Immediate intervention required to prevent further structural failure and potential vehicle damage.
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setActionModal({ title: 'Major Road Damage', location: 'Sector 5, Arterial Route', category: 'Road Infrastructure' })}
                      className="flex-1 bg-red-600 dark:bg-error text-white dark:text-on-error py-2.5 rounded-lg font-label-md text-sm font-semibold hover:bg-red-700 dark:hover:bg-[#ff897d] transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">engineering</span> Take Action
                    </button>
                    <button
                      onClick={() => setDetailsModal({
                        title: 'Major Road Damage',
                        location: 'Sector 5 (Intersection 4B & Main Ave)',
                        desc: 'Severe structural degradation identified on primary arterial route. Immediate intervention required to prevent further structural failure and potential vehicle damage.',
                        impact: '20 duplicate citizen reports merged by AI. Est. 2,400 vehicles impacted daily.',
                        time: '14 minutes ago'
                      })}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-outline-variant text-gray-700 dark:text-on-surface font-label-md text-sm font-semibold hover:bg-white dark:hover:bg-surface-variant/50 transition-colors bg-white/50 dark:bg-transparent"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Issues List */}
              <div className="flex flex-col gap-3">
                <h4 className="font-label-sm text-xs text-gray-500 dark:text-on-surface-variant uppercase tracking-wider mt-2 px-2 font-semibold">
                  High Priority Escalations
                </h4>
                {/* List Item 1 */}
                <div
                  onClick={() => setDetailsModal({
                    title: 'Garbage Accumulation',
                    location: 'Ward 12, Commercial District',
                    desc: 'Overflowing municipal bins blocking pedestrian pathway and commercial entry.',
                    impact: '12 citizen reports consolidated. Waste pickup vehicle dispatched.',
                    time: '2 hours ago'
                  })}
                  className="glass-card rounded-xl p-3 flex gap-4 items-center hover:bg-white dark:hover:bg-surface-variant/30 group cursor-pointer border border-gray-200/80 dark:border-outline-variant/10"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                    <img
                      alt="Garbage Accumulation"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      src={incidentImages.garbage}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gray-900/10 dark:bg-surface-container-lowest/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-100 dark:bg-[#93000a]/20 text-red-600 dark:text-error px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-200 dark:border-[#93000a]/30">
                        P2 HIGH
                      </span>
                      <h5 className="font-label-md text-sm text-gray-900 dark:text-on-surface truncate font-bold">
                        Garbage Accumulation
                      </h5>
                    </div>
                    <div className="font-body-md text-sm text-gray-600 dark:text-on-surface-variant truncate flex items-center gap-1 mb-1.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> Ward 12, Commercial District
                    </div>
                    <div className="flex gap-2 font-label-sm text-xs text-gray-500 dark:text-on-surface-variant font-medium">
                      <span className="bg-gray-200 dark:bg-surface-variant px-2 py-0.5 rounded text-xs text-gray-700 dark:text-on-surface">Sanitation</span>
                      <span className="text-gray-500 dark:text-tertiary">Reported 2h ago</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-outline-variant/30 flex items-center justify-center text-gray-400 dark:text-on-surface-variant group-hover:border-blue-500 group-hover:text-blue-500 dark:group-hover:border-primary dark:group-hover:text-primary transition-colors shrink-0 mr-2 bg-white dark:bg-transparent">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>

                {/* List Item 2 */}
                <div
                  onClick={() => setDetailsModal({
                    title: 'Severe Waterlogging',
                    location: 'Underpass 4, Central Avenue',
                    desc: 'Drainage blockage causing standing water during heavy morning traffic.',
                    impact: '14 citizen reports merged. Pump team P-2 assigned.',
                    time: '45 minutes ago'
                  })}
                  className="glass-card rounded-xl p-3 flex gap-4 items-center hover:bg-white dark:hover:bg-surface-variant/30 group cursor-pointer border border-gray-200/80 dark:border-outline-variant/10"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                    <img
                      alt="Severe Waterlogging"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      src={incidentImages.waterlogging}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gray-900/10 dark:bg-surface-container-lowest/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-100 dark:bg-[#93000a]/20 text-red-600 dark:text-error px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-200 dark:border-[#93000a]/30">
                        P2 HIGH
                      </span>
                      <h5 className="font-label-md text-sm text-gray-900 dark:text-on-surface truncate font-bold">
                        Severe Waterlogging
                      </h5>
                    </div>
                    <div className="font-body-md text-sm text-gray-600 dark:text-on-surface-variant truncate flex items-center gap-1 mb-1.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span> Underpass 4, Central Avenue
                    </div>
                    <div className="flex gap-2 font-label-sm text-xs text-gray-500 dark:text-on-surface-variant font-medium">
                      <span className="bg-gray-200 dark:bg-surface-variant px-2 py-0.5 rounded text-xs text-gray-700 dark:text-on-surface">Drainage</span>
                      <span className="text-gray-500 dark:text-tertiary">Reported 45m ago</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-outline-variant/30 flex items-center justify-center text-gray-400 dark:text-on-surface-variant group-hover:border-blue-500 group-hover:text-blue-500 dark:group-hover:border-primary dark:group-hover:text-primary transition-colors shrink-0 mr-2 bg-white dark:bg-transparent">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Map Interface (Spans 4 cols) */}
            <div className="lg:col-span-4 flex flex-col h-[500px] lg:h-auto">
              <h3 className="font-headline-md text-xl md:text-2xl text-gray-900 dark:text-on-surface flex items-center gap-2 mb-6 font-bold">
                <span className="material-symbols-outlined text-cyan-500 dark:text-secondary">map</span> Live City Map
              </h3>
              <div className="rounded-2xl flex-1 relative overflow-hidden flex flex-col bg-gray-900 dark:bg-[#0b0f10] shadow-lg border border-gray-200 dark:border-outline-variant/20">
                {/* Simulated Map Background */}
                <div
                  className="absolute inset-0 bg-[#101415] opacity-90 z-0 transition-transform duration-300"
                  style={{ transform: `scale(${mapZoom})` }}
                >
                  {/* SVG Map grid pattern */}
                  <svg className="opacity-20 absolute inset-0" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8c909f" strokeWidth="0.5"></path>
                      </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                  </svg>
                  {/* Simulated Heatmap Blob */}
                  <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-red-500 dark:bg-error rounded-full blur-[60px] opacity-20"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-cyan-500 dark:bg-secondary rounded-full blur-[50px] opacity-10"></div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <div className="glass-panel rounded-lg overflow-hidden flex flex-col bg-white/10 dark:bg-white/5 border border-gray-600/50">
                    <button
                      onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                      className="w-8 h-8 flex items-center justify-center text-white dark:text-on-surface hover:bg-white/20 dark:hover:bg-surface-variant/50 transition-colors border-b border-gray-600/50 dark:border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                      onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                      className="w-8 h-8 flex items-center justify-center text-white dark:text-on-surface hover:bg-white/20 dark:hover:bg-surface-variant/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                  </div>
                  <button
                    onClick={() => showToast('Toggling map layer view')}
                    className="glass-panel w-8 h-8 rounded-lg flex items-center justify-center text-white dark:text-on-surface hover:bg-white/20 dark:hover:bg-surface-variant/50 transition-colors bg-white/10 dark:bg-white/5 border border-gray-600/50"
                  >
                    <span className="material-symbols-outlined text-[18px]">layers</span>
                  </button>
                </div>

                {/* Map Pins */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Pin 1 (Critical) */}
                  <div
                    onClick={() => showToast('Selected Pin: Sector 5 (Road Damage - P1)')}
                    className="absolute top-[35%] left-[45%] flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-red-600 dark:bg-error text-white dark:text-on-error px-2 py-1 rounded text-xs font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Sector 5: Road Damage
                    </div>
                    <div className="w-4 h-4 rounded-full bg-red-500 dark:bg-error border-2 border-[#101415] shadow-[0_0_15px_rgba(255,180,171,0.6)] relative marker-pulse transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_25px_rgba(255,180,171,0.9)]"></div>
                  </div>

                  {/* Pin 2 (High) */}
                  <div
                    onClick={() => showToast('Selected Pin: Ward 12 (Sanitation - P2)')}
                    className="absolute top-[20%] left-[70%] flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-red-500 dark:bg-[#ffb4ab] text-white dark:text-on-error px-2 py-1 rounded text-xs font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ward 12: Sanitation
                    </div>
                    <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-[#ffb4ab] border-2 border-[#101415] shadow-[0_0_10px_rgba(255,180,171,0.4)] relative marker-pulse transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(255,180,171,0.7)]"></div>
                  </div>

                  {/* Pin 3 (High) */}
                  <div
                    onClick={() => showToast('Selected Pin: Underpass 4 (Drainage - P2)')}
                    className="absolute bottom-[40%] left-[30%] flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-red-500 dark:bg-[#ffb4ab] text-white dark:text-on-error px-2 py-1 rounded text-xs font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Underpass 4: Drainage
                    </div>
                    <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-[#ffb4ab] border-2 border-[#101415] shadow-[0_0_10px_rgba(255,180,171,0.4)] relative marker-pulse transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(255,180,171,0.7)]"></div>
                  </div>

                  {/* Pin 4 (Medium) */}
                  <div
                    onClick={() => showToast('Selected Pin: Sector 9 (Signage - P3)')}
                    className="absolute top-[60%] right-[25%] flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-indigo-600 dark:text-on-primary-fixed text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Sector 9: Signage
                    </div>
                    <div className="w-3 h-3 rounded-full bg-indigo-400 dark:bg-tertiary border-2 border-[#101415] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(173,198,255,0.6)]"></div>
                  </div>

                  {/* Pin 5 (Low) */}
                  <div
                    onClick={() => showToast('Selected Pin: Park Street (Pruning - P4)')}
                    className="absolute bottom-[20%] right-[40%] flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-cyan-600 dark:text-on-primary-fixed text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Park Street: Pruning
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 dark:bg-secondary border-2 border-[#101415] transition-all duration-300 group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(0,203,230,0.6)]"></div>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="mt-auto z-10 p-4">
                  <div className="glass-panel rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-label-sm bg-[#1a1e20]/80 dark:bg-white/5 backdrop-blur-md border border-gray-700/50">
                    <div className="flex items-center gap-1.5 w-full mb-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-300 dark:text-on-surface-variant">filter_list</span>
                      <span className="text-gray-300 dark:text-on-surface-variant font-semibold">Status Legend</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-error"></div>
                      <span className="text-white dark:text-on-surface font-medium">Critical (P1)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400 dark:bg-[#ffb4ab]"></div>
                      <span className="text-white dark:text-on-surface font-medium">High (P2)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-tertiary"></div>
                      <span className="text-white dark:text-on-surface font-medium">Medium (P3)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 dark:bg-secondary"></div>
                      <span className="text-white dark:text-on-surface font-medium">Low (P4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="full-width bottom-0 bg-white dark:bg-surface-container-lowest border-t border-gray-200 dark:border-outline-variant/10 mt-auto z-20 relative transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 w-full gap-4 max-w-[1440px] mx-auto">
            <div className="font-headline-md text-lg text-gray-900 dark:text-on-surface font-bold">
              UrbanEye Intelligence
            </div>
            <div className="font-body-md text-xs md:text-sm text-gray-600 dark:text-tertiary-container">
              © 2024 UrbanEye Intelligence Systems. Authorized personnel only.
            </div>
            <div className="flex gap-4 font-label-sm text-xs">
              <button onClick={() => showToast('Privacy Policy')} className="text-gray-600 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => showToast('Terms of Service')} className="text-gray-600 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors">
                Terms of Service
              </button>
              <button onClick={() => showToast('API Documentation')} className="text-gray-600 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors">
                API Documentation
              </button>
              <button onClick={() => showToast('Security Audit')} className="text-gray-600 dark:text-on-surface-variant hover:text-gray-900 dark:hover:text-on-surface transition-colors">
                Security Audit
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-container rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-outline-variant/30 text-gray-900 dark:text-on-surface">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 dark:text-error">engineering</span>
                <h3 className="font-bold text-lg font-['Montserrat']">Dispatch Municipal Action</h3>
              </div>
              <button onClick={() => setActionModal(null)} className="text-gray-400 hover:text-gray-600 dark:text-on-surface-variant dark:hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <label className="text-xs uppercase font-semibold text-gray-500 dark:text-on-surface-variant">Incident Target</label>
                <div className="font-bold text-base mt-0.5">{actionModal.title}</div>
                <div className="text-xs text-gray-600 dark:text-on-surface-variant">{actionModal.location}</div>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-gray-500 dark:text-on-surface-variant">Department Task Force</label>
                <select className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-outline-variant/30 bg-gray-50 dark:bg-surface-container-high text-gray-900 dark:text-on-surface text-sm">
                  <option>Rapid Response Unit R-04 (Heavy Machinery)</option>
                  <option>Sanitation & Waste Disposal Team S-12</option>
                  <option>Public Works & Stormwater Drainage Unit D-2</option>
                  <option>Traffic Police & Route Diverters Division</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase font-semibold text-gray-500 dark:text-on-surface-variant">Action Directive</label>
                <textarea
                  defaultValue="Immediate structural barrier placement and asphalt patching squad deployment within 30 minutes."
                  rows={3}
                  className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-outline-variant/30 bg-gray-50 dark:bg-surface-container-high text-gray-900 dark:text-on-surface text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-outline-variant/20">
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-outline-variant/30 text-gray-700 dark:text-on-surface-variant text-sm font-semibold hover:bg-gray-100 dark:hover:bg-surface-variant/30"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActionModal(null);
                  showToast(`Action dispatched for ${actionModal.title}. Unit notified.`);
                }}
                className="flex-1 py-2.5 rounded-lg bg-red-600 dark:bg-error text-white dark:text-on-error text-sm font-semibold hover:bg-red-700 dark:hover:bg-[#ff897d] shadow-md flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-container rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-outline-variant/30 text-gray-900 dark:text-on-surface">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-secondary">info</span>
                <h3 className="font-bold text-lg font-['Montserrat']">{detailsModal.title}</h3>
              </div>
              <button onClick={() => setDetailsModal(null)} className="text-gray-400 hover:text-gray-600 dark:text-on-surface-variant dark:hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500 dark:text-on-surface-variant">Location</span>
                <p className="text-sm font-medium flex items-center gap-1 mt-0.5 text-gray-900 dark:text-on-surface">
                  <span className="material-symbols-outlined text-cyan-600 dark:text-secondary text-[16px]">location_on</span>
                  {detailsModal.location}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500 dark:text-on-surface-variant">AI Incident Analysis</span>
                <p className="text-sm text-gray-700 dark:text-on-surface-variant mt-1 leading-relaxed">{detailsModal.desc}</p>
              </div>
              <div className="bg-blue-50/70 dark:bg-surface-variant/30 p-3.5 rounded-xl border border-blue-100 dark:border-outline-variant/20">
                <span className="text-xs text-blue-700 dark:text-secondary font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Citizen Impact & AI Clustering
                </span>
                <p className="text-xs text-gray-700 dark:text-on-surface-variant mt-1">{detailsModal.impact}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-on-surface-variant pt-2">
                <span>First Reported: {detailsModal.time}</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Field verified
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-outline-variant/20">
              <button
                onClick={() => setDetailsModal(null)}
                className="px-5 py-2 rounded-lg bg-gray-900 dark:bg-surface-bright text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Protocol Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-container rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 dark:border-error text-gray-900 dark:text-on-surface">
            <div className="flex items-center gap-3 text-red-600 dark:text-error pb-3 border-b border-red-100 dark:border-outline-variant/20">
              <span className="material-symbols-outlined text-3xl">emergency_home</span>
              <div>
                <h3 className="font-bold text-lg font-['Montserrat']">City Emergency Protocol</h3>
                <p className="text-xs text-gray-500 dark:text-on-surface-variant">Elevated Threat Level Activation</p>
              </div>
            </div>
            <div className="py-4 space-y-3">
              <p className="text-sm text-gray-700 dark:text-on-surface-variant leading-relaxed">
                Triggering the Emergency Protocol will immediately notify municipal crisis teams, dispatch high-priority responders to Sector 5, and alert citizen apps.
              </p>
              <div className="p-3 bg-red-50 dark:bg-error-container/20 rounded-xl border border-red-200 dark:border-error/30 text-xs text-red-800 dark:text-on-error-container font-medium">
                Authorization: Level 4 System Administrator Credentials verified.
              </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-outline-variant/20">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-outline-variant/30 text-gray-700 dark:text-on-surface-variant text-sm font-semibold hover:bg-gray-100 dark:hover:bg-surface-variant/30"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEmergencyModalOpen(false);
                  showToast('EMERGENCY PROTOCOL ACTIVATED: Alert sent to all city response units.');
                }}
                className="flex-1 py-2.5 rounded-lg bg-red-600 dark:bg-error text-white dark:text-on-error text-sm font-semibold hover:bg-red-700 dark:hover:bg-[#ff897d] shadow-lg flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">warning</span>
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Municipal Incident Report Modal */}
      <ExportReportModal
        isOpen={exportReportModalOpen}
        onClose={() => setExportReportModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Admin Profile & System Access Management Modal */}
      <AdminProfileModal
        isOpen={adminProfileModalOpen}
        onClose={() => setAdminProfileModalOpen(false)}
        onShowToast={showToast}
        onTriggerEmergency={() => {
          setAdminProfileModalOpen(false);
          setEmergencyModalOpen(true);
        }}
      />

      {/* Deploy AI Model Pipeline Modal */}
      <DeployAiModal
        isOpen={deployAiModalOpen}
        onClose={() => setDeployAiModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
