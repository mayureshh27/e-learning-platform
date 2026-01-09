// API Response Types - aligned with backend models

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'instructor';
    avatar?: string;
    avatarPublicId?: string; // Cloudinary public_id
    createdAt: string;
}

export interface Lesson {
    _id?: string;
    title: string;
    type: 'video' | 'text';
    content?: string;
    videoUrl?: string;
    videoPublicId?: string; // Cloudinary public_id for video
    duration?: number;
    isFree?: boolean;
}

export interface Module {
    _id?: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    thumbnail: string;
    thumbnailPublicId?: string; // Cloudinary public_id for thumbnail
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    instructor: User | string; // Can be populated or just ID
    modules: Module[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Enrollment {
    _id: string;
    user: string;
    course: Course | string;
    completedLessons: string[];
    progress: number;
    isCompleted: boolean;
    enrolledAt: string;
}

// Request Types
export interface LoginInput {
    email: string;
    password: string;
}

export interface SignupInput {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface CreateCourseInput {
    title: string;
    description: string;
    price: number;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
    modules?: Module[];
    isPublished?: boolean;
}

export interface EnrollInput {
    courseId: string;
}

export interface UpdateProgressInput {
    lessonId: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

// Pagination metadata
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Actual backend response for courses list
export interface CoursesListResponse {
    status: 'success';
    results: number;
    data: Course[];
    pagination?: PaginationMeta;
}

// Actual backend response for enrollments list
export interface EnrollmentsListResponse {
    status: 'success';
    results: number;
    data: Enrollment[];
}

// Legacy - keeping for backwards compatibility
export interface PaginatedResponse<T> {
    status: 'success';
    data: T[];
    total: number;
    page: number;
    limit: number;
}
