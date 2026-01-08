import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Demo credentials
const DEMO_ACCOUNTS = {
    admin: { email: 'admin@example.com', password: 'password123', label: 'Admin', icon: Shield },
    user: { email: 'user@example.com', password: 'password123', label: 'User', icon: User },
};

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoggingIn(true);
        try {
            const user = await login(data);
            if (user) {
                navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleDemoLogin = async (type: 'admin' | 'user') => {
        const account = DEMO_ACCOUNTS[type];
        setValue('email', account.email);
        setValue('password', account.password);

        setError(null);
        setIsLoggingIn(true);
        try {
            const user = await login({ email: account.email, password: account.password });
            if (user) {
                navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Demo login failed.';
            setError(message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background noise/gradient */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Link to="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 neo-brutalist bg-zinc-900/50">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">WELCOME BACK</h1>
                        <p className="text-zinc-400">Enter your credentials to access the terminal.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Demo Login Buttons */}
                    <div className="mb-6">
                        <p className="text-xs font-mono text-zinc-500 uppercase mb-3 text-center">Quick Demo Access</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                disabled={isLoggingIn || isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-400 hover:bg-violet-600/30 hover:text-violet-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Shield className="w-4 h-4" />
                                <span className="font-medium text-sm">Admin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('user')}
                                disabled={isLoggingIn || isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <User className="w-4 h-4" />
                                <span className="font-medium text-sm">User</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-zinc-900/50 px-2 text-zinc-500 font-mono uppercase">or login manually</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register('email')}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-700"
                                    placeholder="neo@matrix.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            variant="primary"
                            disabled={isSubmitting || isLoggingIn}
                        >
                            {isSubmitting || isLoggingIn ? 'Authenticating...' : 'Log In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-500">
                        Don't have an account? <Link to="/signup" className="text-violet-400 hover:text-violet-300 underline">Sign up</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
