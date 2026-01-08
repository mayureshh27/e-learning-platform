Project 2
E-Learning Platform (Intermediate → Advanced)
1) Purpose
A more complete product-level app suitable for portfolios: course browsing, user authentication, enrollment, progress tracking, admin controls, and deployment. Demonstrates system design, security, and real world features.
2) Tech stack
● Frontend: React (Vite) with React Router; optional state library (Context or Redux) and tanstack query
● Styling: Tailwind CSS or CSS modules
● Backend: Node.js + Express
● Database: MongoDB Atlas
● Auth: JWT (access + optional refresh) or sessions with secure cookies
● Storage: Cloud (optional) for course thumbnails (S3-compatible or Cloudinary)
● Deployment: Frontend → Vercel; Backend → Render / Heroku; DB → MongoDB Atlas
● Testing: Jest + React Testing Library (basic tests)
3) Core features (must-haves)
Public
● Landing page (marketing copy)
● Course listing with filters (category, difficulty, price)
● Course detail page (overview, syllabus, instructor)
User
● Signup / Login (JWT)
● User dashboard: enrolled courses, progress (lessons completed)
● Enroll in course (POST enrollment)
● View modules/lessons (simple content pages)
Admin (basic)
● Create / Edit / Delete courses (admin-only)
● View user list and enrollments
Backoffice / API
● CRUD for courses
● Auth routes (signup/login)
● Enrollment endpoints
● Progress tracking endpoints
4) Data models (MongoDB)
User
{
_id,
name,
email,
passwordHash,
role: 'user' | 'admin',
createdAt
}
Course
{
_id,
title,
slug,
description,
price,
category,
difficulty,
thumbnailUrl,
lessons: [
{ title, contentHtml, videoUrl?, order }
],
createdAt
}
Enrollment
{
_id,
userId,
courseId,
progress: { lessonId: Boolean }, // or percentage
enrolledAt
}
Review (optional)
{ userId, courseId, rating, comment }
5) API endpoints (core)
Auth
● POST /api/auth/signup
● POST /api/auth/login → returns JWT
● GET /api/auth/me → protected
Courses
● GET /api/courses — list with optional query ?category=&?search=
● GET /api/courses/:id
● POST /api/courses — admin
● PUT /api/courses/:id — admin
● DELETE /api/courses/:id — admin
Enrollments
● POST /api/enroll — enroll user
● GET /api/enrollments/me — user’s enrollments
● PUT /api/enrollments/:id/progress — update progress
Admin
● GET /api/users — admin only
● GET /api/reports — simple metrics (optional)
6) Frontend component & route breakdown
● Routes:
○ / — Landing
○ /courses — Course listing
○ /courses/:slug — Course detail
○ /login, /signup
○ /dashboard — user dashboard
○ /admin — admin panel (protected)
● Components:
○ Header, Footer, CourseCard, CourseList, CourseDetail, LessonPlayer, AuthForm, Dashboard, AdminPanel, PrivateRoute (auth guard), Pagination, FilterBar, EnrollmentButton
7) UX flows
● Visitor browses courses → clicks course → sees details → clicks Enroll → prompted to login/signup → enrollment success → appears in Dashboard.
● Admin logs in → can add a course through a form (title, description, lessons) → course visible publicly.
8) Security & best practices
● Hash passwords with bcrypt.
● Use JWT with expiry; store token in httpOnly cookie or localStorage (httpOnly recommended).
● Protect admin routes with role middleware.
● Validate inputs (server-side & client-side).
● Store secrets in .env and provide env.example.
9) Deployment & CI
● Frontend: Vercel — connect GitHub repo, set env vars for API base URL.
● Backend: Render or Heroku — set env vars (MONGO_URI, JWT_SECRET).
● MongoDB: Atlas cluster — whitelist servers if needed.
● Optional: CI via GitHub Actions to run tests on PR.
10) Tests & QA
● Unit test for one frontend component (renders list) — React Testing Library.
● Simple API test for auth or courses using Jest + supertest (optional).
● Manual end-to-end validation: signup, enroll, view dashboard.
11) Timeline & milestones (4–6 weeks recommended)
If used as a month-long internship capstone, break same as sprints:
Week 1 (Design & Backend scaffold)
● Project scaffolding, DB schema, basic auth
Week 2 (Core backend & course CRUD)
● Full courses API, seed sample data
Week 3 (Frontend listing & detail + auth)
● Frontend routes, auth flows, enroll flow
Week 4 (Dashboard & admin + polishing)
● Dashboard, progress tracking, responsive polish, deploy
(Stretch weeks add payments, video hosting, analytics)
12) Deliverables
● Two GitHub repos or single monorepo with frontend/ and backend/ directories.
● README(s) including tech stack, instructions, and feature list.
● Deployed frontend URL (Vercel) and backend URL (Render).
● Short demo video or 3 screenshots (desktop, mobile, dashboard).
● Short write-up: features built, challenges, what you learned.
13) Grading rubric (suggested)
● Core functionality (auth, enroll, course CRUD): 40%
● UX & responsiveness: 20%
● Security & backend structure: 15%
● Tests & code quality: 10%
● Documentation & deployment: 10%
● Bonus features: 5%
14) Stretch goals & extensions
● Payment integration (test mode) to simulate paid courses.
● Admin analytics dashboard (enrollment counts, active users).
● Video streaming (AWS S3 + signed URLs).
● Recommendation engine: suggest courses based on enrolled categories.