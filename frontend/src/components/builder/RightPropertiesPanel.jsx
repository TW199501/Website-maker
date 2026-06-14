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
      <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">Current Page</p>
        <h3 className="text-base font-bold text-white mb-1">{currentPage?.name || 'Home'}</h3>
        <p className="text-xs text-slate-500">/{currentPage?.slug || ''}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-white/5 bg-slate-950/30 p-3 text-center shadow-inner hover:bg-slate-950/50 transition-colors">
            <Icon size={16} className="mx-auto mb-2 text-slate-500" />
            <p className="text-lg font-black text-white">{value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Helpful Hint */}
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
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

  // Categorize the selected node to determine which property panels to show
  const type = node?.type;
  const isText = ['heading', 'paragraph', 'countdown'].includes(type);
  const isButton = ['button', 'navLink', 'footerLink', 'whatsappButton'].includes(type);
  const isMedia = ['image', 'video', 'icon', 'lottieAnimation', 'threeDObject', 'gallery', 'slider'].includes(type);
  const isImage = type === 'image';
  const isForm = ['form', 'contactForm', 'bookingForm', 'searchBar'].includes(type);
  const isEcommerce = ['productCard', 'pricingCard'].includes(type);
  const isSectionOrPage = ['page', 'section', 'navbar', 'footer'].includes(type);
  const isSpacer = type === 'spacer';
  const usesBackground = isSectionOrPage || ['container', 'grid', 'flex', 'row', 'column', 'card', 'blogCard', 'testimonialCard', 'serviceCard', 'modal', 'tabs', 'accordion'].includes(type);
  const usesDesign = !isSpacer && type !== 'page'; // Most elements use Design properties except Page and Spacer

  return (
    <aside className="w-[320px] shrink-0 overflow-y-auto border-l border-white/[0.05] bg-slate-900/95 backdrop-blur-md custom-scrollbar pb-10 shadow-[-4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.05] bg-slate-900/80 backdrop-blur-md px-5 py-3.5 shadow-soft">
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
          {isSectionOrPage && <SectionSpecificProperties />}
          
          {isSpacer ? (
            // Spacer gets ONLY specific minimal properties
            <>
              <LayoutProperties />
              <ResponsiveProperties />
            </>
          ) : (
            // All other elements get Element-Specific + Universal properties
            <>
              <LayoutProperties />
              {isText && <TextProperties />}
              {isButton && (
                <>
                  <ButtonProperties />
                  <LinkSettingsProperties />
                </>
              )}
              {isMedia && <MediaProperties />}
              {isImage && <SEOProperties />}
              {usesBackground && <BackgroundProperties />}
              {isForm && <FormProperties />}
              {isEcommerce && <EcommerceProperties />}
              {usesDesign && <DesignProperties />}
              
              {/* Universal Settings */}
              <AnimationProperties />
              <ResponsiveProperties />
              <AdvancedProperties />
              <AccessibilityProperties />
            </>
          )}
        </>
      )}
      {hasSelection && <ExportCodeProperties />}
    </aside>
  );
}
