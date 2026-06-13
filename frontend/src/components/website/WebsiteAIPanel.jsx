import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  Rocket,
  Send,
  Settings2,
  Hammer,
  Pencil,
  Palette,
  Search,
  Zap,
  CheckCircle2,
  Undo2,
  MessageSquare,
  MousePointerClick,
  Image,
  FileText,
  Globe,
  Accessibility,
  BarChart3,
  Smartphone,
  BrainCircuit,
  Wand2,
  LayoutTemplate,
  RefreshCw,
  X,
} from 'lucide-react';

/* ─── data ──────────────────────────────────────────── */

const INDUSTRIES = [
  'Select Industry',
  'Fitness',
  'Restaurant',
  'E-commerce',
  'SaaS',
  'Agency',
  'Real Estate',
  'Healthcare',
  'Education',
  'Photography',
  'Portfolio',
  'Non-profit',
  'Other',
];

const WEBSITE_TYPES = [
  'Select Type',
  'Business',
  'Landing Page',
  'Portfolio',
  'Blog',
  'E-commerce',
  'SaaS',
  'Directory',
  'Membership',
];

const COLOR_PREFS = [
  'Auto',
  'Blue',
  'Purple',
  'Green',
  'Red',
  'Orange',
  'Pink',
  'Teal',
  'Dark',
  'Monochrome',
];

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Portuguese'];

const PRIMARY_GOALS = ['Generate Leads', 'Sell Products', 'Book Appointments', 'Showcase Portfolio', 'Inform & Educate'];

const BRAND_TONES = ['Professional', 'Premium', 'Modern', 'Minimal', 'Creative', 'Playful', 'Bold'];

const AI_MODES = [
  { id: 'build', label: 'Build', icon: Hammer, description: 'Create pages, sections, content' },
  { id: 'edit', label: 'Edit', icon: Pencil, description: 'Modify existing content' },
  { id: 'design', label: 'Design', icon: Palette, description: 'Colors, typography, spacing' },
  { id: 'seo', label: 'SEO', icon: Search, description: 'Metadata, headings, keywords' },
];

const DEFAULT_TOGGLES = {
  generateContent: true,
  generateImages: true,
  generateSEO: true,
  mobileOptimized: true,
  accessibilityOptimized: true,
  conversionFocused: true,
  fastLoading: true,
};

const TOGGLE_META = [
  { key: 'generateContent', label: 'Generate Content', icon: FileText },
  { key: 'generateImages', label: 'Generate Images', icon: Image },
  { key: 'generateSEO', label: 'SEO Ready', icon: Globe },
  { key: 'mobileOptimized', label: 'Mobile Optimized', icon: Smartphone },
  { key: 'accessibilityOptimized', label: 'Accessibility', icon: Accessibility },
  { key: 'conversionFocused', label: 'Conversion Focused', icon: BarChart3 },
  { key: 'fastLoading', label: 'Fast Loading', icon: Zap },
];

const CHAT_EXAMPLES = [
  'Add testimonials section',
  'Create pricing table',
  'Rewrite hero content',
  'Improve mobile layout',
  'Generate FAQ section',
];

const SELECTION_ACTIONS = [
  { label: 'Rewrite Content', icon: Wand2 },
  { label: 'Improve Design', icon: Palette },
  { label: 'Change Layout', icon: LayoutTemplate },
  { label: 'Add Animation', icon: RefreshCw },
  { label: 'Generate Image', icon: Image },
];

const SMART_SUGGESTIONS = [
  { label: 'Add Testimonials', icon: MessageSquare },
  { label: 'Add FAQ Section', icon: FileText },
  { label: 'Improve CTA', icon: Zap },
  { label: 'Optimize SEO', icon: Search },
];

/* ─── micro-components ──────────────────────────────── */

function SectionDivider() {
  return <div className="mx-1 my-1 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />;
}

function SectionHeader({ icon: Icon, title, badge, children, collapsible = false, open, onToggle }) {
  const inner = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-indigo-400" />}
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-300">{title}</span>
        {badge && (
          <span className="ml-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-300">
            {badge}
          </span>
        )}
      </div>
      {collapsible && (
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-500" />
        </motion.div>
      )}
      {children}
    </div>
  );

  if (collapsible) {
    return (
      <button type="button" onClick={onToggle} className="w-full px-4 py-3 text-left hover:bg-white/[0.02] transition-colors rounded-xl">
        {inner}
      </button>
    );
  }

  return <div className="px-4 py-3">{inner}</div>;
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 pr-8 text-xs font-semibold text-slate-200 outline-none transition focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 hover:border-slate-600"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
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
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 hover:border-slate-600"
      />
    </label>
  );
}

