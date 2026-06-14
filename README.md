# ShopCraft Studio

**ShopCraft Studio** is an AI-powered, professional no-code creative platform designed for modern makers and agencies. It provides a comprehensive suite of visual tools to build websites, craft 2D designs, produce animations, and generate 3D models—all accelerated by artificial intelligence.

## 🚀 Features

- **Website Builder**: A professional-grade, no-code visual editor for building responsive websites with drag-and-drop components, advanced styling, and built-in AI copywriting.
- **2D Design Studio**: Create posters, social media graphics, and marketing materials.
- **Animation Builder**: Keyframe-based animation timelines and Lottie integrations.
- **3D Modeling**: Build and embed 3D assets directly into your digital projects.
- **ShopCraft AI Assistant**: A dedicated AI chat companion that helps generate content, suggest designs, and plan business strategies.

## 🏗️ System Architecture

The platform operates as a modern microservices stack:

1. **Frontend (`/frontend`)**: A high-performance React SPA powered by Vite, Tailwind CSS, and Zustand. Handles the complex visual canvas interfaces.
2. **Backend API (`/backend`)**: A robust Node.js/Express REST API backed by MongoDB. Handles user authentication, project storage, publishing logic, and API orchestration.
3. **Python AI Service (`/python-ai-service`)**: A dedicated Flask service that handles all heavy lifting for AI generation, interfacing with LLMs (OpenAI GPT, Google Gemini, Anthropic Claude) to generate design schemas, website copy, and chat responses.

## 🛠️ Quick Start

To run the entire platform locally, you will need to start all three services. Ensure you have Node.js (v18+), Python (3.10+), and MongoDB running locally or accessible via URI.

### 1. Database & AI Service
```bash
cd python-ai-service
pip install -r requirements.txt
# Configure your .env with LLM API keys
python app.py
# Runs on http://127.0.0.1:5000
```

### 2. Node Backend
```bash
cd backend
npm install
# Configure your .env with MongoDB URI, JWT Secret, and Python Service URL
npm run dev
# Runs on http://localhost:5001
```

### 3. React Frontend
```bash
cd frontend
npm install
# Configure your .env with the Node Backend URL
npm run dev
# Runs on http://localhost:5173
```

## 📄 License

This project is proprietary and confidential.
