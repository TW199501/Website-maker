import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Eye, Rocket, Share2 } from 'lucide-react';

export default function EditorHeader({ projectName = 'Untitled Project' }) {
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-6 z-50">
      {/* Left: Back & Project Name */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 group hover-lift"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest hidden md:block">Back to Dashboard</span>
        </button>
        <div className="h-6 w-px bg-white/[0.05]"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Editing</span>
          <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">{projectName}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover-lift">
          <Save size={16} />
          <span className="hidden sm:block">Save</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all hover-lift">
          <Eye size={16} />
          <span className="hidden sm:block">Preview</span>
        </button>
        <div className="h-6 w-px bg-white/[0.05] mx-2"></div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 hover-lift">
          <Rocket size={16} />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}
