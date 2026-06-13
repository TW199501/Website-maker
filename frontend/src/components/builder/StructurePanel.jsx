import { memo, useCallback, useMemo, useState } from 'react';
import {
  Box,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Image,
  Layers,
  LayoutPanelTop,
  Lock,
  MoreHorizontal,
  MousePointerClick,
  PanelTop,
  Plus,
  Search,
  Settings,
  Square,
  Star,
  Trash2,
  Type,
  Unlock,
} from 'lucide-react';
import { DndContext, PointerSensor, closestCenter, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '../../store/builderStore';
import { CONTAINER_NODE_TYPES, NODE_TYPES } from '../../data/nodeSchema';

const SECTION_TYPE_OPTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'contact', label: 'Contact' },
  { value: 'footer', label: 'Footer' },
  { value: 'custom', label: 'Custom' },
];

const dndId = (kind, id) => `${kind}:${id}`;
const sectionDropId = (sectionId) => `section-drop:${sectionId}`;

const labelForType = (value = '') =>
  String(value || 'element')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const escapeAttr = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const focusCanvasNode = (nodeId) => {
  if (typeof window === 'undefined') return;
  window.setTimeout(() => {
    const element = document.querySelector(`[data-node-id="${escapeAttr(nodeId)}"]`);
    element?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, 80);
};

const getSectionType = (node) => {
  if (!node) return 'custom';
  if (node.type === NODE_TYPES.FOOTER) return 'footer';
  const explicit = node.props?.sectionType || node.sectionType;
  if (explicit) return explicit;
  const label = `${node.name || ''} ${node.type || ''}`.toLowerCase();
  return SECTION_TYPE_OPTIONS.find((option) => label.includes(option.value))?.value || 'custom';
};

const isRootSection = (node, pageIds) => Boolean(node?.parentId && pageIds.has(node.parentId));

const renderNodeIcon = (node, kind) => {
  if (kind === 'page' || node?.type === NODE_TYPES.PAGE) return <FileText size={14} />;
  if (node?.type === NODE_TYPES.NAVBAR) return <PanelTop size={14} />;
  if (node?.type === NODE_TYPES.FOOTER || node?.type === NODE_TYPES.SECTION) return <LayoutPanelTop size={14} />;
  if (node?.type === NODE_TYPES.HEADING || node?.type === NODE_TYPES.PARAGRAPH) return <Type size={14} />;
  if (node?.type === NODE_TYPES.BUTTON) return <MousePointerClick size={14} />;
  if (node?.type === NODE_TYPES.IMAGE || node?.type === NODE_TYPES.GALLERY) return <Image size={14} />;
  if (node?.type === NODE_TYPES.CARD || node?.type?.toLowerCase().includes('card')) return <Box size={14} />;
  if (CONTAINER_NODE_TYPES.has(node?.type)) return <Square size={14} />;
  return <Layers size={14} />;
};

const hasMatch = (node, nodesMap, term, page) => {
  if (!term) return true;
  const haystack = [
    page?.name,
    page?.slug,
    node?.name,
    node?.type,
    node?.props?.sectionType,
    node?.content,
  ].join(' ').toLowerCase();
  if (haystack.includes(term)) return true;
  return (node?.children || []).some((childId) => hasMatch(nodesMap[childId], nodesMap, term));
};

const visibleChildren = (parent, nodesMap, term) => {
  const children = (parent?.children || []).map((id) => nodesMap[id]).filter(Boolean);
  if (!term) return children;
  return children.filter((child) => hasMatch(child, nodesMap, term));
};

const findPageIdForNode = (nodeId, nodesMap, pageIds) => {
  if (pageIds.has(nodeId)) return nodeId;
  let node = nodesMap[nodeId];
  while (node?.parentId) {
    if (pageIds.has(node.parentId)) return node.parentId;
    node = nodesMap[node.parentId];
  }
  return null;
};

const actionButtonClass = 'grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-35';

export function RenameInlineInput({ value, onCommit, onCancel }) {
  const [draft, setDraft] = useState(value || '');

  const commit = () => {
    const next = draft.trim() || value || 'Untitled';
    onCommit(next);
  };

  return (
    <input
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
        if (event.key === 'Escape') onCancel();
      }}
      className="w-full rounded-lg border border-indigo-500 bg-slate-950 px-2 py-1 text-[11px] font-bold text-white outline-none"
    />
  );
}

