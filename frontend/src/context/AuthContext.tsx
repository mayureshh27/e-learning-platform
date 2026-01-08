import { createContext, useContext, type ReactNode } from 'react';
import { useMe, useLogin, useLogout } from '@/hooks/useAuth';
import type { User, LoginInput } from '@/types/api.types';

interface AuthContextType {
    user: User | null | undefined;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (input: LoginInput) => Promise<User | undefined>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: user, isLoading, isError } = useMe();
    const loginMutation = useLogin();
    const logoutMutation = useLogout();

    const login = async (input: LoginInput): Promise<User | undefined> => {
        return loginMutation.mutateAsync(input);
    };

    const logout = async (): Promise<void> => {
        return logoutMutation.mutateAsync();
    };

    const isAuthenticated = !!user && !isError;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// Re-export User type for convenience
export type { User };
