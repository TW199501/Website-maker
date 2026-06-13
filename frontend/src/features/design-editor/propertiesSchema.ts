export interface PropertyDefinition {
  label: string;
  action: string;
}

export interface PropertyGroup {
  title: string;
  properties: PropertyDefinition[];
}

export const UNIVERSAL_PROPERTIES: PropertyGroup[] = [
  {
    title: 'Universal - Layout',
    properties: [
      { label: 'Width', action: 'Control element width' },
      { label: 'Height', action: 'Control element height' },
      { label: 'Margin', action: 'Outer spacing' },
      { label: 'Padding', action: 'Inner spacing' },
      { label: 'Position', action: 'Relative / Absolute / Fixed' },
    ],
  },
  {
    title: 'Universal - Visibility',
    properties: [
      { label: 'Show On Desktop', action: 'Visibility control' },
      { label: 'Show On Laptop', action: 'Visibility control' },
      { label: 'Show On Tablet', action: 'Visibility control' },
      { label: 'Show On Mobile', action: 'Visibility control' },
    ],
  },
  {
    title: 'Universal - Effects',
    properties: [
      { label: 'Opacity', action: 'Transparency' },
      { label: 'Shadow', action: 'Depth effect' },
      { label: 'Blur', action: 'Visual blur' },
      { label: 'Backdrop Blur', action: 'Glass effect' },
    ],
  },
  {
    title: 'Universal - Animation',
    properties: [
      { label: 'Fade In', action: 'Animation effect' },
      { label: 'Slide In', action: 'Animation effect' },
      { label: 'Zoom In', action: 'Animation effect' },
      { label: 'Rotate', action: 'Animation effect' },
      { label: 'Bounce', action: 'Animation effect' },
    ],
  },
  {
    title: 'Universal - Transform',
    properties: [
      { label: 'Scale', action: 'Scale transform' },
      { label: 'Rotate', action: 'Rotate transform' },
      { label: 'Skew', action: 'Skew transform' },
      { label: 'Flip Horizontal', action: 'Flip X' },
      { label: 'Flip Vertical', action: 'Flip Y' },
    ],
  },
  {
    title: 'Universal - Layer Controls',
    properties: [
      { label: 'Lock', action: 'Prevent editing' },
      { label: 'Hide', action: 'Hide element' },
      { label: 'Duplicate', action: 'Create copy' },
      { label: 'Bring Forward', action: 'Move one layer up' },
      { label: 'Send Backward', action: 'Move one layer down' },
      { label: 'Bring To Front', action: 'Top layer' },
      { label: 'Send To Back', action: 'Bottom layer' },
    ],
  },
  {
    title: 'Universal - Responsive Controls',
    properties: [
      { label: 'Desktop Styles', action: 'Responsive overrides' },
      { label: 'Tablet Styles', action: 'Responsive overrides' },
      { label: 'Mobile Styles', action: 'Responsive overrides' },
      { label: 'Breakpoint Overrides', action: 'Responsive overrides' },
    ],
  },
  {
    title: 'Universal - Advanced',
    properties: [
      { label: 'CSS Classes', action: 'Custom classes' },
      { label: 'Element ID', action: 'Unique ID' },
      { label: 'Custom Attributes', action: 'Data attributes' },
      { label: 'Custom CSS', action: 'Custom CSS rules' },
      { label: 'Z-index', action: 'Stack order' },
      { label: 'Overflow Settings', action: 'Overflow behavior' },
    ],
  },
];

