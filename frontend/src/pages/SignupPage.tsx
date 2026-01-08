import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useSignup } from '@/hooks/useAuth';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupPage() {
    const navigate = useNavigate();
    const signupMutation = useSignup();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setError(null);
        try {
            await signupMutation.mutateAsync(data);
            navigate('/login', { state: { message: 'Account created! Please log in.' } });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
            setError(message);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />

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
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">INITIATE SEQUENCE</h1>
                        <p className="text-zinc-400">Join the elite. Build the future.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register('name')}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register('email')}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
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
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-zinc-500 uppercase">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    {...register('passwordConfirmation')}
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded px-10 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.passwordConfirmation && <p className="text-red-400 text-xs">{errors.passwordConfirmation.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            variant="primary"
                            disabled={isSubmitting || signupMutation.isPending}
                        >
                            {isSubmitting || signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-500">
                        Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 underline">Log in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
