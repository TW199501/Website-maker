# ShopCraft Studio - Backend API

The Node.js backend serves as the central data orchestrator for ShopCraft Studio. It handles user authentication, persistent storage of complex nested canvas data (projects), and acts as a secure proxy to the Python AI service.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Validation**: express-validator

## 📂 Architecture

- `/controllers/`: Request handlers grouped by domain (auth, projects, chat, publish).
- `/models/`: Mongoose schemas defining the shape of Users, Projects (which store large JSON node maps representing website canvases), and Chat Histories.
- `/routes/`: Express router definitions.
- `/middleware/`: Custom middlewares for JWT verification (`authMiddleware.js`) and error handling.
- `/services/`: Internal business logic and proxy services (e.g., communicating with the `python-ai-service`).

## 🔐 Environment Variables

Create a `.env` file in the root of the backend directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/shopcraft_studio
JWT_SECRET=your_super_secret_jwt_key
PYTHON_AI_SERVICE_URL=http://127.0.0.1:5000
FRONTEND_URL=http://localhost:5173
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start the server with Nodemon for auto-reloading
npm run dev

# Or start normally
npm start
```
