import { useState } from 'react';
import { X } from 'lucide-react';

export function PreviewModal({ html, onClose }) {
  if (!html) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 p-4 sm:p-6">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Live Website Preview</h2>
            <p className="mt-1 text-xs text-slate-500">Static export render</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
            aria-label="Close preview"
            title="Close preview"
          >
            <X size={18} />
          </button>
        </div>
        <iframe
          title="Website Preview"
          srcDoc={html}
          className="min-h-0 flex-1 border-0"
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}

// The floating export buttons have been removed from the workspace.
// Export actions are now only available through the top bar "More" menu.
// This default export is kept for backward compatibility but renders nothing.
export default function ExportPanel() {
  return null;
}
