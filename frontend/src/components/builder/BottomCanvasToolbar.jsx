import { Undo2, Redo2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import ZoomControls from './ZoomControls';

export default function BottomCanvasToolbar() {
  const { history, future, undo, redo } = useBuilderStore();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 shadow-soft backdrop-blur-xl">

        <ZoomControls />

        <div className="hidden h-6 w-px bg-white/10 sm:block" />

        <div className="flex items-center p-1">
          <button
            type="button"
            title="Undo (Ctrl + Z)"
            aria-label="Undo"
            onClick={undo}
            disabled={!history.length}
            className="flex h-8 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-white/10 hover:text-white hover-lift disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            title="Redo (Ctrl + Y)"
            aria-label="Redo"
            onClick={redo}
            disabled={!future.length}
            className="flex h-8 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-white/10 hover:text-white hover-lift disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            <Redo2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
