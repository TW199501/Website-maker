import { motion } from 'framer-motion';
import {
  Palette,
  FileText,
  Image,
  BarChart3,
} from 'lucide-react';

const TOOLS = [
  {
    id: 'design',
    icon: Palette,
    title: 'Design Assistant',
    description: 'AI-powered layout and style improvements',
    gradient: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/15',
    iconColor: 'text-violet-400',
  },
  {
    id: 'content',
    icon: FileText,
    title: 'Content Generator',
    description: 'Generate compelling copy and headings',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/15',
    iconColor: 'text-blue-400',
  },
  {
    id: 'image',
    icon: Image,
    title: 'Image Generator',
    description: 'Create and replace images with AI',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'seo',
    icon: BarChart3,
    title: 'SEO Optimizer',
    description: 'Improve search engine rankings',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/15',
    iconColor: 'text-amber-400',
  },
];

export default function AIToolsSection({ onToolClick }) {
  return (
    <div className="border-t border-white/[0.04] px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Palette size={13} className="text-violet-400" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
          AI Tools
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onToolClick?.(tool.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative flex flex-col items-start gap-2.5 overflow-hidden rounded-2xl border ${tool.border} bg-gradient-to-br ${tool.gradient} p-3.5 text-left transition-all hover:shadow-lg`}
            >
              {/* Subtle glow on hover */}
              <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/[0.03] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] ${tool.iconColor} transition-transform group-hover:scale-110`}>
                <Icon size={17} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">{tool.title}</p>
                <p className="mt-0.5 text-[9px] font-medium text-slate-400 leading-tight">
                  {tool.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
