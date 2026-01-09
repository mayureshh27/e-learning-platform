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
    -   **Search**: Implemented a responsive search engine with backend regex matching and frontend debouncing.
    -   **Draft Management**: Admins can now filter draft courses and manage visibility, ensuring only polished content is public.

3.  **Interactive Learning Experience**:
    -   **Course Player**: A dedicated interface for consuming content, featuring automatic progress tracking and lesson navigation.
    -   **Video Streaming**: Integrated **Cloudinary** for HLS adaptive bitrate streaming, ensuring smooth playback across devices.
    -   **Progress Tracking**: Real-time progress bars and "Activity Heatmap" (GitHub-style) to visualize daily learning streaks.

4.  **Admin Dashboard**:
    -   Centralized hub for managing Users, Courses, and Enrollments.
    -   **Sorting & Filtering**: Added advanced filtering (published/draft) and sorting (by content length, date).
    -   **Pagination**: Full pagination support for scaling to thousands of courses.

5.  **DevOps & Infrastructure**:
    -   **CI/CD Pipeline**: GitHub Actions workflow running backend/frontend type-checks and Jest tests (with MongoDB service) on every push.
    -   **Environment Security**: Strict environment variable validation using Zod.

## Challenges Faced

1.  **Video Streaming Integration**:
    -   *Challenge*: Serving large video files directly from Node.js was inefficient and couldn't handle adaptive quality.
    -   *Solution*: Integrated Cloudinary for offloading video processing and delivery via HLS, significantly improving user experience.

2.  **CI/CD Database Testing**:
    -   *Challenge*: CI tests failed because they couldn't connect to a database, and parallel execution caused race conditions.
    -   *Solution*: Added a MongoDB service container to the GitHub Actions workflow and enforced sequential test execution (`--runInBand`) to ensure stability.

3.  **Complex State Management**:
    -   *Challenge*: Syncing the "Course Editor" state (nested arrays) with the backend and handling optimistic updates.
    -   *Solution*: Leveraged TanStack Query's cache invalidation to automatically refresh the dashboard upon mutations, eliminating manual state management bugs.

## Key Learnings

-   **TanStack Query is Essential**: Handling server state manually (useEffect + useState) is error-prone. Switching to TanStack Query simplified data fetching, caching, and synchronization.
-   **Schema Validation**: Sharing Zod schemas between Frontend and Backend ensures that data integrity issues are caught early.
-   **Automated Testing**: Setting up a proper CI pipeline early saves massive amounts of time by catching regressions (like broken imports or type errors) before deployment.
-   **HLS Streaming**: Learned the importance of adaptive streaming for media-heavy applications compared to simple progressive download.

## Future Improvements
-   **Payment Gateway**: Stripe integration for actual course purchases.
-   **Social Features**: Comments and Discussion forums for lessons.
-   **Mobile App**: React Native mobile application reusing the existing backend.
