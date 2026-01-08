# Backend Implementation Plan - Agent B

**Role**: You are the Backend Agent. Your goal is to build a robust, type-safe, feature-complete API for the E-Learning Platform.
**Stack**: Node.js, Express, TypeScript, MongoDB (Mongoose), Zod, JWT.

## Directives
- **Strict Typing**: No `any`. Use interfaces and Zod schemas for all inputs/outputs.
- **RESTful**: Follow standard REST patterns.
- **Security**: Helmet, CORS (configured for frontend), Rate Limiting, HttpOnly Cookies for Refresh Tokens.
- **Validation**: Validate ALL inputs using Zod middleware before they reach controllers.

## Directory Structure
```
server/
  package.json
  tsconfig.json
  src/
    app.ts          # App setup (middleware, routes)
    server.ts       # Entry point (port listener, db connect)
    config/         # Env vars, DB connection, Constants
    controllers/    # Request handlers (logic)
    middleware/     # Auth, Validation, Error Handling
    models/         # Mongoose Schemas & Types
    routes/         # Express Routes
    services/       # Business logic (optional, keep simple if CRUD)
    utils/          # AppError, CatchAsync, Tokens
    schemas/        # Zod verification schemas
```

## Step-by-Step Execution

### 1. Setup & Calibration
- [ ] Initialize `server` directory with `package.json` and `tsconfig.json`.
- [ ] Install dependencies: `express`, `mongoose`, `cors`, `helmet`, `cookie-parser`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `zod`.
- [ ] Install dev dependencies: `typescript`, `ts-node-dev`, `@types/*`, `eslint`, `prettier`.
- [ ] Configure `tsconfig.json` (strict: true, es2020+).

### 2. Core Infrastructure
- [ ] Create `src/config/db.ts` to connect to MongoDB Atlas.
- [ ] Create `src/utils/AppError.ts` (custom error class) and `src/middleware/errorHandler.ts` (global error handler).
- [ ] Create `src/middleware/validateResource.ts` (Zod middleware).
- [ ] Setup `src/app.ts` with global middlewares (cors, helmet, json, cookies).

### 3. Authentication Module
- [ ] **Schema**: Define Zod schemas for `createUserSchema`, `loginUserSchema`.
- [ ] **Model**: Create `User` model (email, password, name, role: 'user'|'admin'|'instructor', avatar).
- [ ] **Utils**: Create JWT helper (sign access/refresh tokens).
- [ ] **Controller**: Implement `register`, `login` (set refresh cookie), `logout` (clear cookie), `refresh` (issue new access token).
- [ ] **Middleware**: Implement `deserializeUser` (verify access token), `requireUser` (guard).

### 4. Course Management (Core)
- [ ] **Model**: Create `Course` model:
  - `title`, `slug`, `description`, `price`, `thumbnail`, `tags`, `level`, `instructor` (ref User).
  - `modules`: [{ `title`, `lessons`: [{ `title`, `type` (video/text), `content`, `videoUrl`, `duration` }] }]
- [ ] **Controller**: CRUD for courses.
  - `createCourse` (Admin/Instructor only).
  - `getCourse` (Public - exclude sensitive info if needed, or population logic).
  - `updateCourse` (Admin/Instructor).
  - `deleteCourse` (Admin).

### 5. Enrollment & Progress
- [ ] **Model**: Create `Enrollment` model (`user`, `course`, `completedLessons` [ids], `progress` %, `isCompleted`).
- [ ] **Controller**:
  - `enrollUser` (User adds course).
  - `getMyEnrollments` (User sees their list).
  - `updateProgress` (User marks lesson complete -> auto-calc percentage).

### 6. Admin & Advanced Features
- [ ] **Stats**: Endpoint `GET /admin/stats` (total users, total courses, revenue mock).
- [ ] **Search**: Implement search/pagination in `getAllCourses` (query params for filter/sort).
- [ ] **Uploads**: (Optional) Setup file upload route using `multer` (store locally for dev or Cloudinary if env provided).

### 7. Final Polish
- [ ] Seed database with realistic data (use a `seed.ts` script).
- [ ] Verify all routes with Postman/ThunderClient.
