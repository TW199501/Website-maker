import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Clock3, Eye, FileCode2, FileText, History, Home, Map, Maximize2, Minimize2, MoreHorizontal, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Rocket, Save, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import ToolBar from './ToolBar';
import DeviceSwitcher from './DeviceSwitcher';
import { generateWebsiteCode } from '../../services/codeGenerator';
import { projectStorage } from '../../services/projectStorage';
import { topBarTools } from '../../data/builderTools';

const formatTime = (value) => {
  if (!value) return 'Not saved yet';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
};

export default function BuilderTopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const {
    project,
    currentPage,
    nodesMap,
    isSaving,
    lastSavedAt,
    setProject,
    commitNodesMap,
    saveProject,
    publishProject,
    switchPage,
    showToast,
    leftPanelCollapsed,
    rightPanelCollapsed,
    fullscreenCanvas,
    canvasView,
    setCanvasView,
    setLeftPanelCollapsed,
    setRightPanelCollapsed,
    setFullscreenCanvas,
    aiDrawerOpen,
    setAiDrawerOpen,
  } = useBuilderStore();

  const handlePreview = async () => {
    const saved = await saveProject();
    if (saved) navigate(`/preview/${saved.id}`);
  };

  const handlePublish = async () => {
    const published = await publishProject();
    if (published) navigate(`/site/${published.slug}`);
  };

  const versionKey = project?.id ? `shopcraft_project_versions_${project.id}` : null;
  const readVersions = () => {
    if (!versionKey) return [];
    try {
      return JSON.parse(window.localStorage.getItem(versionKey) || '[]');
    } catch {
      return [];
    }
  };
  const [versions, setVersions] = useState([]);

  const openExport = () => {
    setGeneratedCode(generateWebsiteCode({ ...project, nodesMap }));
    setExportOpen(true);
  };

  const copyText = async (label, value) => {
    if (!value) return showToast(`${label} is not ready yet.`, 'error');
    await navigator.clipboard.writeText(value);
    showToast(`${label} copied.`, 'success');
  };

  const saveSnapshot = () => {
    const snapshot = {
      id: `version-${Date.now()}`,
      createdAt: new Date().toISOString(),
      project: { ...project, nodesMap },
    };
    const next = [snapshot, ...readVersions()].slice(0, 20);
    window.localStorage.setItem(versionKey, JSON.stringify(next));
    setVersions(next);
    showToast('Version snapshot saved.', 'success');
  };

  const openVersions = () => {
    setVersions(readVersions());
    setVersionOpen(true);
  };

  const restoreVersion = (snapshot) => {
    projectStorage.updateProject(project.id, snapshot.project);
    setProject(snapshot.project);
    commitNodesMap(snapshot.project.nodesMap || {}, { skipHistory: true });
    setVersionOpen(false);
    showToast('Version restored.', 'success');
  };

  const moreActions = {
    export: openExport,
    'version-history': openVersions,
    'connect-domain': () => showToast('Domain connection placeholder configured. DNS/backend connection required for live usage.'),
    settings: () => showToast('Open the Settings tool in the left panel to edit project settings.'),
  };

  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const pageDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target)) setPageDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchPage = (pageId) => {
    switchPage(pageId);
    setPageDropdownOpen(false);
    if (project?.id) navigate(`/builder/website/${project.id}/page/${pageId}`, { replace: true });
  };

  return (
    <header className="h-14 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.05] flex items-center px-4 lg:px-6 shrink-0 z-50 relative">
      {/* LEFT SECTION */}
      <div className="flex-1 flex items-center gap-4 min-w-0">
        <Link to="/dashboard" title="Back to Dashboard" className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all hover-lift">
          <ArrowLeft size={16} />
        </Link>
        <div className="h-5 w-px bg-white/[0.05] hidden md:block" />
        <div className="min-w-0 flex items-center gap-1.5">
          <h1 className="truncate text-sm font-semibold text-slate-200">{project?.name || 'Website Builder'}</h1>
          <span className="text-slate-600">/</span>
          <div className="relative" ref={pageDropdownRef}>
            <button
              type="button"
              onClick={() => setPageDropdownOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-white hover-lift"
            >
              <FileText size={14} />
              <span className="max-w-[120px] truncate">{currentPage?.name || 'Home'}</span>
              <ChevronDown size={14} />
            </button>
            {pageDropdownOpen && (
              <div className="absolute left-0 top-9 z-[100] w-64 rounded-2xl border border-white/[0.05] bg-slate-900/95 backdrop-blur-xl p-2 shadow-soft">
                <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">Switch Page</p>
                {(project?.pages || []).map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => handleSwitchPage(page.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition-all ${
                      currentPage?.id === page.id
                        ? 'bg-indigo-500/10 text-indigo-300'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {page.isHome ? <Home size={13} className="shrink-0 text-indigo-400" /> : <FileText size={13} className="shrink-0 text-slate-500" />}
                    <span className="flex-1 truncate">{page.name}</span>
                    <span className="text-[9px] font-bold text-slate-600">/{page.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="flex-[2] flex items-center justify-center gap-3 overflow-x-auto custom-scrollbar px-2">
        <button
          type="button"
          onClick={() => setCanvasView(canvasView === 'design' ? 'routing' : 'design')}
          title={canvasView === 'design' ? 'View routing map' : 'View design'}
          className={`h-8 flex items-center gap-1.5 rounded-full px-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            canvasView === 'routing' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-slate-400 hover:bg-white/5 hover:text-white hover-lift border border-transparent'
          }`}
        >
          <Map size={16} />
          <span className="hidden sm:inline">Map</span>
        </button>
        
        <div className="h-5 w-px bg-white/[0.05]" />
        
        <DeviceSwitcher />
        
        <div className="h-5 w-px bg-white/[0.05]" />
        
        <ToolBar />

        <div className="h-5 w-px bg-white/[0.05]" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Left Panel"
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all hover-lift ${!leftPanelCollapsed ? 'bg-white/10 text-white shadow-inner border border-white/[0.05]' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            {leftPanelCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <button
            type="button"
            title="Right Panel"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all hover-lift ${!rightPanelCollapsed ? 'bg-white/10 text-white shadow-inner border border-white/[0.05]' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            {rightPanelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
          </button>
          <button
            type="button"
            title="Fullscreen"
            onClick={() => setFullscreenCanvas(!fullscreenCanvas)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all hover-lift ${fullscreenCanvas ? 'bg-white/10 text-white shadow-inner border border-white/[0.05]' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            {fullscreenCanvas ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex items-center justify-end gap-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mr-2 hidden lg:flex">
          <Clock3 size={12} />
          <span>{isSaving ? 'Saving...' : `Saved ${formatTime(lastSavedAt)}`}</span>
        </div>
        
        <button
          type="button"
          onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
          className={`inline-flex items-center justify-center h-8 px-3 mr-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover-lift ${
            aiDrawerOpen 
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
              : 'bg-white/5 text-violet-400 border border-white/[0.05] hover:bg-violet-500/10 hover:text-violet-300'
          }`}
        >
          <Sparkles size={14} className="sm:mr-1.5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        <button
          type="button"
          onClick={saveProject}
          className="inline-flex items-center justify-center h-8 px-3 rounded-full text-xs font-bold text-slate-300 border border-white/5 hover:bg-white/10 hover:text-white transition-all hover-lift"
        >
          <Save size={14} className="sm:mr-1.5" />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          type="button"
          onClick={handlePreview}
          className="inline-flex items-center justify-center h-8 px-3 rounded-full text-xs font-bold text-slate-300 border border-white/10 hover:border-white/30 hover:bg-white/5 hover:text-white transition-all hover-lift"
        >
          <Eye size={14} className="sm:mr-1.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={handlePublish}
          className="inline-flex items-center justify-center h-8 px-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-soft hover-lift shadow-indigo-500/20"
        >
          <Rocket size={14} className="sm:mr-1.5" />
          <span className="hidden sm:inline">Publish</span>
        </button>

        <div className="h-5 w-px bg-white/[0.05] ml-1 mr-1" />

        <div className="relative">
          <button
            type="button"
            title="More options"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all hover-lift"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 w-56 rounded-2xl border border-white/[0.05] bg-slate-900/95 backdrop-blur-xl p-2 shadow-soft">
              {[
                { id: 'export', label: topBarTools.find((tool) => tool.id === 'export')?.name || 'Export Website', icon: FileCode2 },
                { id: 'version-history', label: topBarTools.find((tool) => tool.id === 'version-history')?.name || 'Version History', icon: History },
                { id: 'connect-domain', label: 'Connect domain', icon: Rocket },
                { id: 'settings', label: 'Open settings', icon: MoreHorizontal },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    moreActions[id]?.();
                  }}
                  className="flex w-full items-center gap-2 text-left px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {exportOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setExportOpen(false)}>
          <div className="max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl custom-scrollbar" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Clean export</p>
                <h3 className="text-2xl font-black text-white">Export Website</h3>
              </div>
              <button type="button" onClick={() => setExportOpen(false)} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-300">Close</button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                ['HTML', generatedCode?.html],
                ['CSS', generatedCode?.css],
                ['React', generatedCode?.react],
              ].map(([label, value]) => (
                <section key={label} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{label}</p>
                    <button type="button" onClick={() => copyText(label, value)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white">Copy</button>
                  </div>
                  <textarea value={value || ''} readOnly rows={12} className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-[10px] text-slate-300 outline-none" />
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
      {versionOpen && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setVersionOpen(false)}>
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Snapshots</p>
                <h3 className="text-2xl font-black text-white">Version History</h3>
              </div>
              <button type="button" onClick={saveSnapshot} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">Save snapshot</button>
            </div>
            <div className="mt-5 space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div>
                    <p className="text-sm font-black text-white">{project?.name || 'Project'} snapshot</p>
                    <p className="text-xs text-slate-500">{new Date(version.createdAt).toLocaleString()}</p>
                  </div>
                  <button type="button" onClick={() => restoreVersion(version)} className="rounded-xl border border-slate-700 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white">Restore</button>
                </div>
              ))}
              {!versions.length && <p className="rounded-2xl border border-dashed border-slate-800 p-5 text-sm text-slate-500">No snapshots yet. Save one now to make restore available.</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
