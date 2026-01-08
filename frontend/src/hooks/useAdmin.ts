import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { User, Enrollment, CoursesListResponse } from '@/types/api.types';

// Response types for admin endpoints
interface UsersListResponse {
    status: 'success';
    results: number;
    data: User[];
}

interface AdminEnrollmentsResponse {
    status: 'success';
    results: number;
    data: Enrollment[];
}

interface ReportsResponse {
    status: 'success';
    data: {
        totalUsers: number;
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
    };
}

// Query Keys
export const adminKeys = {
    all: ['admin'] as const,
    users: ['admin', 'users'] as const,
    enrollments: ['admin', 'enrollments'] as const,
    reports: ['admin', 'reports'] as const,
    courses: ['admin', 'courses'] as const,
};

// Fetch all users (Admin only)
export function useAdminUsers() {
    return useQuery({
        queryKey: adminKeys.users,
        queryFn: async () => {
            const { data } = await api.get<UsersListResponse>('/admin/users');
            return data.data;
        },
    });
}

// Fetch all enrollments (Admin only)
export function useAdminEnrollments() {
    return useQuery({
        queryKey: adminKeys.enrollments,
        queryFn: async () => {
            const { data } = await api.get<AdminEnrollmentsResponse>('/admin/enrollments');
            return data.data;
        },
    });
}

// Fetch reports (Admin only)
export function useAdminReports() {
    return useQuery({
        queryKey: adminKeys.reports,
        queryFn: async () => {
            const { data } = await api.get<ReportsResponse>('/admin/reports');
            return data.data;
        },
    });
}

// Fetch all courses for admin management
export function useAdminCourses() {
    return useQuery({
        queryKey: adminKeys.courses,
        queryFn: async () => {
            const { data } = await api.get<CoursesListResponse>('/courses');
            return data.data;
        },
    });
}
