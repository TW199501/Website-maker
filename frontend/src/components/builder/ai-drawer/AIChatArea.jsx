import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';

/* ─── helpers ───────────────────────────────────────── */

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date);
}

/* ─── chat bubbles ──────────────────────────────────── */

function UserBubble({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-violet-600/90 to-indigo-600/90 px-4 py-3 text-[13px] font-medium leading-relaxed text-white shadow-lg shadow-violet-500/10 border border-violet-500/20">
          {message.text}
        </div>
        <p className="mt-1 text-right text-[9px] font-medium text-slate-600">
          {formatTime(new Date(message.timestamp))}
        </p>
      </div>
    </motion.div>
  );
}

function AIBubble({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5"
    >
      {/* AI avatar */}
      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20">
        <Sparkles size={13} className="text-violet-400" />
      </div>

      <div className="max-w-[85%] space-y-2">
        {/* Text response */}
        <div className="rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-300 shadow-sm">
          {message.text}
        </div>

        {/* Generated sections card */}
        {message.sections && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-violet-400" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                  Generated Website
                </span>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-violet-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-400 transition hover:bg-violet-500/20"
              >
                <Eye size={10} />
                Preview
              </button>
            </div>
            <div className="p-3 space-y-1">
              {message.sections.map((section, i) => (
                <motion.button
                  key={section}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all hover:bg-violet-500/[0.06]"
                >
                  <Check size={13} className="text-emerald-400" />
                  <span className="flex-1 text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                    {section}
                  </span>
                  <ChevronRight size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <p className="text-[9px] font-medium text-slate-600">
          {formatTime(new Date(message.timestamp))}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── typing indicator ──────────────────────────────── */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2.5"
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20">
        <Sparkles size={13} className="text-violet-400" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-violet-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── empty state ───────────────────────────────────── */

function EmptyChat({ onSuggestionClick }) {
  const suggestions = [
    'Create a modern fitness website',
    'Build a SaaS landing page',
    'Design a portfolio site',
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <motion.div
        className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/10"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <Sparkles size={24} className="text-violet-400/70" />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-300">Start a conversation</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Describe your website or ask AI to improve it
        </p>
      </div>
      <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggestionClick(s)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[11px] font-semibold text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-violet-300 text-left"
          >
            &quot;{s}&quot;
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────── */

export default function AIChatArea({ messages = [], isTyping = false, onSuggestionClick }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return <EmptyChat onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          msg.role === 'user'
            ? <UserBubble key={msg.id} message={msg} />
            : <AIBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isTyping && <TypingIndicator />}
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  );
}
