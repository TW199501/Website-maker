export type ElementType = 
  | 'heading' | 'paragraph' | 'button' | 'image' | 'video' 
  | 'icon' | 'divider' | 'spacer' | 'container' | 'card' 
  | 'navbar' | 'hero' | 'footer' | 'text' | 'rect' | 'image-placeholder';

export interface DesignCanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fill?: string;
  fontSize?: number;
}

export interface DesignCanvasDocument {
  width: number;
  height: number;
  background: string;
  elements: DesignCanvasElement[];
}

export const defaultDesignCanvas: DesignCanvasDocument = {
  width: 1080,
  height: 1080,
  background: '#111827',
  elements: [
    {
      id: 'heading-1',
      type: 'heading',
      x: 96,
      y: 120,
      text: 'Editable Heading',
      fill: '#ffffff',
      fontSize: 76,
    },
    {
      id: 'paragraph-1',
      type: 'paragraph',
      x: 96,
      y: 220,
      text: 'This is a paragraph element for testing properties.',
      fill: '#9ca3af',
      fontSize: 24,
    },
    {
      id: 'button-1',
      type: 'button',
      x: 96,
      y: 320,
      width: 200,
      height: 64,
      text: 'Click Me',
      fill: '#6366f1',
    },
    {
      id: 'image-1',
      type: 'image',
      x: 96,
      y: 420,
      width: 400,
      height: 300,
      fill: '#1f2937',
    },
    {
      id: 'container-1',
      type: 'container',
      x: 540,
      y: 120,
      width: 400,
      height: 600,
      fill: '#1e293b',
    }
  ],
};
