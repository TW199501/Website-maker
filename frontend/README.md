# ShopCraft Studio - Frontend

The frontend application for ShopCraft Studio is a highly interactive, complex Single Page Application (SPA) designed to replicate the feel of native design tools (like Figma or Webflow) entirely in the browser.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion for micro-animations and transitions
- **State Management**: Zustand (modular stores for Builder, UI, Auth, and Projects)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Drag & Drop**: Native HTML5 Drag and Drop API

## 📂 Architecture & Directories

- `/src/components/builder/`: The core of the application. Contains the visual canvas, floating toolbars, responsive right-side property panels, and drag-and-drop components used in the Website Builder.
- `/src/components/dashboard/`: Contains the user dashboard, project management grids, and the ShopCraft AI Assistant chat interface.
- `/src/components/common/`: Reusable global UI components like the Navbar and Sidebar.
- `/src/context/`: React Context providers for Auth, Projects, and UI state that don't require the high-frequency updates of Zustand.
- `/src/store/`: Zustand stores. `builderStore.js` is particularly critical as it manages the real-time state of the visual canvas nodes.
- `/src/services/`: API wrappers for communicating with the Node.js backend.

## 🚀 Development

```bash
# Install dependencies
npm install

# Start the development server with Hot Module Replacement (HMR)
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

The platform uses a strict dark-mode-first aesthetic with a focus on glassmorphism (`backdrop-blur`), soft shadows, and deep indigo/violet gradients. Tailwind is used extensively, and custom utility classes are defined in `index.css` (e.g., `.hover-lift`, `.glass-panel`).
