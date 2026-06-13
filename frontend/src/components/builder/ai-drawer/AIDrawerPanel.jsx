import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIDrawerHeader from './AIDrawerHeader';
import AIModeSelector from './AIModeSelector';
import AIPromptSection from './AIPromptSection';
import AIChatArea from './AIChatArea';
import AIContextSection from './AIContextSection';
import AISmartSuggestions from './AISmartSuggestions';
import AIToolsSection from './AIToolsSection';
import AIBottomInput from './AIBottomInput';

/* ─── defaults ──────────────────────────────────────── */

const MIN_WIDTH = 380;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 440;

const GENERATED_SECTIONS = [
  'Hero Section',
  'About Section',
  'Services Section',
  'Pricing Section',
  'Testimonials',
  'FAQ',
  'Contact',
];

/* ─── main AI drawer ───────────────────────────────── */

export default function AIDrawerPanel({ isOpen, onClose, selectedElement = null }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [aiMode, setAiMode] = useState('build');
  const [view, setView] = useState('prompt'); // 'prompt' | 'chat'
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const resizeRef = useRef(null);

  /* ── resize handling ── */
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (me) => {
      const delta = startX - me.clientX;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + delta));
      setWidth(newWidth);
    };

    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [width]);

  /* ── auto-switch to editing mode when element is selected ── */
  useEffect(() => {
    if (selectedElement) {
      setAiMode('edit');
    }
  }, [selectedElement]);

  /* ── send a chat message ── */
  const handleSend = useCallback((text) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setView('chat');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const isGenerateRequest = text.toLowerCase().includes('create') || text.toLowerCase().includes('generate') || text.toLowerCase().includes('build');
      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: isGenerateRequest
          ? `I'll create that for you. Here's the website structure I've generated based on your description.`
          : `I'll help you with "${text}". Let me analyze your current website and suggest improvements.`,
        timestamp: Date.now(),
        ...(isGenerateRequest ? { sections: GENERATED_SECTIONS } : {}),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  }, []);

  /* ── handle generation from prompt section ── */
  const handleGenerate = useCallback((payload) => {
    handleSend(payload.prompt);
  }, [handleSend]);

  /* ── new chat ── */
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setView('prompt');
    setIsTyping(false);
  }, []);

  /* ── suggestion click ── */
  const handleSuggestionClick = useCallback((label) => {
    handleSend(label);
  }, [handleSend]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="ai-drawer relative flex h-full shrink-0 overflow-hidden border-l border-white/[0.06]"
          style={{ width }}
        >
          {/* ── Resize handle ── */}
          <div
            ref={resizeRef}
            onMouseDown={handleResizeStart}
            className={`absolute left-0 top-0 z-30 h-full w-1.5 cursor-col-resize transition-colors ${
              isResizing ? 'bg-violet-500/60' : 'bg-transparent hover:bg-violet-500/30'
            }`}
          />

          {/* ── Panel background ── */}
          <div className="ai-drawer-bg absolute inset-0 bg-[#0c0c18]">
            {/* Subtle gradient mesh */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-900/[0.06] via-transparent to-indigo-900/[0.04]" />
            <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-600/[0.04] blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-600/[0.03] blur-[80px]" />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10 flex h-full w-full flex-col">
            {/* Header */}
            <AIDrawerHeader onCollapse={onClose} onNewChat={handleNewChat} />

            {/* Mode selector */}
            <AIModeSelector value={aiMode} onChange={setAiMode} />

            {/* Scrollable content area */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {view === 'prompt' ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar ai-panel">
                  {/* Prompt & config */}
                  <AIPromptSection onGenerate={handleGenerate} />

                  {/* Context-aware section (when element selected) */}
                  <AnimatePresence>
                    {selectedElement && <AIContextSection selectedElement={selectedElement} />}
                  </AnimatePresence>

                  {/* Smart suggestions */}
                  <AISmartSuggestions onSuggestionClick={handleSuggestionClick} />

                  {/* AI Tools */}
                  <AIToolsSection onToolClick={(id) => console.log('Tool clicked:', id)} />

                  {/* Bottom spacer */}
                  <div className="h-4" />
                </div>
              ) : (
                /* Chat view */
                <AIChatArea
                  messages={messages}
                  isTyping={isTyping}
                  onSuggestionClick={handleSuggestionClick}
                />
              )}
            </div>

            {/* Sticky bottom input */}
            <AIBottomInput onSend={handleSend} selectedElement={selectedElement} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