export const ELEMENT_PROPERTIES: Record<string, PropertyGroup[]> = {
  heading: [
    {
      title: 'Content',
      properties: [
        { label: 'Text Content', action: 'Edit the heading text displayed on the page' },
        { label: 'Dynamic Content', action: 'Connect heading to CMS/database content' },
        { label: 'Heading Level (H1-H6)', action: 'Define SEO hierarchy and accessibility' },
      ],
    },
    {
      title: 'Typography',
      properties: [
        { label: 'Font Family', action: 'Change font style' },
        { label: 'Font Size', action: 'Adjust text size' },
        { label: 'Font Weight', action: 'Control boldness' },
        { label: 'Line Height', action: 'Adjust spacing between lines' },
        { label: 'Letter Spacing', action: 'Increase/decrease character spacing' },
        { label: 'Text Transform', action: 'Uppercase, lowercase, capitalize' },
      ],
    },
    {
      title: 'Color',
      properties: [
        { label: 'Text Color', action: 'Change heading color' },
        { label: 'Gradient Text', action: 'Apply multi-color gradient' },
        { label: 'Opacity', action: 'Control transparency' },
      ],
    },
  ],
  paragraph: [
    {
      title: 'Content',
      properties: [
        { label: 'Text Editor', action: 'Edit paragraph content' },
        { label: 'Dynamic Text', action: 'Connect content dynamically' },
      ],
    },
    {
      title: 'Typography',
      properties: [
        { label: 'Font Size', action: 'Adjust readability' },
        { label: 'Line Height', action: 'Improve reading experience' },
        { label: 'Text Alignment', action: 'Left, center, right, justify' },
      ],
    },
    {
      title: 'Advanced',
      properties: [
        { label: 'Text Clamp', action: 'Limit visible lines' },
        { label: 'Read More', action: 'Expand/collapse long text' },
      ],
    },
  ],
  button: [
    {
      title: 'Content',
      properties: [
        { label: 'Button Text', action: 'Text displayed on button' },
        { label: 'Icon', action: 'Add icon to button' },
        { label: 'Icon Position', action: 'Left, right, top' },
      ],
    },
    {
      title: 'Actions',
      properties: [
        { label: 'URL Link', action: 'Open external page' },
        { label: 'Internal Page', action: 'Navigate inside website' },
        { label: 'Scroll To Section', action: 'Jump to section' },
        { label: 'Open Popup', action: 'Launch modal' },
        { label: 'Download File', action: 'Trigger file download' },
      ],
    },
    {
      title: 'Style',
      properties: [
        { label: 'Background Color', action: 'Main button color' },
        { label: 'Gradient', action: 'Multi-color button' },
        { label: 'Border Radius', action: 'Rounded corners' },
        { label: 'Shadow', action: 'Add depth effect' },
      ],
    },
    {
      title: 'States',
      properties: [
        { label: 'Hover State', action: 'Appearance on mouse hover' },
        { label: 'Active State', action: 'Appearance when clicked' },
        { label: 'Disabled State', action: 'Appearance when unavailable' },
      ],
    },
  ],
  image: [
    {
      title: 'Source',
      properties: [
        { label: 'Upload Image', action: 'Add local image' },
        { label: 'URL Image', action: 'Use external image' },
        { label: 'Asset Library', action: 'Select saved assets' },
      ],
    },
    {
      title: 'Display',
      properties: [
        { label: 'Cover', action: 'Fill entire container' },
        { label: 'Contain', action: 'Show full image' },
        { label: 'Fill', action: 'Stretch image' },
      ],
    },
    {
      title: 'Effects',
      properties: [
        { label: 'Border Radius', action: 'Round image corners' },
        { label: 'Shadow', action: 'Create depth' },
        { label: 'Overlay', action: 'Add color layer' },
        { label: 'Blur', action: 'Blur image' },
        { label: 'Brightness', action: 'Increase light' },
        { label: 'Contrast', action: 'Adjust details' },
        { label: 'Saturation', action: 'Adjust color intensity' },
      ],
    },
    {
      title: 'SEO',
      properties: [
        { label: 'Alt Text', action: 'Accessibility & SEO' },
        { label: 'Image Title', action: 'Search optimization' },
      ],
    },
  ],
  video: [
    {
      title: 'Source',
      properties: [
        { label: 'Upload Video', action: 'Use local file' },
        { label: 'YouTube URL', action: 'Embed YouTube' },
        { label: 'Vimeo URL', action: 'Embed Vimeo' },
      ],
    },
    {
      title: 'Controls',
      properties: [
        { label: 'Autoplay', action: 'Start automatically' },
        { label: 'Loop', action: 'Repeat continuously' },
        { label: 'Mute', action: 'Disable sound' },
        { label: 'Controls', action: 'Show player controls' },
      ],
    },
    {
      title: 'Playback',
      properties: [
        { label: 'Start Time', action: 'Start at specific second' },
        { label: 'End Time', action: 'Stop at specific second' },
      ],
    },
  ],
  icon: [
    {
      title: 'Icon Selection',
      properties: [
        { label: 'Icon Picker', action: 'Choose library icon' },
        { label: 'SVG Upload', action: 'Upload custom icon' },
      ],
    },
    {
      title: 'Styling',
      properties: [
        { label: 'Color', action: 'Change icon color' },
        { label: 'Size', action: 'Adjust dimensions' },
        { label: 'Stroke Width', action: 'Adjust outline thickness' },
      ],
    },
  ],
  divider: [
    {
      title: 'Appearance',
      properties: [
        { label: 'Line Style', action: 'Solid, dashed, dotted' },
        { label: 'Thickness', action: 'Line height' },
        { label: 'Width', action: 'Horizontal size' },
        { label: 'Color', action: 'Divider color' },
      ],
    },
  ],
  spacer: [
    {
      title: 'Layout',
      properties: [
        { label: 'Height', action: 'Create vertical space' },
        { label: 'Width', action: 'Create horizontal space' },
      ],
    },
    {
      title: 'Responsive',
      properties: [
        { label: 'Desktop Height', action: 'Desktop spacing' },
        { label: 'Tablet Height', action: 'Tablet spacing' },
        { label: 'Mobile Height', action: 'Mobile spacing' },
      ],
    },
  ],
  container: [
    {
      title: 'Layout',
      properties: [
        { label: 'Width', action: 'Container width' },
        { label: 'Height', action: 'Container height' },
        { label: 'Min Height', action: 'Minimum size' },
        { label: 'Max Width', action: 'Maximum width' },
      ],
    },
    {
      title: 'Flex Layout',
      properties: [
        { label: 'Direction', action: 'Row or column' },
        { label: 'Wrap', action: 'Allow line wrapping' },
        { label: 'Gap', action: 'Space between children' },
        { label: 'Justify Content', action: 'Horizontal alignment' },
        { label: 'Align Items', action: 'Vertical alignment' },
      ],
    },
    {
      title: 'Background',
      properties: [
        { label: 'Color', action: 'Background color' },
        { label: 'Gradient', action: 'Multi-color background' },
        { label: 'Image', action: 'Background image' },
        { label: 'Video', action: 'Background video' },
      ],
    },
    {
      title: 'Effects',
      properties: [
        { label: 'Shadow', action: 'Add depth' },
        { label: 'Blur', action: 'Frosted glass effect' },
        { label: 'Glassmorphism', action: 'Modern glass UI' },
      ],
    },
  ],
  card: [
    {
      title: 'Layout',
      properties: [
        { label: 'Width', action: 'Card width' },
        { label: 'Height', action: 'Card height' },
      ],
    },
    {
      title: 'Styling',
      properties: [
        { label: 'Background', action: 'Card color' },
        { label: 'Border Radius', action: 'Rounded corners' },
        { label: 'Shadow', action: 'Floating effect' },
      ],
    },
    {
      title: 'Hover Effects',
      properties: [
        { label: 'Scale', action: 'Zoom card' },
        { label: 'Lift', action: 'Raise card' },
        { label: 'Tilt', action: '3D effect' },
      ],
    },
  ],
  navbar: [
    {
      title: 'Branding',
      properties: [
        { label: 'Logo Upload', action: 'Brand logo' },
        { label: 'Site Name', action: 'Company name' },
      ],
    },
    {
      title: 'Navigation',
      properties: [
        { label: 'Menu Items', action: 'Navigation links' },
        { label: 'Dropdowns', action: 'Multi-level menus' },
      ],
    },
    {
      title: 'Mobile',
      properties: [
        { label: 'Hamburger Menu', action: 'Mobile navigation' },
        { label: 'Drawer Width', action: 'Mobile menu size' },
      ],
    },
    {
      title: 'Advanced',
      properties: [
        { label: 'Sticky Navbar', action: 'Stay on top while scrolling' },
        { label: 'Transparent Navbar', action: 'Overlay content' },
      ],
    },
  ],
  hero: [
    {
      title: 'Content',
      properties: [
        { label: 'Heading', action: 'Main title' },
        { label: 'Subheading', action: 'Supporting text' },
        { label: 'CTA Button', action: 'Call-to-action button' },
      ],
    },
    {
      title: 'Background',
      properties: [
        { label: 'Color', action: 'Hero background' },
        { label: 'Gradient', action: 'Modern background' },
        { label: 'Image', action: 'Hero image' },
        { label: 'Video', action: 'Hero video' },
      ],
    },
    {
      title: 'Layout',
      properties: [
        { label: 'Center Layout', action: 'Center content' },
        { label: 'Split Layout', action: 'Two-column design' },
        { label: 'Full Width', action: 'Edge-to-edge section' },
      ],
    },
  ],
  footer: [
    {
      title: 'Content',
      properties: [
        { label: 'Logo', action: 'Brand identity' },
        { label: 'Links', action: 'Navigation links' },
        { label: 'Copyright', action: 'Legal information' },
      ],
    },
    {
      title: 'Social',
      properties: [
        { label: 'Social Icons', action: 'Social profiles' },
        { label: 'Social Links', action: 'External destinations' },
      ],
    },
  ],
  text: [ // Map generic text to heading/paragraph properties
    {
      title: 'Typography',
      properties: [
        { label: 'Font Family', action: 'Change font style' },
        { label: 'Font Size', action: 'Adjust text size' },
        { label: 'Font Weight', action: 'Control boldness' },
        { label: 'Text Color', action: 'Change text color' },
      ],
    }
  ],
  rect: [ // Map generic rect to container properties
    {
      title: 'Styling',
      properties: [
        { label: 'Background Color', action: 'Shape color' },
        { label: 'Border Radius', action: 'Rounded corners' },
        { label: 'Width', action: 'Shape width' },
        { label: 'Height', action: 'Shape height' },
      ],
    }
  ],
  'image-placeholder': [
    {
      title: 'Image source',
      properties: [
        { label: 'Upload Image', action: 'Add local image' },
      ]
    }
  ]
};
