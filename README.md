# ⚡ FlowDesk — Team Task Manager

> A modern, full-stack team task management application with a dark, editorial aesthetic.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![Express](https://img.shields.io/badge/Express-4-black)](https://expressjs.com/)

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