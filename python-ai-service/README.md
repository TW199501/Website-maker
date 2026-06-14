# ShopCraft Studio - Python AI Service

This microservice is dedicated entirely to handling complex Artificial Intelligence tasks. By decoupling AI generation from the main Node.js backend, this service can securely manage heavy Python-native libraries, direct LLM SDK interactions, and complex prompt chaining without blocking the main application API.

## 🛠️ Tech Stack

- **Framework**: Flask
- **LLM Integrations**: OpenAI (`openai`), Google Gemini (`google-generativeai`), Anthropic Claude
- **Data Validation**: Pydantic schemas (if applicable)

## 🤖 Capabilities

1. **AI Chat Assistant**: Handles contextual conversations for the ShopCraft AI Assistant on the frontend dashboard.
2. **Context-Aware Generation**: Takes user `projectContext` (Business Name, Target Audience, Design Style) and injects it into system prompts to generate highly personalized website copy and structure recommendations.
3. **Multi-Model Routing**: Supports routing requests to different models (GPT-4, Gemini Pro, Claude) based on user preference or task complexity.

## 🔐 Environment Variables

Create a `.env` file:

```env
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000

# API Keys
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
```

## 🚀 Development

Ensure you have Python 3.10+ installed.

```bash
# Optional: Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask development server
python app.py
```
