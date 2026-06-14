import { useBuilderStore } from '../../store/builderStore';
import AddElementsPanel from './panels/AddElementsPanel';
import SectionsPanel from './panels/SectionsPanel';
import TemplatesPanel from './panels/TemplatesPanel';
import ThemePanel from './panels/ThemePanel';
import MediaPanel from './panels/MediaPanel';
import TextPanel from './panels/TextPanel';
import ComponentsPanel from './panels/ComponentsPanel';
import PagesPanel from './panels/PagesPanel';
import AnimationPanel from './panels/AnimationPanel';
import Design2DPanel from './panels/Design2DPanel';
import Elements3DPanel from './panels/Elements3DPanel';
import IntegrationsPanel from './panels/IntegrationsPanel';
import TutorialsPanel from './panels/TutorialsPanel';
import SettingsPanel from './panels/SettingsPanel';
import LayersPanel from './LayersPanel';
import { PanelShell } from './panels/PanelShell';
import { leftPanelTools } from '../../data/builderTools';

const panelByName = {
  AddElementsPanel,
  SectionsPanel,
  TemplatesPanel,
  ThemePanel,
  MediaPanel,
  TextPanel,
  ComponentsPanel,
  PagesPanel,
  AnimationPanel,
  Design2DPanel,
  Visual3DPanel: Elements3DPanel,
  integrations: IntegrationsPanel,
  IntegrationsPanel,
  TutorialsPanel,
  SettingsPanel,
  layers: () => <PanelShell eyebrow="Structure" title="Layers"><LayersPanel /></PanelShell>,
};

export default function LeftToolPanel() {
  const { activeLeftTool, leftPanelCollapsed } = useBuilderStore();

  // When left panel is collapsed, don't render
  if (leftPanelCollapsed) return null;

  const tool = leftPanelTools.find((item) => item.id === activeLeftTool);
  const Panel = panelByName[tool?.panelComponent] || panelByName[activeLeftTool];

  // Default to AddElementsPanel when no tool is selected (clean open state)
  const ResolvedPanel = Panel || AddElementsPanel;

  return (
    <aside className="w-[300px] shrink-0 border-r border-white/[0.05] bg-slate-900/95 backdrop-blur-md overflow-y-auto overflow-x-hidden custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <ResolvedPanel />
    </aside>
  );
}
