# E-Learning Platform

[![CI/CD](https://github.com/mayureshh27/e-learning-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/mayureshh27/e-learning-platform/actions/workflows/ci.yml)

A modern, full-stack E-Learning platform with video streaming, real-time progress tracking, and comprehensive admin tools.

## ✨ Features

### 🎓 Student Experience
- **Course Catalog**: Browse courses with search, filters, and pagination
- **Free Previews**: Watch free lessons before enrolling
- **Video Streaming**: HLS adaptive streaming via Cloudinary
- **Progress Tracking**: Real-time completion tracking with achievements
- **Activity Heat Map**: Visual calendar showing learning activity
- **Responsive Design**: Optimized for all devices

### 🛡️ Admin Dashboard
- **Course Management**: Create, edit, and manage courses with drag-drop media uploads
- **Draft Control**: Toggle publish state and filter courses by status/visibility
- **Advanced Sorting**: Sort content by lesson count, date, or popularity
- **User Management**: View and manage platform users
- **Analytics**: Platform-wide statistics and insights

### 🔐 Security & Core
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Role-Based Access**: Admin, Instructor, and Student roles
- **Input Validation**: Zod schemas on client and server
- **TypeScript**: Strict typing across the entire stack

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite** - Fast, modern development
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **HLS.js** - Video streaming

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Media storage and streaming
- **Pino** - Structured logging
- **Jest** - Testing framework

## 📦 Quick Start

### Prerequisites
- Node.js v18+ or Bun
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mayureshh27/e-learning-platform.git
   cd e-learning-platform
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   bun install

   # Frontend
   cd ../frontend
   bun install
   ```

3. **Environment Setup**:

   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/elearning
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

4. **Seed the database** (optional):
   ```bash
   cd backend
   bun run ts-node src/seed.ts
   # Or for Design Patterns course:
   bun run ts-node src/seedDesignPatterns.ts
   ```

5. **Run development servers**:
   ```bash
   # Terminal 1 (Backend)
   cd backend
   bun run dev

   # Terminal 2 (Frontend)
   cd frontend
   bun run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 🧪 Testing

```bash
# Backend tests
cd backend
bun run test

# Frontend build
cd frontend
bun run build
```

## 📁 Project Structure

```
e-learning-platform/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── modules/         # Feature modules (auth, course, etc.)
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Helper functions
│   │   └── __tests__/       # Jest tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # TanStack Query hooks
│   │   ├── context/         # React context
│   │   └── types/           # TypeScript types
│   └── package.json
└── .github/
    └── workflows/
        └── ci.yml           # CI/CD pipeline
```

## 🔄 CI/CD

GitHub Actions automatically runs tests on every push and pull request:
- Backend TypeScript type checking
- Backend Jest tests (20 tests)
- Frontend TypeScript type checking
- Frontend production build

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - List courses (with pagination)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my` - Get user's enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

### Media
- `POST /api/upload/signature/image` - Get upload signature
- `POST /api/upload/signature/video` - Get video upload signature (admin)
- `GET /api/upload/video/:courseId/:lessonId` - Get signed video URL

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Media: Cloudinary

## 📝 License

MIT

## 👤 Author

**Mayuresh**
- GitHub: [@mayureshh27](https://github.com/mayureshh27)

## 🙏 Acknowledgments

- Design inspiration from modern e-learning platforms
- Icons by [Lucide](https://lucide.dev/)
- Video streaming powered by [Cloudinary](https://cloudinary.com/)
