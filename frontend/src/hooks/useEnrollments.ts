import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { Enrollment, EnrollInput, UpdateProgressInput, ApiResponse, EnrollmentsListResponse } from '@/types/api.types';

// Query Keys
export const enrollmentKeys = {
    all: ['enrollments'] as const,
    mine: ['enrollments', 'me'] as const,
};

// Fetch user's enrollments
export function useMyEnrollments() {
    return useQuery({
        queryKey: enrollmentKeys.mine,
        queryFn: async () => {
            const { data } = await api.get<EnrollmentsListResponse>('/enrollments/me');
            return data.data;
        },
    });
}

// Enroll in a course
export function useEnroll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: EnrollInput) => {
            const { data } = await api.post<ApiResponse<Enrollment>>('/enrollments', input);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine });
        },
    });
}

// Update lesson progress
export function useUpdateProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, lessonId }: UpdateProgressInput & { courseId: string }) => {
            const { data } = await api.put<ApiResponse<Enrollment>>(
                `/enrollments/${courseId}/progress`,
                { lessonId, completed: true }
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine });
        },
    });
}
