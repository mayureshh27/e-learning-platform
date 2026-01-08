import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { Course, CreateCourseInput, ApiResponse, CoursesListResponse } from '@/types/api.types';

// Query Keys
export const courseKeys = {
    all: ['courses'] as const,
    list: (filters?: CourseFilters) => [...courseKeys.all, 'list', filters] as const,
    detail: (id: string) => [...courseKeys.all, 'detail', id] as const,
};

export interface CourseFilters {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// Fetch all courses with optional filters
export function useCourses(filters?: CourseFilters) {
    return useQuery({
        queryKey: courseKeys.list(filters),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.category) params.append('category', filters.category);
            if (filters?.level) params.append('level', filters.level);
            if (filters?.search) params.append('search', filters.search);
            if (filters?.page) params.append('page', String(filters.page));
            if (filters?.limit) params.append('limit', String(filters.limit));

            const { data } = await api.get<CoursesListResponse>(`/courses?${params.toString()}`);
            return data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

// Fetch single course by ID
export function useCourse(id: string) {
    return useQuery({
        queryKey: courseKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

// Create course mutation (admin)
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateCourseInput) => {
            const { data } = await api.post<ApiResponse<Course>>('/courses', input);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
        },
    });
}

// Update course mutation (admin)
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: CreateCourseInput & { id: string }) => {
            const { data } = await api.put<ApiResponse<Course>>(`/courses/${id}`, input);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
        },
    });
}

// Delete course mutation (admin)
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/courses/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.all });
        },
    });
}
