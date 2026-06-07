# Project Management Frontend

A React-based admin panel for managing projects, developers, and tasks with role-based access control.

## Tech Stack

- **Framework:** React 18 (Create React App)
- **UI:** Material-UI 5, Bootstrap 5, Emotion
- **Routing:** React Router 6
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Build Tool:** react-scripts 5

## Prerequisites

- Node.js 14+
- npm or yarn

## Getting Started

```bash
npm install
npm start
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend API base URL |

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start development server |
| `npm run build` | Create production build |

## Project Structure

```
src/
  api/          # Axios instance and API endpoint definitions
  components/   # Shared components (Layout, Charts, ProtectedRoute)
  context/      # AuthContext (authentication state management)
  pages/        # Route-level page components
    Login.js        # Login page
    Dashboard.js    # Admin dashboard with stats and charts
    Projects.js     # Project CRUD management
    Developers.js   # Developer CRUD management
    Tasks.js        # Admin task management
    MyTasks.js      # Developer task view
```

## Features

- **Admin Dashboard** — statistics cards, pie/bar charts, recent projects, task overview
- **CRUD Operations** — full create, read, update, delete for projects, developers, and tasks
- **Role-Based Access** — admin and developer roles with route protection
- **Developer View** — developers can view and update their assigned tasks
- **JWT Authentication** — secure login with token-based session management

## Authentication

- **Admins** log in with their username
- **Developers** log in with their email
- JWT tokens are stored in `localStorage` and sent via Axios interceptors

## API

The frontend expects a backend API at the configured `REACT_APP_API_URL` (default `http://localhost:8000`), exposing endpoints for auth, admin CRUD, and developer task management.
