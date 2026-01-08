# Frontend Implementation Plan - Agent A (Premium & Unique)

**Role**: You are the Frontend Agent. Your goal is to build a "Bespoke", "Award-Winning" UI for the E-Learning Platform.
**Avoid**: Generic "Bootstrap/Material" looks, standard "Hero + 3 Cards" layouts, boring dashboard grids.
**Stack**: React, Vite, TypeScript, Tailwind CSS, **TanStack Query (v5)**, Framer Motion, **React Context API**, Lucide React, **React Hook Form**, **TanStack Table**.

## Directives
- **Aesthetic**: **Neo-Brutalism** meets **Glassmorphism**. High contrast typography, subtle noise textures, asymmetrical grid layouts (Bento Grids).
- **Typography**: Use a variable font like `Inter` tighter spacing or `Space Grotesk` for headers.
- **Interactions**: Everything must feel "alive". Hover states, smooth page transitions (AnimatePresence), scroll-triggered reveal animations.
- **Data Fetching**: Use **TanStack Query** for all async state. No raw `useEffect` for fetching.
- **State Management**: Use **React Context + useReducer** for global client state (Auth, Theme). Use TanStack Query for server state.

## Directory Structure
```
client/
  package.json
  vite.config.ts
  src/
    assets/
      fonts/
      textures/     # Noise patterns, blobs
    components/
      ui/           # highly animated, bespoke components
      layout/       # AppShell, immersive navigation
      features/     # CourseGrid, PlayerOverlay
    context/        # React Contexts (AuthContext, ThemeContext)
    hooks/          # useAuth, useCourse, useScrollProgress
    pages/          # Route components
    services/       # API layer (Axios + QueryKeys)
    styles/         # Global css, animations
    types/          # Strict TS interfaces
    utils/
    App.tsx
    main.tsx
```

## Step-by-Step Execution

### 1. Setup & "Vibe" System
- [x] Initialize Vite + React + TS.
- [x] Install: `tailwindcss`, `framer-motion`, `@tanstack/react-query`, `lucide-react`, `clsx`, `react-hook-form`, `zod`.
- [x] **Config Tailwind**:
  - Extend aesthetic: Add custom "noise" background images, specialized box-shadows (e.g., `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` for brutalist touch).
  - Colors: specific highly curated palettes (e.g., Zinc, Electric Violet, Acid Green).
- [x] **Global CSS**: Add smooth scrolling.

### 2. Networking & State
- [x] **Query Client**: Setup `QueryClientProvider` in `main.tsx`.
- [x] **Context Layer**:
  - `AuthContext`: Manage `user` and `isAuthenticated` state.
  - `ThemeContext`: Manage Dark/Light mode.
- [ ] **API Layer**: Create a typed Axios instance.

### 3. Public Pages (Immersive)
- [x] **Landing Page**:
  - **Hero**: Asymmetrical layout, high-end typography.
  - **Marquee**: Infinite scrolling text.
  - **Interactive Bento Grid**: Show features.
- [x] **Course Catalog**:
  - **Filters**: Floating pill-shaped filter bar.
  - **Course Card**: Minimalist, reveal details on hover.

### 4. Auth (Focus on UX)
- [ ] **Login/Signup**:
  - Modal/Drawer based.
  - Success state animations.
  - Use `react-hook-form` + `zod` for validation.

### 5. Learning Experience (Distraction Free)
- [ ] **Course Player**:
  - Cinema Mode.
  - Collapsible Sidebar.
- [ ] **Dashboard**:
  - "Command Center" feel.
  - Heatmap visualization.

### 6. Admin (Power User)
- [ ] **Data Tables**: Use `@tanstack/react-table` for Course/User lists.
- [ ] **Forms**: `react-hook-form` for Course creation.

### 7. Performance & Polish
- [ ] **Optimistic Updates**: Immediate UI feedback.
- [ ] **Transitions**: `framer-motion` layout animations.
