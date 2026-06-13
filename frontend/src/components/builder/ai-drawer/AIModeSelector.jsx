import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Pencil, Palette, Search } from 'lucide-react';

const AI_MODES = [
  { id: 'build', label: 'Build', icon: Hammer, desc: 'Creates pages and sections' },
  { id: 'edit', label: 'Edit', icon: Pencil, desc: 'Updates existing content' },
  { id: 'design', label: 'Design', icon: Palette, desc: 'Improves visual appearance' },
  { id: 'seo', label: 'SEO', icon: Search, desc: 'Optimizes search performance' },
];

export default function AIModeSelector({ value, onChange }) {
  return (
    <div className="px-5 py-3 border-b border-white/[0.04]">
      <div className="flex rounded-2xl bg-white/[0.03] border border-white/[0.06] p-1">
        {AI_MODES.map((mode) => {
          const Icon = mode.icon;
          const active = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="ai-mode-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon size={12} />
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-center text-[9px] font-medium text-slate-600">
        {AI_MODES.find((m) => m.id === value)?.desc}
      </p>
    </div>
  );
}
