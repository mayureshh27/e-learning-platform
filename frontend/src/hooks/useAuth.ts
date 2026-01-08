import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import type { User, LoginInput, SignupInput } from '@/types/api.types';

// Query Keys
export const authKeys = {
    me: ['auth', 'me'] as const,
};

// Response types matching backend
interface AuthMeResponse {
    status: 'success' | 'error';
    data: {
        user: User;
    };
}

interface LoginResponse {
    status: 'success' | 'error';
    accessToken: string;
}

interface SignupResponse {
    status: 'success' | 'error';
    data: {
        user: User;
        accessToken: string;
    };
}

// Fetch current user
export function useMe() {
    return useQuery({
        queryKey: authKeys.me,
        queryFn: async () => {
            const { data } = await api.get<AuthMeResponse>('/auth/me');
            return data.data.user;
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Login mutation
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: LoginInput) => {
            // First, call login to set cookies
            await api.post<LoginResponse>('/auth/login', input);
            // Then fetch user data
            const { data } = await api.get<AuthMeResponse>('/auth/me');
            return data.data.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.me, user);
        },
    });
}

// Signup mutation
export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SignupInput) => {
            const { data } = await api.post<SignupResponse>('/auth/signup', input);
            return data.data.user;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.me, user);
        },
    });
}

// Logout mutation
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSuccess: () => {
            queryClient.setQueryData(authKeys.me, null);
            queryClient.invalidateQueries({ queryKey: authKeys.me });
        },
    });
}
