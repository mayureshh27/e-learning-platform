# E-Learning Platform

A full-stack, comprehensive E-Learning application allowing users to browse, purchase, and learn from video courses, while administrators manage content dynamic curriculum tools.

## Tech Stack

### Frontend
- **React (Vite)**: Fast, modern UI library.
- **TypeScript**: Type safety and developer experience.
- **Tailwind CSS**: Utility-first styling for a premium, responsive design.
- **TanStack Query (React Query)**: Powerful server state management and caching.
- **React Router DOM**: Client-side routing with protected routes.
- **Framer Motion**: Smooth animations and transitions.
- **React Hook Form + Zod**: Robust form handling and validation.
- **Lucide React**: Beautiful icons.

### Backend
- **Node.js**: Runtime environment.
- **Express**: Web server framework.
- **MongoDB + Mongoose**: NoSQL database for flexible data modeling (Courses, Users, Enrollments).
- **JWT (JSON Web Tokens)**: Secure stateless authentication with Access/Refresh token rotation.
- **Helmet & CORS**: Security headers and cross-origin sharing.

## Features

### 🎓 Student Experience
- **Course Catalog**: Filterable and searchable course list (Debounced search, Categories).
- **Course Player**: Immersive video player with sidebar navigation, progress tracking, and "Cinema Mode".
- **Dashboard**: Track enrolled courses and learning progress.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.

### 🛡️ Admin Dashboard
- **Analytics**: Overview of total users, enrollments, and completion rates.
- **Course Management**:
    - **Create Course**: Modal-based quick creation.
    - **Course Editor**: Comprehensive editor for managing Course Details and Curriculum (Modules & Lessons).
- **User Management**: View and manage platform users (Role-based).
- **Enrollment Management**: Track and manage student enrollments.

### 🔐 Security & Core
- **Authentication**: JWT-based login/signup with secure cookie handling.
- **RBAC**: Role-Based Access Control (Admin vs. User routes).
- **Secure API**: Input validation with Zod on both client and server.

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Instance (Local or Atlas)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/mayureshh27/e-learning-platform.git
    cd e-learning-platform
    ```

2.  **Install dependencies** (Root, Frontend, Backend):
    ```bash
    # Install root dependencies (if any)
    npm install

    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../server
    npm install
    ```

3.  **Environment Setup**:
    - Create `frontend/.env` and `server/.env`.
    - Reference `DEPLOYMENT.md` for required variables.

4.  **Run Development Servers**:
    ```bash
    # Terminal 1 (Backend)
    cd server
    npm run dev

    # Terminal 2 (Frontend)
    cd frontend
    npm run dev
    ```

## Project Structure

- `/frontend`: React application (SPA)
- `/server`: Express API server
- `/deployment_guide.md`: Detailed deployment instructions
