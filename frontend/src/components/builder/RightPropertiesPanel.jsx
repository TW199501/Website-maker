import { SlidersHorizontal, Palette, Type, Globe, Layout, Layers, MousePointer2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import SelectionProperties from './properties/SelectionProperties';
import LayoutProperties from './properties/LayoutProperties';
import TextProperties from './properties/TextProperties';
import DesignProperties from './properties/DesignProperties';
import BackgroundProperties from './properties/BackgroundProperties';
import MediaProperties from './properties/MediaProperties';
import ButtonProperties from './properties/ButtonProperties';
import LinkSettingsProperties from './properties/LinkSettingsProperties';
import SEOProperties from './properties/SEOProperties';
import AnimationProperties from './properties/AnimationProperties';
import ResponsiveProperties from './properties/ResponsiveProperties';
import FormProperties from './properties/FormProperties';
import EcommerceProperties from './properties/EcommerceProperties';
import AdvancedProperties from './properties/AdvancedProperties';
import AccessibilityProperties from './properties/AccessibilityProperties';
import ExportCodeProperties from './properties/ExportCodeProperties';
import InteractionProperties from './prototype/InteractionProperties';
import MultiSelectionProperties from './properties/MultiSelectionProperties';
import SectionSpecificProperties from './properties/SectionSpecificProperties';

function PageOverview() {
  const { project, currentPage } = useBuilderStore();
  
  const quickStats = [
    { icon: Layout, label: 'Sections', value: currentPage?.sections?.length || 0 },
    { icon: Layers, label: 'Pages', value: project?.pages?.length || 0 },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Page Info */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">Current Page</p>
        <h3 className="text-base font-bold text-white mb-1">{currentPage?.name || 'Home'}</h3>
        <p className="text-xs text-slate-500">/{currentPage?.slug || ''}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-slate-800/40 bg-slate-950/30 p-3 text-center">
            <Icon size={16} className="mx-auto mb-2 text-slate-500" />
            <p className="text-lg font-black text-white">{value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Helpful Hint */}
      <div className="rounded-2xl border border-dashed border-slate-800/60 p-4 text-center">
        <MousePointer2 size={20} className="mx-auto mb-3 text-slate-600" />
        <p className="text-xs font-medium text-slate-400 leading-relaxed">
          Click any element on the canvas to edit its properties, or use the left panel to add new elements.
        </p>
      </div>
    </div>
  );
}

export default function RightPropertiesPanel() {
  const { builderMode, getSelectedNode, selectedNodeIds, selectedInteraction } = useBuilderStore();
  const node = getSelectedNode;
  const isMultiSelect = selectedNodeIds.length > 1;
  const hasSelection = Boolean(node || selectedInteraction || isMultiSelect);

  return (
    <aside className="w-[320px] shrink-0 overflow-y-auto border-l border-slate-800/60 bg-slate-900 custom-scrollbar">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/60 bg-slate-900 px-5 py-3.5">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
            {hasSelection ? 'Edit selected' : 'Page overview'}
          </p>
          <h2 className="text-sm font-black uppercase tracking-tight text-white">
            {hasSelection ? 'Properties' : 'Inspector'}
          </h2>
        </div>
        <SlidersHorizontal size={16} className="text-slate-600" />
      </div>

      {/* Context-aware: show page overview when nothing is selected */}
      {!hasSelection && <PageOverview />}

      {selectedInteraction && <InteractionProperties />}
      {node && !selectedInteraction && !isMultiSelect && <SelectionProperties />}
      {builderMode === 'prototype' && node && !isMultiSelect && <InteractionProperties />}
      
      {isMultiSelect && (
        <div className="p-5">
          <MultiSelectionProperties />
        </div>
      )}

      {node && !selectedInteraction && !isMultiSelect && (
        <>
          <SectionSpecificProperties />
          <LayoutProperties />
          <TextProperties />
          <DesignProperties />
          <ButtonProperties />
          <LinkSettingsProperties />
          <MediaProperties />
          <SEOProperties />
          <AnimationProperties />
          <BackgroundProperties />
          <ResponsiveProperties />
          <FormProperties />
          <EcommerceProperties />
          <AdvancedProperties />
          <AccessibilityProperties />
        </>
      )}
      {hasSelection && <ExportCodeProperties />}
    </aside>
  );
}
