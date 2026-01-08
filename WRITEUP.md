# Project Write-up: E-Learning Platform

## Overview
This project is a modern, scalable E-Learning Platform designed to mimic the core functionalities of major ed-tech sites like Udemy or Coursera. It focuses on a premium user experience ("Student Experience") and a powerful, intuitive management interface ("Admin Dashboard").

## Features Built

1.  **Robust Authentication System**:
    -   Implemented a secure, stateless authentication flow using **JWTs** (Access & Refresh tokens).
    -   Secured frontend routes with a custom `PrivateRoute` component that handles role verification (Admin/User).

2.  **Course Content Management (CRUD)**:
    -   **Creation**: Built a streamlined `CreateCourseModal` using `react-hook-form` and `zod` for instant validation.
    -   **Curriculum Editor**: Developed a complex, nested form interface (`CourseEditor`) to handle Courses -> Modules -> Lessons structure. This allows admins to visually organize curriculum.
    -   **Search**: Implemented a responsive search engine with backend **Regex matching** (for partial text search) and frontend **Debouncing** to optimize performance.

3.  **Interactive Learning Experience**:
    -   **Course Player**: A dedicated interface for consuming content, featuring automatic progress tracking, lesson navigation, and a distraction-free "Cinema Mode".
    -   **Progress Tracking**: Percentage-based progress bars calculated dynamically based on completed lessons.

4.  **Admin Dashboard**:
    -   Centralized hub for managing Users, Courses, and Enrollments.
    -   Data tables with sorting and filtering capabilities.

## Challenges Faced

1.  **State Management for Curriculum**:
    -   *Challenge*: Managing a deeply nested structure (Course > Modules > Lessons) in a form was complex.
    -   *Solution*: utilized `react-hook-form`'s `useFieldArray` to handle dynamic adding/removing of modules and lessons while keeping the UI performant and type-safe.

2.  **Search Performance**:
    -   *Challenge*: Real-time search caused excessive API calls and UI flickering.
    -   *Solution*: Implemented a custom `useDebounce` hook (or logic) on the frontend to delay API calls until the user stopped typing, combined with efficient backend indexing (or regex for now).

3.  **UI Consistency**:
    -   *Challenge*: Maintaining a consistent "Dark Mode" aesthetic across varied components.
    -   *Solution*: Centralized colors in `tailwind.config` and `index.css`, enforcing a strict color palette (Zinc & Violet) to ensure a premium look.

## Key Learnings

-   **TanStack Query is Essential**: Handling server state manually (useEffect + useState) is error-prone. Switching to TanStack Query simplified data fetching, caching, and synchronization (especially for the Course Editor).
-   **Schema Validation**: Sharing (or mirroring) Zod schemas between Frontend and Backend ensures that data integrity issues are caught early, before they reach the database.
-   **Type Safety**: TypeScript proved invaluable when refactoring core data structures (like adding `category` or `_id`), automatically highlighting every file that needed updates.

## Future Improvements
-   **Video Streaming**: Integrating Cloudinary or Mux for adaptive bitrate streaming.
-   **Payment Gateway**: Stripe integration for actual course purchases.
-   **Social Features**: Comments and Discussion forums for lessons.
