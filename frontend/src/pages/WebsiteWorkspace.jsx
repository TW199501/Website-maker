import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import WebsiteAIPanel from '../components/website/WebsiteAIPanel';
import { WebsiteLivePreview } from '../components/templates/TemplatePreviewModal';
import { getTemplateProject, updateTemplateProject } from '../utils/projectStorage';
import { ChevronDown, ChevronRight, Settings2, Code2, Paintbrush, Terminal } from 'lucide-react';

const editorCss = `
  .shopcraft-added-section {
    padding: 64px 7%;
    background: #ffffff;
    color: #0f172a;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }
  .shopcraft-added-section h2 {
    margin: 0 0 12px;
    font-size: 34px;
    line-height: 1.15;
  }
  .shopcraft-added-section p {
    max-width: 680px;
    margin: 0;
    color: #475569;
  }
  .shopcraft-added-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    margin-top: 22px;
    padding: 0 22px;
    border-radius: 12px;
    background: #6366f1;
    color: #fff;
    font-weight: 800;
    text-decoration: none;
  }
  .shopcraft-added-image {
    min-height: 280px;
    border-radius: 24px;
    margin: 44px 7%;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #111827, #6366f1, #22d3ee);
    color: #fff;
    font-weight: 900;
  }
`;

const ensureEditorCss = (css = '') => (css.includes('.shopcraft-added-section') ? css : `${css}\n${editorCss}`);

function PreviewOverlay({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Website preview</p>
            <h2 className="text-xl font-black text-white">{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Close
          </button>
        </div>
        <WebsiteLivePreview content={project.content} />
      </div>
    </div>
  );
}

export function PropertySection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/[0.05] rounded-2xl bg-white/[0.02] overflow-hidden transition-all">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={14} className="text-indigo-400" />}
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-200">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-white/[0.05] bg-slate-950/30">
          {children}
        </div>
      )}
    </div>
  );
}

export default function WebsiteWorkspace() {
  const { projectId } = useParams();
  const initialProject = useMemo(() => getTemplateProject(projectId), [projectId]);
  const [project, setProject] = useState(initialProject);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!project) {
    return (
      <WorkspaceLayout projectName="Project not found" publishLabel="Export" leftPanel={<div />} rightPanel={<div />}>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-black text-white">Template project not found</h1>
          <p className="mt-3 text-slate-400">Open a template from the library to create an editable workspace project.</p>
          <Link to="/templates" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
            Back to templates
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const updateContent = (updates) => {
    setProject((current) => ({
      ...current,
      content: {
        ...current.content,
        ...updates,
      },
    }));
  };

  const appendHtml = (snippet) => {
    updateContent({
      html: `${project.content.html}\n${snippet}`,
      css: ensureEditorCss(project.content.css),
    });
  };

  const saveProject = () => {
    const saved = updateTemplateProject(project.id, project);
    setProject(saved);
    setNotice('Saved locally.');
  };

  const handleAIGenerate = (payload) => {
    console.log('[ShopCraft AI] Website generation payload:', payload);
    setNotice(`AI generating: "${payload.prompt.slice(0, 50)}…"`);
  };

  const leftPanel = (
    <WebsiteAIPanel onGenerate={handleAIGenerate} />
  );

  const rightPanel = (
    <div className="space-y-4 p-5">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 size={16} className="text-indigo-400" />
          <p className="text-sm font-black uppercase tracking-widest text-white">Properties</p>
        </div>
        <p className="text-[11px] text-slate-400">Configure template source and settings.</p>
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300 shadow-soft">
          {notice}
        </div>
      )}

      <label className="block mb-4">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project name</span>
        <input
          value={project.name}
          onChange={(event) => setProject({ ...project, name: event.target.value })}
          className="w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-white outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all shadow-inner"
        />
      </label>

      <PropertySection title="HTML Structure" icon={Code2} defaultOpen={true}>
        <div className="mt-3">
          <textarea
            value={project.content.html}
            onChange={(event) => updateContent({ html: event.target.value })}
            rows={8}
            className="w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-3 py-3 font-mono text-[11px] text-slate-300 outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all custom-scrollbar shadow-inner"
          />
        </div>
      </PropertySection>

      <PropertySection title="CSS Styling" icon={Paintbrush} defaultOpen={false}>
        <div className="mt-3">
          <textarea
            value={project.content.css}
            onChange={(event) => updateContent({ css: event.target.value })}
            rows={8}
            className="w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-3 py-3 font-mono text-[11px] text-slate-300 outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all custom-scrollbar shadow-inner"
          />
        </div>
      </PropertySection>

      <PropertySection title="JavaScript Logic" icon={Terminal} defaultOpen={false}>
        <div className="mt-3">
          <textarea
            value={project.content.js}
            onChange={(event) => updateContent({ js: event.target.value })}
            rows={6}
            className="w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-3 py-3 font-mono text-[11px] text-slate-300 outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all custom-scrollbar shadow-inner"
          />
        </div>
      </PropertySection>
    </div>
  );

  return (
    <>
      <WorkspaceLayout
        projectName={project.name}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        leftPanelClassName="w-80 md:w-96 bg-slate-900 border-r border-white/[0.05] flex flex-col shrink-0 overflow-hidden"
        publishLabel="Export"
        onSave={saveProject}
        onPreview={() => setShowPreview(true)}
        onPublish={() => setNotice('Export placeholder ready. Final file exporters can plug into this project content.')}
      >
        <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white shadow-soft ring-1 ring-white/5 transition-all">
          <WebsiteLivePreview content={project.content} />
        </div>
      </WorkspaceLayout>

      {showPreview && <PreviewOverlay project={project} onClose={() => setShowPreview(false)} />}
    </>
  );
}
