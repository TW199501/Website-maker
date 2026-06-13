import React from 'react';
import type { DesignCanvasDocument } from './defaultDesignCanvas';
import { ELEMENT_PROPERTIES, UNIVERSAL_PROPERTIES, PropertyGroup } from './propertiesSchema';

export default function DesignPropertiesPanel({ 
  canvas,
  selectedId 
}: { 
  canvas: DesignCanvasDocument;
  selectedId: string | null;
}) {
  const selectedElement = canvas.elements.find(el => el.id === selectedId);

  const renderPropertyGroup = (group: PropertyGroup, keyPrefix: string) => (
    <div key={keyPrefix} className="mb-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{group.title}</h3>
      <div className="space-y-2">
        {group.properties.map((prop, idx) => (
          <div key={`${keyPrefix}-${idx}`} className="flex flex-col gap-1 rounded-lg bg-slate-950/50 p-2">
            <label className="text-xs font-medium text-slate-300">{prop.label}</label>
            <div className="text-[10px] text-slate-500">{prop.action}</div>
            <input 
              type="text" 
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              placeholder={`Value for ${prop.label}`} 
              disabled
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-300">
      <div className="border-b border-slate-800 p-4">
        <h2 className="text-sm font-bold text-white">Properties</h2>
        {selectedElement ? (
          <p className="mt-1 text-xs text-indigo-400">Selected: {selectedElement.type}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">No element selected</p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedElement && (
          <div className="text-center text-sm text-slate-500">
            Select an element on the canvas to edit its properties.
          </div>
        )}

        {selectedElement && (
          <>
            {/* Element Specific Properties */}
            {ELEMENT_PROPERTIES[selectedElement.type]?.map((group, idx) => 
              renderPropertyGroup(group, `specific-${idx}`)
            )}

            {/* Universal Properties */}
            <div className="my-6 h-px w-full bg-slate-800" />
            <h3 className="mb-4 text-sm font-bold text-white">Universal Properties</h3>
            {UNIVERSAL_PROPERTIES.map((group, idx) => 
              renderPropertyGroup(group, `universal-${idx}`)
            )}
          </>
        )}
      </div>
    </aside>
  );
}