export function ConfirmDeleteModal({ item, onConfirm, onCancel }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">Confirm delete</p>
        <h3 className="mt-2 text-lg font-black text-white">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{item.message}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-300 hover:border-slate-500 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] font-bold transition-colors ${
        danger ? 'text-red-200 hover:bg-red-500/15' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={13} />
      <span className="truncate">{label}</span>
    </button>
  );
}

export function TreeItemActions({
  kind,
  node,
  page,
  isOpen,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onSelectSettings,
  onToggleHidden,
  onToggleLocked,
  onSetHome,
  onMoveUp,
  onMoveDown,
  onBringForward,
  onSendBackward,
  onSetSectionType,
}) {
  const hidden = node?.hidden;
  const locked = node?.locked;

  return (
    <div className="relative ml-auto flex shrink-0 items-center gap-0.5">
      {kind !== 'page' && (
        <>
          <button type="button" title={hidden ? 'Show' : 'Hide'} onClick={onToggleHidden} className={actionButtonClass}>
            {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <button type="button" title={locked ? 'Unlock' : 'Lock'} onClick={onToggleLocked} className={actionButtonClass}>
            {locked ? <Lock size={13} /> : <Unlock size={13} />}
          </button>
        </>
      )}
      <button type="button" title="More actions" onClick={onOpen} className={actionButtonClass}>
        <MoreHorizontal size={14} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-8 z-[80] w-52 rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <MenuItem icon={Settings} label={`${labelForType(kind)} settings`} onClick={onSelectSettings} />
          <MenuItem icon={Type} label="Rename" onClick={onRename} />
          <MenuItem icon={Copy} label="Duplicate" onClick={onDuplicate} />
          {kind === 'page' && (
            <MenuItem icon={Star} label={page?.isHome ? 'Homepage' : 'Set as homepage'} onClick={onSetHome} />
          )}
          {kind === 'section' && (
            <>
              <div className="my-1 rounded-lg bg-slate-900 p-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Section type
                  <select
                    value={getSectionType(node)}
                    onChange={(event) => onSetSectionType(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-white outline-none"
                  >
                    {SECTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <MenuItem icon={ChevronDown} label="Move down" onClick={onMoveDown} />
              <MenuItem icon={ChevronRight} label="Move up" onClick={onMoveUp} />
            </>
          )}
          {kind === 'element' && (
            <>
              <MenuItem icon={ChevronRight} label="Bring forward" onClick={onBringForward} />
              <MenuItem icon={ChevronDown} label="Send backward" onClick={onSendBackward} />
            </>
          )}
          {kind !== 'page' && (
            <>
              <MenuItem icon={hidden ? Eye : EyeOff} label={hidden ? 'Show' : 'Hide'} onClick={onToggleHidden} />
              <MenuItem icon={locked ? Unlock : Lock} label={locked ? 'Unlock' : 'Lock'} onClick={onToggleLocked} />
            </>
          )}
          <div className="my-1 h-px bg-slate-800" />
          <MenuItem icon={Trash2} label="Delete" danger onClick={onDelete} />
        </div>
      )}
    </div>
  );
}

const RowIcon = ({ node, kind }) => (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${
      kind === 'page'
        ? 'bg-sky-500/15 text-sky-300'
        : kind === 'section'
          ? 'bg-indigo-500/15 text-indigo-300'
          : 'bg-slate-950 text-slate-500'
    }`}
    >
      {renderNodeIcon(node, kind)}
    </span>
);

export const ElementTreeItem = memo(function ElementTreeItem({
  node,
  depth,
  searchTerm,
  collapsed,
  editingId,
  menuKey,
  pageIds,
  actions,
}) {
  const { nodesMap, selectedNodeIds } = useBuilderStore();
  const children = useMemo(() => visibleChildren(node, nodesMap, searchTerm), [node, nodesMap, searchTerm]);
  const hasChildren = children.length > 0;
  const expanded = Boolean(searchTerm) || !collapsed[node.id];
  const selected = selectedNodeIds.includes(node.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dndId('element', node.id),
    data: { kind: 'element', nodeId: node.id, parentId: node.parentId },
    disabled: node.locked,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => actions.selectNode(node.id)}
        onDoubleClick={() => actions.startRename(node.id)}
        onContextMenu={(event) => {
          event.preventDefault();
          actions.openMenu(`element:${node.id}`);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') actions.selectNode(node.id);
        }}
        className={`group flex min-h-9 items-center gap-1.5 rounded-xl border px-2 transition-all ${
          selected
            ? 'border-indigo-500/70 bg-indigo-500/15 text-indigo-100 shadow-sm'
            : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) actions.toggleCollapsed(node.id);
          }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-white"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />}
        </button>
        <RowIcon node={node} kind="element" />
        <div className="min-w-0 flex-1">
          {editingId === node.id ? (
            <RenameInlineInput
              value={node.name || labelForType(node.type)}
              onCommit={(name) => actions.renameNode(node.id, name)}
              onCancel={() => actions.startRename(null)}
            />
          ) : (
            <>
              <p className="truncate text-[11px] font-bold" title={node.name || labelForType(node.type)}>
                {node.name || labelForType(node.type)}
              </p>
              <p className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-600" title={labelForType(node.type)}>
                Element: {labelForType(node.type)}
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="grid h-6 w-5 shrink-0 place-items-center rounded-md text-slate-600 opacity-0 transition-opacity hover:bg-slate-800 hover:text-white group-hover:opacity-100"
          title={node.locked ? 'Locked items cannot be moved' : 'Drag to reorder or move'}
        >
          <GripVertical size={13} />
        </button>
        <TreeItemActions
          kind="element"
          node={node}
          isOpen={menuKey === `element:${node.id}`}
          onOpen={(event) => actions.openMenu(`element:${node.id}`, event)}
          onRename={() => actions.startRename(node.id)}
          onDuplicate={() => actions.duplicateNode(node.id)}
          onDelete={() => actions.requestDelete('element', node.id)}
          onSelectSettings={() => actions.selectNode(node.id)}
          onToggleHidden={() => actions.toggleHidden(node.id)}
          onToggleLocked={() => actions.toggleLocked(node.id)}
          onBringForward={() => actions.bringForward(node.id)}
          onSendBackward={() => actions.sendBackward(node.id)}
        />
      </div>
      {hasChildren && expanded && (
        <SortableContext items={children.map((child) => dndId('element', child.id))} strategy={verticalListSortingStrategy}>
          <div className="mt-1 space-y-1">
            {children.map((child) => (
              <ElementTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                searchTerm={searchTerm}
                collapsed={collapsed}
                editingId={editingId}
                menuKey={menuKey}
                pageIds={pageIds}
                actions={actions}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
});

export const SectionTreeItem = memo(function SectionTreeItem({
  section,
  page,
  searchTerm,
  collapsed,
  editingId,
  menuKey,
  pageIds,
  actions,
}) {
  const { nodesMap, selectedNodeIds } = useBuilderStore();
  const children = useMemo(() => visibleChildren(section, nodesMap, searchTerm), [section, nodesMap, searchTerm]);
  const expanded = Boolean(searchTerm) || !collapsed[section.id];
  const selected = selectedNodeIds.includes(section.id);
  const type = getSectionType(section);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dndId('section', section.id),
    data: { kind: 'section', nodeId: section.id, parentId: page.id },
    disabled: section.locked,
  });
  const {
    setNodeRef: setDropNodeRef,
    isOver,
  } = useDroppable({
    id: sectionDropId(section.id),
    data: { kind: 'section-drop', sectionId: section.id },
    disabled: section.locked,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section ref={setNodeRef} style={style} className={`rounded-2xl border bg-slate-950/80 p-2 ${selected ? 'border-indigo-500/70' : 'border-slate-800'} ${isDragging ? 'opacity-50' : ''}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => actions.selectNode(section.id)}
        onDoubleClick={() => actions.startRename(section.id)}
        onContextMenu={(event) => {
          event.preventDefault();
          actions.openMenu(`section:${section.id}`);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') actions.selectNode(section.id);
        }}
        className={`group flex min-h-10 items-center gap-1.5 rounded-xl border px-2 transition-all ${
          selected
            ? 'border-indigo-500/70 bg-indigo-500/15 text-indigo-100'
            : 'border-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            actions.toggleCollapsed(section.id);
          }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-white"
          title={expanded ? 'Collapse section' : 'Expand section'}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <RowIcon node={section} kind="section" />
        <div className="min-w-0 flex-1">
          {editingId === section.id ? (
            <RenameInlineInput
              value={section.name || labelForType(type)}
              onCommit={(name) => actions.renameNode(section.id, name)}
              onCancel={() => actions.startRename(null)}
            />
          ) : (
            <>
              <p className="truncate text-[11px] font-black uppercase tracking-[0.12em]" title={section.name || labelForType(type)}>
                {section.name || labelForType(type)}
              </p>
              <p className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-600">
                Section: {labelForType(type)}
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="grid h-6 w-5 shrink-0 place-items-center rounded-md text-slate-600 opacity-0 transition-opacity hover:bg-slate-800 hover:text-white group-hover:opacity-100"
          title={section.locked ? 'Locked sections cannot be moved' : 'Drag section'}
        >
          <GripVertical size={13} />
        </button>
        <TreeItemActions
          kind="section"
          node={section}
          isOpen={menuKey === `section:${section.id}`}
          onOpen={(event) => actions.openMenu(`section:${section.id}`, event)}
          onRename={() => actions.startRename(section.id)}
          onDuplicate={() => actions.duplicateNode(section.id)}
          onDelete={() => actions.requestDelete('section', section.id)}
          onSelectSettings={() => actions.selectNode(section.id)}
          onToggleHidden={() => actions.toggleHidden(section.id)}
          onToggleLocked={() => actions.toggleLocked(section.id)}
          onMoveUp={() => actions.moveNode(section.id, section.parentId, -1)}
          onMoveDown={() => actions.moveNode(section.id, section.parentId, 9999)}
          onSetSectionType={(nextType) => actions.setSectionType(section.id, nextType)}
        />
      </div>
      {expanded && (
        <div
          ref={setDropNodeRef}
          className={`mt-2 space-y-1 border-l pl-2 transition-colors ${isOver ? 'border-indigo-400 bg-indigo-500/5' : 'border-slate-800/80'}`}
        >
          <SortableContext items={children.map((child) => dndId('element', child.id))} strategy={verticalListSortingStrategy}>
            {children.length ? (
              children.map((child) => (
                <ElementTreeItem
                  key={child.id}
                  node={child}
                  depth={1}
                  searchTerm={searchTerm}
                  collapsed={collapsed}
                  editingId={editingId}
                  menuKey={menuKey}
                  pageIds={pageIds}
                  actions={actions}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 px-3 py-3 text-[11px] font-bold text-slate-600">
                Empty section
              </div>
            )}
          </SortableContext>
        </div>
      )}
    </section>
  );
});

export const PageTreeItem = memo(function PageTreeItem({
  page,
  pageNode,
  searchTerm,
  collapsed,
  editingId,
  menuKey,
  pageIds,
  actions,
}) {
  const { nodesMap, currentPage, selectedNodeIds } = useBuilderStore();
  const sections = useMemo(() => visibleChildren(pageNode, nodesMap, searchTerm), [nodesMap, pageNode, searchTerm]);
  const expanded = Boolean(searchTerm) || !collapsed[page.id];
  const selected = selectedNodeIds.includes(page.id);
  const active = currentPage?.id === page.id;

  return (
    <article className={`rounded-2xl border p-2 transition-colors ${selected ? 'border-sky-400/70 bg-sky-500/10' : active ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-slate-800 bg-slate-950/80'}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => actions.selectPage(page.id)}
        onDoubleClick={() => actions.startRename(page.id)}
        onContextMenu={(event) => {
          event.preventDefault();
          actions.openMenu(`page:${page.id}`);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') actions.selectPage(page.id);
        }}
        className="group flex min-h-10 items-center gap-1.5 rounded-xl px-2 text-slate-200 transition-colors hover:bg-slate-900"
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            actions.toggleCollapsed(page.id);
          }}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-white"
          title={expanded ? 'Collapse page' : 'Expand page'}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <RowIcon node={pageNode} kind="page" />
        <div className="min-w-0 flex-1">
          {editingId === page.id ? (
            <RenameInlineInput
              value={page.name || 'Untitled page'}
              onCommit={(name) => actions.renamePage(page.id, name)}
              onCancel={() => actions.startRename(null)}
            />
          ) : (
            <>
              <p className="truncate text-[12px] font-black text-white" title={page.name}>
                {page.name}
              </p>
              <p className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-600">
                Page: {page.path || page.slug || '/'} {active ? 'Current' : ''}
              </p>
            </>
          )}
        </div>
        {page.isHome && <Star size={13} className="shrink-0 text-amber-300" />}
        <TreeItemActions
          kind="page"
          node={pageNode}
          page={page}
          isOpen={menuKey === `page:${page.id}`}
          onOpen={(event) => actions.openMenu(`page:${page.id}`, event)}
          onRename={() => actions.startRename(page.id)}
          onDuplicate={() => actions.duplicatePage(page.id)}
          onDelete={() => actions.requestDelete('page', page.id)}
          onSelectSettings={() => actions.selectPage(page.id)}
          onSetHome={() => actions.setHomePage(page.id)}
        />
      </div>
      {expanded && (
        <SortableContext items={sections.map((section) => dndId('section', section.id))} strategy={verticalListSortingStrategy}>
          <div className="mt-2 space-y-2">
            {sections.length ? (
              sections.map((section) => (
                <SectionTreeItem
                  key={section.id}
                  section={section}
                  page={page}
                  searchTerm={searchTerm}
                  collapsed={collapsed}
                  editingId={editingId}
                  menuKey={menuKey}
                  pageIds={pageIds}
                  actions={actions}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-center text-[11px] font-bold text-slate-600">
                No sections on this page
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </article>
  );
});

export function StructureTree({ pages, searchTerm, collapsed, editingId, menuKey, pageIds, actions }) {
  if (!pages.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-center text-xs leading-5 text-slate-500">
        No pages yet. Add a page to start building the site structure.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pages.map(({ page, node }) => (
        <PageTreeItem
          key={page.id}
          page={page}
          pageNode={node}
          searchTerm={searchTerm}
          collapsed={collapsed}
          editingId={editingId}
          menuKey={menuKey}
          pageIds={pageIds}
          actions={actions}
        />
      ))}
    </div>
  );
}

export function SelectedItemActions({ selectedNode, selectedPage, selectedKind, actions }) {
  if (!selectedNode && !selectedPage) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-[11px] leading-5 text-slate-500">
        Select a page, section, or element for quick actions.
      </div>
    );
  }

  const id = selectedPage?.id || selectedNode?.id;
  const label = selectedPage?.name || selectedNode?.name || labelForType(selectedNode?.type || selectedKind);
  const canToggle = selectedKind !== 'page';

  return (
    <div className="sticky bottom-0 z-30 -mx-1 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur">
      <p className="mb-2 truncate text-[10px] font-black uppercase tracking-[0.2em] text-slate-500" title={label}>
        Selected: {label}
      </p>
      <div className="grid grid-cols-5 gap-1">
        <button type="button" title="Rename" onClick={() => actions.startRename(id)} className={actionButtonClass}><Type size={14} /></button>
        <button type="button" title="Duplicate" onClick={() => (selectedKind === 'page' ? actions.duplicatePage(id) : actions.duplicateNode(id))} className={actionButtonClass}><Copy size={14} /></button>
        <button type="button" title={selectedNode?.hidden ? 'Show' : 'Hide'} disabled={!canToggle} onClick={() => actions.toggleHidden(id)} className={actionButtonClass}>{selectedNode?.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
        <button type="button" title={selectedNode?.locked ? 'Unlock' : 'Lock'} disabled={!canToggle} onClick={() => actions.toggleLocked(id)} className={actionButtonClass}>{selectedNode?.locked ? <Lock size={14} /> : <Unlock size={14} />}</button>
        <button type="button" title="Delete" onClick={() => actions.requestDelete(selectedKind, id)} className={`${actionButtonClass} text-red-300 hover:bg-red-500/15 hover:text-red-200`}><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

export default function StructurePanel() {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [menuKey, setMenuKey] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const {
    project,
    currentPage,
    nodesMap,
    selectedNodeIds,
    addPage,
    renamePage,
    duplicatePage,
    deletePage,
    setHomePage,
    switchPage,
    selectNodes,
    addNodeToMap,
    updateNodeInMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    lockNodeInMap,
    hideNodeInMap,
    moveNodeInMap,
    bringForwardInMap,
    sendBackwardInMap,
    showToast,
  } = useBuilderStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const pageIds = useMemo(() => new Set((project?.pages || []).map((page) => page.id)), [project?.pages]);
  const searchTerm = query.trim().toLowerCase();

  const pageEntries = useMemo(() => {
    return (project?.pages || [])
      .map((page) => {
        const node = nodesMap[page.id] || { id: page.id, type: NODE_TYPES.PAGE, name: page.name, children: [] };
        return { page, node };
      })
      .filter(({ page, node }) => !searchTerm || hasMatch(node, nodesMap, searchTerm, page));
  }, [nodesMap, project?.pages, searchTerm]);

  const selectedId = selectedNodeIds[0] || null;
  const selectedNode = selectedId ? nodesMap[selectedId] : null;
  const selectedPage = selectedId ? (project?.pages || []).find((page) => page.id === selectedId) : null;
  const selectedKind = selectedPage
    ? 'page'
    : isRootSection(selectedNode, pageIds)
      ? 'section'
      : selectedNode
        ? 'element'
        : 'page';

  const closeMenu = useCallback(() => setMenuKey(null), []);

  const toggleCollapsed = useCallback((id) => {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const startRename = useCallback((id) => {
    setEditingId(id);
    closeMenu();
  }, [closeMenu]);

  const selectPage = useCallback((pageId) => {
    switchPage(pageId);
    selectNodes([pageId]);
    closeMenu();
  }, [closeMenu, selectNodes, switchPage]);

  const selectNode = useCallback((nodeId) => {
    const pageId = findPageIdForNode(nodeId, nodesMap, pageIds);
    if (pageId && pageId !== currentPage?.id) switchPage(pageId);
    selectNodes([nodeId]);
    closeMenu();
    focusCanvasNode(nodeId);
  }, [closeMenu, currentPage?.id, nodesMap, pageIds, selectNodes, switchPage]);

  const addNewPage = () => {
    const page = addPage(`Page ${(project?.pages?.length || 0) + 1}`);
    if (page?.id) {
      switchPage(page.id);
      selectNodes([page.id]);
      setCollapsed((current) => ({ ...current, [page.id]: false }));
    }
  };

  const addNewSection = () => {
    if (!currentPage?.id) return showToast('Create a page before adding sections.', 'error');
    const sectionId = addNodeToMap(currentPage.id, {
      type: NODE_TYPES.SECTION,
      name: 'New Section',
      props: { sectionType: 'custom' },
      styles: { padding: '72px 64px', backgroundColor: '#ffffff', color: '#0f172a', minHeight: '240px' },
    });
    if (sectionId) {
      setCollapsed((current) => ({ ...current, [currentPage.id]: false, [sectionId]: false }));
      focusCanvasNode(sectionId);
    }
  };

  const renamePageAndNode = useCallback((pageId, name) => {
    renamePage(pageId, name);
    updateNodeInMap(pageId, { name });
    setEditingId(null);
    closeMenu();
  }, [closeMenu, renamePage, updateNodeInMap]);

  const renameNode = useCallback((nodeId, name) => {
    if (pageIds.has(nodeId)) {
      renamePageAndNode(nodeId, name);
      return;
    }
    updateNodeInMap(nodeId, { name });
    setEditingId(null);
    closeMenu();
  }, [closeMenu, pageIds, renamePageAndNode, updateNodeInMap]);

  const setSectionType = useCallback((nodeId, sectionType) => {
    updateNodeInMap(nodeId, { props: { sectionType } });
    showToast(`Section type set to ${labelForType(sectionType)}.`, 'success');
  }, [showToast, updateNodeInMap]);

  const duplicatePageAndSelect = useCallback((pageId) => {
    const copy = duplicatePage(pageId);
    if (copy?.id) {
      switchPage(copy.id);
      selectNodes([copy.id]);
      setCollapsed((current) => ({ ...current, [copy.id]: false }));
    }
    closeMenu();
  }, [closeMenu, duplicatePage, selectNodes, switchPage]);

  const duplicateNodeAndSelect = useCallback((nodeId) => {
    const newId = duplicateNodeInMap(nodeId);
    if (newId) {
      selectNodes([newId]);
      focusCanvasNode(newId);
    }
    closeMenu();
  }, [closeMenu, duplicateNodeInMap, selectNodes]);

  const requestDelete = useCallback((kind, id) => {
    const page = (project?.pages || []).find((item) => item.id === id);
    const node = nodesMap[id];
    const label = page?.name || node?.name || labelForType(node?.type || kind);
    const messages = {
      page: `Delete ${label}? This will remove the page and every section inside it.`,
      section: `Delete ${label}? This will remove all elements inside it.`,
      element: `Delete ${label}? This will remove this element and any child layers inside it.`,
    };
    setPendingDelete({
      kind,
      id,
      title: `Delete ${label}?`,
      message: messages[kind] || `Delete ${label}?`,
    });
    closeMenu();
  }, [closeMenu, nodesMap, project?.pages]);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'page') {
      deletePage(pendingDelete.id);
    } else {
      deleteNodeFromMap(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const moveNodeToIndex = useCallback((nodeId, parentId, targetIndex) => {
    const parent = nodesMap[parentId];
    if (!parent) return;
    const currentIndex = (parent.children || []).indexOf(nodeId);
    const bounded = targetIndex < 0
      ? Math.max(0, currentIndex - 1)
      : targetIndex > 1000
        ? Math.min((parent.children || []).length - 1, currentIndex + 1)
        : targetIndex;
    moveNodeInMap(nodeId, parentId, bounded);
    closeMenu();
  }, [closeMenu, moveNodeInMap, nodesMap]);

  const handleDragEnd = ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return;
    const activeData = active.data.current || {};
    const overData = over.data.current || {};
    const activeNode = nodesMap[activeData.nodeId];
    if (!activeNode) return;
    if (activeNode.locked) {
      showToast('Locked items cannot be moved.', 'error');
      return;
    }

    if (activeData.kind === 'section') {
      const overNode = nodesMap[overData.nodeId];
      if (overData.kind !== 'section' || !overNode || overNode.parentId !== activeNode.parentId) {
        showToast('Sections can only be reordered inside the same page.', 'error');
        return;
      }
      const pageNode = nodesMap[activeNode.parentId];
      const targetIndex = (pageNode?.children || []).indexOf(overNode.id);
      if (targetIndex >= 0) moveNodeInMap(activeNode.id, activeNode.parentId, targetIndex);
      return;
    }

    if (activeData.kind === 'element') {
      let targetParentId = null;
      let targetIndex = -1;

      if (overData.kind === 'element') {
        const overNode = nodesMap[overData.nodeId];
        targetParentId = overNode?.parentId || null;
        targetIndex = (nodesMap[targetParentId]?.children || []).indexOf(overNode?.id);
      }

      if (overData.kind === 'section') {
        targetParentId = overData.nodeId;
        targetIndex = (nodesMap[targetParentId]?.children || []).length;
      }

      if (overData.kind === 'section-drop') {
        targetParentId = overData.sectionId;
        targetIndex = (nodesMap[targetParentId]?.children || []).length;
      }

      if (!targetParentId) return;
      const parent = nodesMap[targetParentId];
      if (parent?.locked) {
        showToast('Cannot move into a locked section.', 'error');
        return;
      }
      moveNodeInMap(activeNode.id, targetParentId, targetIndex);
    }
  };

  const actions = useMemo(() => ({
    selectPage,
    selectNode,
    toggleCollapsed,
    startRename,
    renamePage: renamePageAndNode,
    renameNode,
    duplicatePage: duplicatePageAndSelect,
    duplicateNode: duplicateNodeAndSelect,
    requestDelete,
    setHomePage: (pageId) => {
      setHomePage(pageId);
      closeMenu();
    },
    toggleHidden: (nodeId) => {
      hideNodeInMap(nodeId);
      closeMenu();
    },
    toggleLocked: (nodeId) => {
      lockNodeInMap(nodeId);
      closeMenu();
    },
    moveNode: moveNodeToIndex,
    bringForward: (nodeId) => {
      bringForwardInMap(nodeId);
      closeMenu();
    },
    sendBackward: (nodeId) => {
      sendBackwardInMap(nodeId);
      closeMenu();
    },
    setSectionType,
    openMenu: (key, event) => {
      event?.stopPropagation?.();
      setMenuKey((current) => (current === key ? null : key));
    },
  }), [
    bringForwardInMap,
    closeMenu,
    duplicateNodeAndSelect,
    duplicatePageAndSelect,
    hideNodeInMap,
    lockNodeInMap,
    moveNodeToIndex,
    renameNode,
    renamePageAndNode,
    requestDelete,
    selectNode,
    selectPage,
    sendBackwardInMap,
    setHomePage,
    setSectionType,
    startRename,
    toggleCollapsed,
  ]);

  return (
    <div className="flex min-h-0 flex-col gap-4" onClick={() => menuKey && setMenuKey(null)}>
      <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 focus-within:border-indigo-500">
        <Search size={15} className="text-slate-600" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search page, section, element..."
          className="min-w-0 flex-1 bg-transparent text-xs font-bold text-white outline-none placeholder:text-slate-600"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={addNewPage} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500">
          <Plus size={14} />
          Add Page
        </button>
        <button type="button" onClick={addNewSection} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-200 hover:border-indigo-500 hover:text-white">
          <LayoutPanelTop size={14} />
          Add Section
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <StructureTree
          pages={pageEntries}
          searchTerm={searchTerm}
          collapsed={collapsed}
          editingId={editingId}
          menuKey={menuKey}
          pageIds={pageIds}
          actions={actions}
        />
      </DndContext>

      <SelectedItemActions
        selectedNode={selectedNode}
        selectedPage={selectedPage}
        selectedKind={selectedKind}
        actions={actions}
      />

      <ConfirmDeleteModal
        item={pendingDelete}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
