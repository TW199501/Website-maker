import {
  BoxSelect,
  Hand,
  MousePointer2,
  Rows3,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const canvasTools = [
  { id: 'select', label: 'Select', shortcut: 'V', icon: MousePointer2 },
  { id: 'hand', label: 'Hand Tool', shortcut: 'H', icon: Hand },
];

const elementTools = [
  { id: 'section', label: 'Section', shortcut: 'S', icon: Rows3 },
  { id: 'container', label: 'Container', shortcut: 'R', icon: BoxSelect },
];

export default function ToolBar() {
  const { activeTool, setActiveTool, showToast } = useBuilderStore();

  const activateTool = (tool) => {
    if (tool.id === 'comment') {
      showToast('Comments are ready as a placeholder for collaborator notes.');
    }
    setActiveTool(tool.id);
  };

  const renderToolButton = (tool) => {
    const Icon = tool.icon;
    const active = activeTool === tool.id;
    return (
      <button
        key={tool.id}
        type="button"
        title={`${tool.label} (${tool.shortcut})`}
        aria-label={`${tool.label} tool`}
        onClick={() => activateTool(tool)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={15} />
      </button>
    );
  };

  return (
    <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1">
      {canvasTools.map(renderToolButton)}
      <div className="mx-0.5 h-5 w-px bg-slate-800" />
      {elementTools.map(renderToolButton)}
    </div>
  );
}
