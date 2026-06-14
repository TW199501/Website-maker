import {
  AlignCenter,
  Bold,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  Maximize2,
  MoreHorizontal,
  Paintbrush,
  Trash2,
  Unlock,
  ArrowUpToLine,
  ArrowDownToLine,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const ToolButton = ({ title, onClick, children, tone = 'default' }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onPointerDown={(event) => {
      event.stopPropagation();
      event.preventDefault();
      onClick?.(event);
    }}
    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 transition-all hover-lift ${
      tone === 'danger' ? 'text-red-300 hover:bg-red-500/20 hover:text-red-100' : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export default function FloatingToolbar({ nodeId }) {
  const {
    nodesMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    lockNodeInMap,
    hideNodeInMap,
    bringToFrontInMap,
    sendToBackInMap,
    updateNodeStylesInMap,
    updateNodePropsInMap,
    showToast,
  } = useBuilderStore();

  const node = nodesMap[nodeId];
  if (!node) return null;

  const isText = ['heading', 'paragraph', 'button', 'card', 'testimonialCard', 'pricingCard', 'productCard'].includes(node.type);
  const isImage = ['image', 'video', 'gallery'].includes(node.type);
  const isButton = node.type === 'button';

  return (
    <div
      data-builder-toolbar
      className="absolute left-1/2 top-0 z-40 flex -translate-x-1/2 -translate-y-[calc(100%+12px)] items-center gap-0.5 rounded-full border border-white/10 bg-slate-900/80 p-1 text-white shadow-soft backdrop-blur-xl ring-1 ring-white/5"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      style={{ fontSize: '14px', lineHeight: '1' }} // Prevent inheritance of giant canvas font sizes
    >
      <div className="flex h-8 min-w-8 items-center justify-center px-1 text-slate-400 cursor-grab active:cursor-grabbing hover:text-white transition-colors">
        <GripVertical size={15} />
      </div>
      <ToolButton title="Bring forward" onClick={() => bringToFrontInMap(nodeId)}><ArrowUpToLine size={14} /></ToolButton>
      <ToolButton title="Send backward" onClick={() => sendToBackInMap(nodeId)}><ArrowDownToLine size={14} /></ToolButton>
      <ToolButton title="Duplicate" onClick={() => duplicateNodeInMap(nodeId)}>
        <Copy size={14} />
      </ToolButton>
      <ToolButton title={node.locked ? 'Unlock' : 'Lock'} onClick={() => lockNodeInMap(nodeId)}>
        {node.locked ? <Unlock size={14} /> : <Lock size={14} />}
      </ToolButton>
      <ToolButton title={node.hidden ? 'Show' : 'Hide'} onClick={() => hideNodeInMap(nodeId)}>
        {node.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
      </ToolButton>

      {isText && (
        <>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ToolButton title="Bold" onClick={() => updateNodeStylesInMap(nodeId, { fontWeight: node.styles?.fontWeight === '800' ? '500' : '800' })}>
            <Bold size={14} />
          </ToolButton>
          <ToolButton title="Align center" onClick={() => updateNodeStylesInMap(nodeId, { textAlign: node.styles?.textAlign === 'center' ? 'left' : 'center' })}>
            <AlignCenter size={14} />
          </ToolButton>
          <ToolButton title="Increase font size" onClick={() => updateNodeStylesInMap(nodeId, { fontSize: `${Math.min(96, Number.parseInt(node.styles?.fontSize || '18', 10) + 2)}px` })}>
            <span className="font-sans text-[13px] font-black tracking-tighter">T+</span>
          </ToolButton>
        </>
      )}

      {isImage && (
        <>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ToolButton title="Fit image" onClick={() => updateNodePropsInMap(nodeId, { objectFit: node.props?.objectFit === 'contain' ? 'cover' : 'contain' })}>
            <Maximize2 size={14} />
          </ToolButton>
        </>
      )}

      {isButton && (
        <>
          <span className="mx-1 h-5 w-px bg-white/10" />
          <ToolButton title="Button style" onClick={() => updateNodePropsInMap(nodeId, { variant: node.props?.variant === 'outline' ? 'solid' : 'outline' })}>
            <Paintbrush size={14} />
          </ToolButton>
        </>
      )}

      <span className="mx-1 h-5 w-px bg-white/10" />
      <ToolButton title="Delete" tone="danger" onClick={() => deleteNodeFromMap(nodeId)}>
        <Trash2 size={14} />
      </ToolButton>
      <ToolButton title={`Node options`} onClick={() => showToast(`Options are available in the right properties panel.`)}>
        <MoreHorizontal size={14} />
      </ToolButton>
    </div>
  );
}
