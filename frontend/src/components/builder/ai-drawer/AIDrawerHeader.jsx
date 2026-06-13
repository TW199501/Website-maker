import { motion } from 'framer-motion';
import { Sparkles, PanelRightClose, MessageSquarePlus } from 'lucide-react';

export default function AIDrawerHeader({ onCollapse, onNewChat }) {
  return (
    <div className="ai-drawer-header relative shrink-0 border-b border-white/[0.06] px-5 py-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-8 -top-4 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AI icon with animated gradient glow */}
          <motion.div
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 shadow-lg shadow-violet-500/30"
            animate={{ boxShadow: ['0 4px 20px rgba(139,92,246,0.3)', '0 4px 30px rgba(139,92,246,0.5)', '0 4px 20px rgba(139,92,246,0.3)'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Sparkles size={18} className="text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
          </motion.div>

          <div>
            <h2 className="text-[15px] font-extrabold tracking-tight text-white leading-none">
              AI Website Builder
            </h2>
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Build, edit, and improve your website using AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Status indicator */}
          <div className="mr-1 flex items-center gap-1.5">
            <motion.div
              className="h-2 w-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">Online</span>
          </div>

          {/* New chat button */}
          <button
            type="button"
            onClick={onNewChat}
            title="New conversation"
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-white/[0.06] hover:text-violet-400"
          >
            <MessageSquarePlus size={16} />
          </button>

          {/* Collapse button */}
          <button
            type="button"
            onClick={onCollapse}
            title="Close AI panel"
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-white/[0.06] hover:text-white"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
