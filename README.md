# BellcorpEvents 🎭

**BellcorpEvents** is a modern event management platform integrated with a powerful, real-time multilingual Voice AI Agent built for booking, managing, and recommending events.

Featuring a beautiful, responsive UI built with React 19 and Tailwind CSS, and a robust Node.js backend integrating Google's `GenAI` for intelligent interactions.

---

## 📸 Screenshots

*(Replace the placeholder URLs with actual paths to your project screenshots)*

### Dashboard Overview
![Dashboard View](https://res.cloudinary.com/dilbdoog3/image/upload/v1773116041/Dashboard_zricpm.png)

### AI Event Assistant
![AI Chatbot Widget](https://res.cloudinary.com/dilbdoog3/image/upload/v1773116041/AIChatBot_dhdcx3.png)

### Discover Events (Dark Mode)
![Dark Mode Events](https://res.cloudinary.com/dilbdoog3/image/upload/v1773116044/DrakModeEvents_zk1seh.png)

### Login/SignUp Page
![Login/SignUp](https://res.cloudinary.com/dilbdoog3/image/upload/v1773116042/loginsignup_hj6hj4.png)

---

## ✨ Features

- **Interactive Event Dashboard**: Browse, filter, and discover upcoming events.
- **Multilingual Voice AI Agent**: Real-time smart assistant for booking appointments and contextual memory across sessions.
- **Fully Responsive Design**: Gorgeous UI tailored for desktop and mobile, with seamless Light/Dark mode toggling.
- **Secure Authentication**: JWT-based login and registration system.
- **Robust Backend**: Built on Express and MongoDB (Mongoose) ensuring scalable data management.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS, Framer Motion (for micro-animations)
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend
- **Environment**: Node.js, Express.js (TypeScript)
- **Database**: MongoDB (Mongoose)
- **AI Integration**: `@google/genai` (Google Gemini API)
- **Auth & Security**: JWT, bcryptjs, CORS

---

## 📂 Project Structure

This project is a monorepo containing both the frontend and backend.

```
bellcorp-events/
├── backend/            # Express server, MongoDB models, API routes
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/           # React 19 Vite application
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
└── package.json        # Root workspace package file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URL)
- A [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Eswar70/bellcorp-events.git
cd bellcorp-events
```

### 2. Environment Variables

Create a `.env` file inside the `backend/` directory by referring to any `.env.example` file, or include the following keys:

```env
# backend/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_genai_api_key
```

### 3. Install Dependencies

You can easily install the dependencies for both the root workspace, frontend, and backend with a single command:

```bash
npm run install-all
```

*(Alternatively, you can run `npm install` inside both the `/frontend` and `/backend` directories manually.)*

### 4. Run the Development Server

To start both the client (Frontend on port `5173`) and the server (Backend on port `5000`) concurrently, run:

```bash
npm start
```

Your browser will automatically open, but if it doesn't, navigate to `http://localhost:5173` to view the application!

---

## 📄 License

This project is licensed under the ISC License. See the `package.json` for more details.
