# Deployment Guide

This guide details how to deploy the E-Learning Platform (Frontend + Backend) to production.

## Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** account (or any MongoDB provider)
- **Vercel** account (recommended for Frontend)
- **Render / Railway / Heroku** account (recommended for Backend)

## 1. Database Setup (MongoDB Atlas)

1.  Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a database user (e.g., `admin`).
3.  Whitelist your IP (or `0.0.0.0/0` for cloud deployment).
4.  Get the connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`.

## 2. Environment Variables

You must set these environment variables in your deployment platforms.

### Backend (`server/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port to run on | `5000` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for Access Tokens | `long-random-string` |
| `JWT_REFRESH_SECRET` | Secret for Refresh Tokens | `another-long-random-string` |
| `NODE_ENV` | Environment | `production` |
| `CLIENT_URL` | URL of deployed frontend | `https://my-app.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL of deployed backend | `https://my-api.onrender.com/api` |

## 3. Backend Deployment (Render.com Example)

1.  Push your code to GitHub.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  **Root Directory**: `server` (Important: monorepo setup)
5.  **Build Command**: `npm install && npm run build`
6.  **Start Command**: `npm start`
7.  **Environment Variables**: Add all variables listed above.
8.  Deploy.

## 4. Frontend Deployment (Vercel Example)

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  **Root Directory**: `frontend`
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**: Add `VITE_API_URL`.
7.  Deploy.

## 5. First Admin Setup

After deployment, the database will be empty. You need to create an Admin user to access the dashboard.

**Option A: Run Seed Script (Locally)**
You can run the seed script locally but point it to the production database.
1.  Update local `.env` with production `MONGODB_URI`.
2.  Run `npm run seed` in `server` directory.
3.  This creates: `admin@example.com` / `password123`.

**Option B: Manual APIs**
1.  Sign up a new user via the Frontend `/signup`.
2.  Manually update the user's `role` to `admin` in MongoDB Atlas collection `users`.

## 6. Verification

1.  Open Frontend URL.
2.  Login with Admin credentials.
3.  Go to Dashboard -> Admin.
4.  Verify you can Create Course (Search users, etc.).

## 7. Important Notes

- **CORS**: Ensure `CLIENT_URL` in backend matches your Frontend URL exactly (no trailing slash usually, checking code logic).
- **Security**: Change the default admin password immediately if using seed.
