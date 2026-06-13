import React, { useMemo, useState } from 'react';
import type { Template } from '../../types/template.types';
import DesignCanvas from './DesignCanvas';
import DesignToolbar from './DesignToolbar';
import DesignPropertiesPanel from './DesignPropertiesPanel';
import { loadDesignCanvasFromTemplate } from './designTemplateLoader';

export default function DesignWorkspace({ template }: { template?: Template | null }) {
  const canvas = useMemo(() => loadDesignCanvasFromTemplate(template), [template]);
  const [activeTool, setActiveTool] = useState('Select');
  const [selectedId, setSelectedId] = useState<string | null>(canvas.elements[0]?.id || null);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-slate-950 p-4 text-white">
      <DesignToolbar onSelectTool={setActiveTool} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 text-sm text-slate-400">Active tool: {activeTool}</div>
          <DesignCanvas 
            canvas={canvas} 
            selectedId={selectedId}
            onSelectElement={setSelectedId}
          />
        </div>
        <DesignPropertiesPanel canvas={canvas} selectedId={selectedId} />
      </div>
    </div>
  );
}
