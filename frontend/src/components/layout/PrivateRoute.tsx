import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
    role?: 'user' | 'admin' | 'instructor';
}

export function PrivateRoute({ role }: PrivateRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // In a real app we would have a loading spinner here
        return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        // Role based access control
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
