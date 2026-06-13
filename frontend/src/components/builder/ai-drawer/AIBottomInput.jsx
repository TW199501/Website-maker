import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mic,
  Paperclip,
  AtSign,
} from 'lucide-react';

export default function AIBottomInput({ onSend, selectedElement }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput('');
  };

  const placeholder = selectedElement
    ? `Ask AI about "${selectedElement.name || selectedElement.type}"…`
    : 'Ask AI to improve your website…';

  return (
    <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0a14]/90 backdrop-blur-xl px-4 py-3">
      <div className="flex items-end gap-2">
        {/* Action buttons */}
        <div className="flex items-center gap-1 pb-0.5">
          <button
            type="button"
            title="Attach image"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
          >
            <Paperclip size={15} />
          </button>
          {selectedElement && (
            <button
              type="button"
              title="Mention selected element"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
            >
              <AtSign size={15} />
            </button>
          )}
        </div>

        {/* Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 pr-20 text-[13px] font-medium text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-violet-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              title="Voice input"
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition hover:text-violet-400"
            >
              <Mic size={14} />
            </button>
            <motion.button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`grid h-8 w-8 place-items-center rounded-xl transition-all ${
                input.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/30'
                  : 'bg-white/[0.04] text-slate-600'
              }`}
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
