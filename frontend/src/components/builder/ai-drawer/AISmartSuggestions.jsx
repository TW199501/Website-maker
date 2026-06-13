import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  MessageSquare,
  FileText,
  Search,
  BookOpen,
  Layout,
  ShoppingCart,
  CalendarCheck,
} from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Make design premium', icon: Sparkles },
  { label: 'Improve mobile layout', icon: Layout },
  { label: 'Add testimonials', icon: MessageSquare },
  { label: 'Generate FAQ', icon: FileText },
  { label: 'Improve conversions', icon: Zap },
  { label: 'Add booking system', icon: CalendarCheck },
  { label: 'Optimize SEO', icon: Search },
  { label: 'Create contact section', icon: BookOpen },
  { label: 'Add shopping cart', icon: ShoppingCart },
];

export default function AISmartSuggestions({ onSuggestionClick }) {
  const scrollRef = useRef(null);

  return (
    <div className="border-t border-white/[0.04] py-3">
      <div className="flex items-center gap-2 px-5 mb-2.5">
        <Zap size={13} className="text-amber-400" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
          Smart Suggestions
        </span>
        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">
          AI
        </span>
      </div>

      {/* Horizontal scrollable chips */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SUGGESTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSuggestionClick?.(s.label)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[10px] font-semibold text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-violet-300"
            >
              <Icon size={11} />
              {s.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
