# ⚡ FlowDesk — Team Task Manager

> A modern, full-stack team task management application with a dark, editorial aesthetic.

**Built with:** React · Node.js · Express · MongoDB · Tailwind CSS · Framer Motion

---

## 🎯 Overview

Team Task Manager is a collaborative project management app where teams can organize, assign, and track tasks efficiently. It features a Kanban board, role-based access control, real-time dashboard analytics, and a beautiful dark UI.

**Key Highlights:**
- 🔐 JWT Authentication with 7-day expiry
- 📊 Interactive Dashboard with Charts
- 📋 Kanban Board (To Do / In Progress / Done)
- 👥 Role-Based Access Control (Admin / Member)
- 🎨 Dark Editorial Aesthetic UI
- ⚡ Real-time Task Status Updates
- 📱 Responsive Design

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekSharma9161/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Seed Demo Data (Optional)

```bash
cd backend
npm run seed
```

### 5. Run the App

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Visit **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role   | Email            | Password    |
|--------|------------------|-------------|
| Admin  | admin@demo.com   | password123 |
| Member | jordan@demo.com  | password123 |
| Member | riley@demo.com   | password123 |

---

## 📁 Project Structure

team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── dashboard.js
│   │   │   └── users.js
│   │   ├── utils/
│   │   │   └── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
├── src/
│   ├── components/ui/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   └── TaskDetailPage.jsx
│   ├── store/
│   │   └── authStore.js
│   ├── utils/
│   │   └── api.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json


---

## 📚 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PATCH | `/api/projects/:id` | Update project (admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |
| POST | `/api/projects/:id/members` | Add member (admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:pid/tasks` | Get project tasks |
| POST | `/api/projects/:pid/tasks` | Create task (admin) |
| GET | `/api/projects/:pid/tasks/:tid` | Get task details |
| PATCH | `/api/projects/:pid/tasks/:tid` | Update task |
| DELETE | `/api/projects/:pid/tasks/:tid` | Delete task (admin) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get stats and chart data |

---

## ✨ Features

### Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| Create / delete projects | ✅ | ❌ |
| Add / remove members | ✅ | ❌ |
| Create / delete tasks | ✅ | ❌ |
| Update any task | ✅ | ❌ |
| Update assigned task status | ✅ | ✅ |
| View project tasks | All | Assigned only |
| View dashboard | ✅ | ✅ |

---

## 🛠 Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 18 | UI library |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Charts |
| TanStack Query | Server state |
| Zustand | Client state |
| React Router v6 | Routing |
| Axios | HTTP client |

### Backend
| Library | Purpose |
|---------|---------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |

---

## 🚀 Deployment

### Backend (Render)


## 👨‍💻 Author

**Abhishek Sharma**
- GitHub: [@AbhishekSharma9161](https://github.com/AbhishekSharma9161)

---

⭐ If you find this helpful, please give it a star!
