import { motion } from 'framer-motion';
import {
  MousePointerClick,
  Wand2,
  Palette,
  LayoutTemplate,
  RefreshCw,
  Image,
  Plus,
  TableProperties,
  Type,
} from 'lucide-react';

/* ─── action sets per section type ──────────────────── */

const SECTION_ACTIONS = {
  hero: [
    { label: 'Rewrite Content', icon: Wand2 },
    { label: 'Improve Design', icon: Palette },
    { label: 'Add CTA', icon: Plus },
    { label: 'Generate Background Image', icon: Image },
  ],
  pricing: [
    { label: 'Add Plans', icon: Plus },
    { label: 'Create Comparison Table', icon: TableProperties },
    { label: 'Improve Layout', icon: LayoutTemplate },
  ],
  navbar: [
    { label: 'Add Links', icon: Plus },
    { label: 'Change Style', icon: Palette },
    { label: 'Make Sticky', icon: RefreshCw },
  ],
  default: [
    { label: 'Rewrite Content', icon: Wand2 },
    { label: 'Improve Design', icon: Palette },
    { label: 'Change Layout', icon: LayoutTemplate },
    { label: 'Add Animation', icon: RefreshCw },
    { label: 'Generate Image', icon: Image },
  ],
};

function getActionsForType(type) {
  const normalized = (type || '').toLowerCase();
  return SECTION_ACTIONS[normalized] || SECTION_ACTIONS.default;
}

/* ─── component ─────────────────────────────────────── */

export default function AIContextSection({ selectedElement }) {
  if (!selectedElement) return null;

  const elementName = selectedElement.name || selectedElement.type || 'Element';
  const elementType = selectedElement.type || 'default';
  const actions = getActionsForType(elementType);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-white/[0.04] overflow-hidden"
    >
      <div className="px-5 py-4">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3">
          <MousePointerClick size={14} className="text-violet-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-300">
            Editing Selected
          </span>
        </div>

        {/* Selected element badge */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-500/20">
            <Type size={14} className="text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-violet-200 truncate">
              Selected Element
            </p>
            <p className="text-[11px] font-semibold text-violet-300/70 truncate capitalize">
              {elementName}
            </p>
          </div>
        </div>

        {/* Contextual actions */}
        <div className="space-y-1">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-violet-500/[0.08]"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 group-hover:bg-violet-500/20 group-hover:text-violet-400 group-hover:border-violet-500/20 transition-all">
                  <Icon size={13} />
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
