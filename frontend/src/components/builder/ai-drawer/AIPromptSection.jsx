import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Paperclip,
  ChevronDown,
  Settings2,
  FileText,
  Image,
  Globe,
  Smartphone,
  Accessibility,
  BarChart3,
  Zap,
} from 'lucide-react';

/* ─── data ──────────────────────────────────────────── */

const INDUSTRIES = [
  'Select Industry', 'Fitness', 'Restaurant', 'E-commerce', 'SaaS',
  'Agency', 'Real Estate', 'Healthcare', 'Education', 'Photography', 'Portfolio', 'Non-profit',
];

const WEBSITE_TYPES = [
  'Select Type', 'Business', 'Landing Page', 'Portfolio', 'Blog',
  'E-commerce', 'SaaS', 'Directory', 'Membership',
];

const COLOR_PREFS = [
  'Auto', 'Blue', 'Purple', 'Green', 'Red', 'Orange', 'Pink', 'Teal', 'Dark', 'Monochrome',
];

const BRAND_STYLES = [
  'Modern', 'Professional', 'Premium', 'Minimal', 'Creative', 'Playful', 'Bold', 'Elegant',
];

const TOGGLE_META = [
  { key: 'generateContent', label: 'Generate Content', icon: FileText },
  { key: 'generateImages', label: 'Generate Images', icon: Image },
  { key: 'seoOptimized', label: 'SEO Optimized', icon: Globe },
  { key: 'mobileResponsive', label: 'Mobile Responsive', icon: Smartphone },
  { key: 'accessibility', label: 'Accessibility Ready', icon: Accessibility },
  { key: 'fastLoading', label: 'Fast Loading', icon: Zap },
];

const DEFAULT_TOGGLES = {
  generateContent: true,
  generateImages: true,
  seoOptimized: true,
  mobileResponsive: true,
  accessibility: true,
  fastLoading: true,
};

const PLACEHOLDERS = [
  'Create a modern fitness website',
  'Build a SaaS landing page',
  'Generate an online store',
  'Design a portfolio with dark theme',
  'Create a restaurant booking site',
];

/* ─── sub-components ────────────────────────────────── */

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 pr-8 text-xs font-semibold text-slate-200 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 hover:border-white/[0.12]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      </div>
    </label>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 hover:border-white/[0.12]"
      />
    </label>
  );
}

function ChipSelect({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold tracking-wide transition-all ${
              value === opt
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10'
                : 'bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.03] group"
    >
      <div
        className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-violet-500' : 'bg-slate-700'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 14 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-[3px] h-3 w-3 rounded-full bg-white shadow-sm"
        />
      </div>
      {Icon && <Icon size={13} className={`transition-colors ${checked ? 'text-violet-400' : 'text-slate-600'}`} />}
      <span className={`text-[11px] font-semibold transition-colors ${checked ? 'text-slate-200' : 'text-slate-500'}`}>
        {label}
      </span>
    </button>
  );
}

/* ─── main component ────────────────────────────────── */

export default function AIPromptSection({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [configOpen, setConfigOpen] = useState(false);
  const [togglesOpen, setTogglesOpen] = useState(false);

  // Config fields
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [websiteType, setWebsiteType] = useState(WEBSITE_TYPES[0]);
  const [targetAudience, setTargetAudience] = useState('');
  const [brandStyle, setBrandStyle] = useState(BRAND_STYLES[0]);
  const [colorPref, setColorPref] = useState(COLOR_PREFS[0]);

  // Toggles
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const setToggle = (key, val) => setToggles((p) => ({ ...p, [key]: val }));

  // Rotate placeholder
  const cyclePlaceholder = () => {
    setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate?.({
      prompt,
      businessName,
      industry,
      websiteType,
      targetAudience,
      brandStyle,
      colorPref,
      toggles,
    });
  };

  return (
    <div className="space-y-0">
      {/* ── Hero Prompt ── */}
      <div className="px-5 pt-5 pb-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={cyclePlaceholder}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            className="ai-prompt-textarea w-full resize-none rounded-2xl border border-violet-500/20 bg-white/[0.03] px-4 py-3.5 pr-24 text-[13px] font-medium text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(139,92,246,0.12)] leading-relaxed"
          />
          {/* Input action buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              title="Voice input"
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
            >
              <Mic size={14} />
            </button>
            <button
              type="button"
              title="Attach file"
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
            >
              <Paperclip size={14} />
            </button>
          </div>
        </div>
        <p className="mt-1.5 text-right text-[9px] font-medium text-slate-600">
          ⌘ + Enter to generate
        </p>
      </div>

      {/* ── Website Configuration (collapsible) ── */}
      <div className="border-t border-white/[0.04]">
        <button
          type="button"
          onClick={() => setConfigOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-violet-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-300">
              Website Configuration
            </span>
          </div>
          <motion.div animate={{ rotate: configOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-slate-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {configOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3.5 px-5 pb-5">
                <InputField label="Business Name" value={businessName} onChange={setBusinessName} placeholder="e.g. FitZone Studio" />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Industry" value={industry} onChange={setIndustry} options={INDUSTRIES} />
                  <SelectField label="Website Type" value={websiteType} onChange={setWebsiteType} options={WEBSITE_TYPES} />
                </div>
                <InputField label="Target Audience" value={targetAudience} onChange={setTargetAudience} placeholder="e.g. Young professionals 25-40" />
                <ChipSelect label="Brand Style" options={BRAND_STYLES} value={brandStyle} onChange={setBrandStyle} />
                <SelectField label="Color Preference" value={colorPref} onChange={setColorPref} options={COLOR_PREFS} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Generation Options (collapsible) ── */}
      <div className="border-t border-white/[0.04]">
        <button
          type="button"
          onClick={() => setTogglesOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-300">
              AI Generation Options
            </span>
          </div>
          <motion.div animate={{ rotate: togglesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-slate-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {togglesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-4 space-y-0.5">
                {TOGGLE_META.map((t) => (
                  <ToggleSwitch
                    key={t.key}
                    checked={toggles[t.key]}
                    onChange={(v) => setToggle(t.key, v)}
                    label={t.label}
                    icon={t.icon}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Generate CTA ── */}
      <div className="border-t border-white/[0.04] px-5 py-4">
        <motion.button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative w-full overflow-hidden rounded-2xl py-4 text-sm font-black uppercase tracking-[0.18em] transition-all shadow-xl ${
            prompt.trim()
              ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-violet-500/30 hover:shadow-violet-500/50'
              : 'bg-slate-800/60 text-slate-600 cursor-not-allowed shadow-none'
          }`}
        >
          {/* Shimmer effect */}
          {prompt.trim() && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          )}
          <span className="relative flex items-center justify-center gap-2.5">
            <BarChart3 size={18} />
            Generate Website
          </span>
        </motion.button>
      </div>
    </div>
  );
}
