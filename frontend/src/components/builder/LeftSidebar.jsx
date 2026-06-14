import * as LucideIcons from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { leftPanelTools } from '../../data/builderTools';

export default function LeftSidebar() {
  const { activeLeftTool, setActiveLeftTool, leftPanelCollapsed, setLeftPanelCollapsed } = useBuilderStore();

  const topTools = leftPanelTools.filter((t) => ['Creation', 'Motion'].includes(t.category));
  const bottomTools = leftPanelTools.filter((t) => ['Project'].includes(t.category));

  const handleToolClick = (toolId) => {
    if (activeLeftTool === toolId && !leftPanelCollapsed) {
      // Clicking the same active tool toggles the panel closed
      setLeftPanelCollapsed(true);
    } else {
      // Open or switch to the selected tool
      setActiveLeftTool(toolId);
      setLeftPanelCollapsed(false);
    }
  };

  const renderTool = (tool) => {
    const Icon = LucideIcons[tool.icon] || LucideIcons.Circle;
    const active = activeLeftTool === tool.id && !leftPanelCollapsed;
    return (
      <button
        key={tool.id}
        type="button"
        title={tool.name}
        onClick={() => handleToolClick(tool.id)}
        className={`group relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 hover-lift ${
          active 
            ? 'bg-indigo-500/10 text-indigo-400 shadow-inner border border-indigo-500/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
        }`}
      >
        {active && <div className="absolute left-[-8px] h-5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        
        {/* Sleek Tooltip */}
        <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-800 border border-slate-700/50 px-2.5 py-1.5 text-xs font-medium text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-[90]">
          {tool.name}
        </span>
        
        {tool.status !== 'working' && (
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-400 border border-slate-900" />
        )}
      </button>
    );
  };

  return (
    <aside className="w-[60px] bg-slate-950/80 backdrop-blur-md border-r border-white/[0.05] flex flex-col items-center py-4 shrink-0 z-50">
      {/* Top Tools Group */}
      <div className="flex flex-col items-center gap-1.5">
        {topTools.map(renderTool)}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Tools Group */}
      <div className="flex flex-col items-center gap-1.5">
        {/* Subtle divider */}
        <div className="w-6 h-[1px] bg-white/[0.05] mb-2 rounded-full" />
        {bottomTools.map(renderTool)}
      </div>
    </aside>
  );
}
