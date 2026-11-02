# TaskFlow - Full-Stack MERN To-Do Application

A responsive full-stack task management application built using the MERN stack (MongoDB, Express, React, Node.js), developed strictly according to the provided Figma design and functional specifications.

## 🔗 Live Links & Repository

- **Live Application:** https://crud-task-flow.netlify.app
- **Live Backend API:** https://crud-app-18fc.onrender.com/api
- **GitHub Repository:** https://github.com/amancantgit/CRUD-App

---

## ✨ Features

- **Pixel-Accurate UI:** Recreated from the Figma screens including the Onboarding screen, main dashboard, task creation/edit modal, and deletion confirmation dialog.
- **Weekly Task Tracker:** Mon–Sun horizontal calendar selector with real-time counters for Task Complete, Task Pending, and dynamic Weekly Progress percentage.
- **Full CRUD Functionality:**
  - Create tasks with Title, Time (Start & End), Date, Description, Priority (Low, Medium, High), and Status.
  - Read tasks filtered by selected calendar day or viewed across the whole week.
  - Update existing task details or inline toggle completion status.
  - Delete tasks with a confirmation popup.
- **Search & Filter:** Instant search by task title or description.
- **Responsive Layout:** Optimized for mobile viewports with centered shell on desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Hosting:** Netlify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose
- **Hosting:** Render

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string (or local MongoDB instance)
- Git

### 1. Clone the repository
git clone https://github.com/amancantgit/CRUD-App.git
cd CRUD-App

### 2. Backend Setup
cd backend
npm install

Create a .env file inside backend/:
PORT=5000
MONGODB_URI=your_mongodb_connection_uri

Start the backend development server:
npm run dev
## Server will run at http://localhost:5000

### 3. Frontend Setup
In a new terminal:
cd frontend
npm install

Create a .env file inside frontend/:
VITE_API_URL=http://localhost:5000/api

Start the frontend development server:
npm run dev
## App will open at http://localhost:5173

---

## 👨‍💻 Author

- **Aman**
- GitHub: https://github.com/amancantgit