function RadioGroup({ label, options, value, onChange }) {
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
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                : 'bg-slate-800/40 text-slate-500 border border-transparent hover:bg-slate-800/80 hover:text-slate-300'
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
      className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.03] group"
    >
      <div
        className={`relative h-[18px] w-[32px] rounded-full transition-colors duration-200 ${
          checked ? 'bg-indigo-500' : 'bg-slate-700'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 14 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-[3px] h-3 w-3 rounded-full bg-white shadow-sm"
        />
      </div>
      {Icon && <Icon size={13} className={`transition-colors ${checked ? 'text-indigo-400' : 'text-slate-600'}`} />}
      <span className={`text-[11px] font-semibold transition-colors ${checked ? 'text-slate-200' : 'text-slate-500'}`}>
        {label}
      </span>
    </button>
  );
}

/* ─── main panel ────────────────────────────────────── */

export default function WebsiteAIPanel({ selectedElement = null, onGenerate }) {
  /* prompt */
  const [prompt, setPrompt] = useState('');
  const promptRef = useRef(null);

  /* website details */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [websiteType, setWebsiteType] = useState(WEBSITE_TYPES[0]);
  const [targetAudience, setTargetAudience] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState(PRIMARY_GOALS[0]);
  const [brandTone, setBrandTone] = useState(BRAND_TONES[2]);
  const [colorPref, setColorPref] = useState(COLOR_PREFS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  /* additional instructions */
  const [extraInstructions, setExtraInstructions] = useState('');

  /* toggles */
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const setToggle = (key, val) => setToggles((p) => ({ ...p, [key]: val }));

  /* AI mode */
  const [aiMode, setAiMode] = useState('build');

  /* chat */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null);

  /* recent actions */
  const [recentActions, setRecentActions] = useState([
    { id: 1, text: 'Panel initialized', time: 'Just now' },
  ]);

  /* generating state */
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* handlers */
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const payload = {
      prompt,
      businessName,
      industry,
      websiteType,
      targetAudience,
      primaryGoal,
      brandTone,
      colorPref,
      language,
      extraInstructions,
      toggles,
      aiMode,
    };
    console.log('[ShopCraft AI] Generate payload:', payload);
    onGenerate?.(payload);

    setRecentActions((prev) => [
      { id: Date.now(), text: `Generated: "${prompt.slice(0, 40)}${prompt.length > 40 ? '…' : ''}"`, time: 'Just now' },
      ...prev.slice(0, 9),
    ]);

    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: chatInput },
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: `I'll help you "${chatInput}". This feature will connect to the AI engine soon.`,
      },
    ]);
    setRecentActions((prev) => [
      { id: Date.now(), text: `Chat: "${chatInput.slice(0, 30)}…"`, time: 'Just now' },
      ...prev.slice(0, 9),
    ]);
    setChatInput('');
  };

  return (
    <div className="ai-panel flex h-full flex-col overflow-hidden">
      {/* ── scrollable body ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* ── header ── */}
        <div className="relative px-4 pt-5 pb-2">
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2.5 relative">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white leading-none">AI Website Builder</h2>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500">Build, edit & improve with AI</p>
            </div>
          </div>
        </div>

        {/* ── AI Mode selector ── */}
        <div className="px-4 pt-2 pb-1">
          <div className="flex rounded-xl bg-slate-800/50 border border-slate-700/40 p-1">
            {AI_MODES.map((mode) => {
              const Icon = mode.icon;
              const active = aiMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setAiMode(mode.id)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    active
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="ai-mode-bg"
                      className="absolute inset-0 rounded-lg bg-indigo-500/20 border border-indigo-500/30"
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
            {AI_MODES.find((m) => m.id === aiMode)?.description}
          </p>
        </div>

        <SectionDivider />

        {/* ── prompt input ── */}
        <div className="px-4 py-3">
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build…"
            rows={4}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            className="w-full resize-none rounded-2xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-[13px] font-medium text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/10 leading-relaxed"
          />
          <p className="mt-1 text-[9px] font-medium text-slate-600 text-right">Ctrl + Enter to generate</p>
        </div>

        {/* ── website details (collapsible) ── */}
        <SectionHeader
          icon={Settings2}
          title="Website Details"
          collapsible
          open={detailsOpen}
          onToggle={() => setDetailsOpen((p) => !p)}
        />
        <AnimatePresence>
          {detailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3.5 px-4 pb-4">
                <InputField label="Business Name" value={businessName} onChange={setBusinessName} placeholder="e.g. FitZone Studio" />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Industry" value={industry} onChange={setIndustry} options={INDUSTRIES} />
                  <SelectField label="Website Type" value={websiteType} onChange={setWebsiteType} options={WEBSITE_TYPES} />
                </div>
                <InputField label="Target Audience" value={targetAudience} onChange={setTargetAudience} placeholder="e.g. Young professionals 25-40" />
                <RadioGroup label="Primary Goal" options={PRIMARY_GOALS} value={primaryGoal} onChange={setPrimaryGoal} />
                <RadioGroup label="Brand Tone" options={BRAND_TONES} value={brandTone} onChange={setBrandTone} />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Color Preference" value={colorPref} onChange={setColorPref} options={COLOR_PREFS} />
                  <SelectField label="Language" value={language} onChange={setLanguage} options={LANGUAGES} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SectionDivider />

        {/* ── additional instructions ── */}
        <div className="px-4 py-3">
          <SectionHeader icon={Sparkles} title="Additional Instructions" />
          <textarea
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder="e.g. Use dark theme, add animations, luxury design…"
            rows={2}
            className="mt-1 w-full resize-none rounded-xl border border-slate-700/50 bg-slate-800/30 px-3 py-2.5 text-xs font-medium text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/15 leading-relaxed"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['Dark theme', 'Animations', 'Mobile-first', 'Luxury style', 'Conversions'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setExtraInstructions((p) => (p ? `${p}, ${tag}` : tag))}
                className="rounded-lg bg-slate-800/50 border border-slate-700/40 px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 transition-all"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* ── generation settings toggles ── */}
        <div className="px-2 py-2">
          <SectionHeader icon={Settings2} title="Generation Settings" />
          <div className="mt-1 space-y-0.5">
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
        </div>

        <SectionDivider />

        {/* ── generate button ── */}
        <div className="px-4 py-4">
          <motion.button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative w-full overflow-hidden rounded-2xl py-4 text-sm font-black uppercase tracking-[0.18em] transition-all shadow-xl ${
              prompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            {/* shimmer */}
            {prompt.trim() && !isGenerating && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
            <span className="relative flex items-center justify-center gap-2.5">
              {isGenerating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <BrainCircuit size={18} />
                  </motion.div>
                  Generating…
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  Generate Website
                </>
              )}
            </span>
          </motion.button>
        </div>

        <SectionDivider />

        {/* ── current selection ── */}
        {selectedElement && (
          <>
            <div className="px-4 py-3">
              <SectionHeader icon={MousePointerClick} title="Current Selection" />
              <div className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] px-3 py-2.5">
                <p className="text-xs font-bold text-indigo-200">{selectedElement}</p>
              </div>
              <div className="mt-3 space-y-1">
                {SELECTION_ACTIONS.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.label}
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-indigo-500/10 hover:text-indigo-300"
                    >
                      <Icon size={14} className="text-indigo-400/60" />
                      {act.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <SectionDivider />
          </>
        )}

        {/* ── smart suggestions ── */}
        <div className="px-4 py-3">
          <SectionHeader icon={Zap} title="Recommended" badge="AI" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SMART_SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.label}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-start gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/30 p-3 text-left transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] group"
                >
                  <Icon size={14} className="text-amber-400/70 group-hover:text-amber-400 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
                    {s.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <SectionDivider />

        {/* ── recent actions ── */}
        <div className="px-4 py-3">
          <SectionHeader icon={CheckCircle2} title="Recent Actions" />
          <div className="mt-2 space-y-1">
            {recentActions.slice(0, 5).map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 group hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 size={12} className="shrink-0 text-emerald-400/60" />
                  <span className="truncate text-[11px] font-medium text-slate-400">{action.text}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-[9px] font-medium text-slate-600">{action.time}</span>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-amber-400"
                    title="Undo"
                  >
                    <Undo2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom spacer for chat */}
        <div className="h-4" />
      </div>

      {/* ── AI chat (sticky bottom) ── */}
      <div className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm shrink-0">
        <button
          type="button"
          onClick={() => setChatOpen((p) => !p)}
          className="flex w-full items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-indigo-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-300">AI Assistant</span>
          </div>
          <motion.div animate={{ rotate: chatOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-slate-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 260 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex h-[260px] flex-col">
                {/* messages */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <BrainCircuit size={24} className="text-slate-700" />
                      <p className="text-[10px] font-medium text-slate-600 text-center">Ask AI anything about your website</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1">
                        {CHAT_EXAMPLES.slice(0, 3).map((ex) => (
                          <button
                            key={ex}
                            type="button"
                            onClick={() => setChatInput(ex)}
                            className="rounded-lg bg-slate-800/50 border border-slate-700/40 px-2 py-1 text-[9px] font-semibold text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 transition-all"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-xl px-3 py-2 text-xs font-medium leading-relaxed ${
                        msg.role === 'user'
                          ? 'ml-4 bg-indigo-500/15 text-indigo-200 border border-indigo-500/20'
                          : 'mr-4 bg-slate-800/60 text-slate-300 border border-slate-700/30'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* input */}
                <div className="border-t border-slate-700/40 px-3 py-2.5 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleChatSend();
                    }}
                    placeholder="Ask AI anything…"
                    className="flex-1 rounded-xl bg-slate-800/40 border border-slate-700/40 px-3 py-2 text-xs font-medium text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500/50 transition"
                  />
                  <motion.button
                    type="button"
                    onClick={handleChatSend}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors shrink-0"
                  >
                    <Send size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
