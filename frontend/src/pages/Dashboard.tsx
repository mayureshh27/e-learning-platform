import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayCircle, Award, Calendar, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMyEnrollments } from '@/hooks/useEnrollments';

export function Dashboard() {
    const { user } = useAuth();
    const { data: enrollments, isLoading } = useMyEnrollments();

    return (
        <div className="min-h-screen bg-zinc-950 pt-32 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Dashboard</h1>
                        <p className="text-zinc-400">Welcome back, <span className="text-white font-bold">{user?.name || 'Learner'}</span>. Continue your training.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono text-zinc-500 uppercase">Enrolled Courses</div>
                            <div className="text-2xl font-bold text-violet-400">{enrollments?.length || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Active Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-xl font-bold font-mono uppercase text-zinc-500 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> In Progress
                        </h2>

                        {isLoading && (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                            </div>
                        )}

                        {!isLoading && enrollments?.length === 0 && (
                            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center">
                                <p className="text-zinc-500 mb-4">You haven't enrolled in any courses yet.</p>
                                <Link to="/courses">
                                    <Button variant="primary">Browse Courses</Button>
                                </Link>
                            </div>
                        )}

                        {!isLoading && enrollments?.map((enrollment) => {
                            const course = typeof enrollment.course === 'object' ? enrollment.course : null;
                            if (!course) return null;

                            return (
                                <motion.div
                                    key={enrollment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-32 bg-violet-600/10 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-all" />

                                    <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                                        <div className="w-full sm:w-48 h-32 bg-zinc-900 rounded-lg border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-bold text-zinc-700">{course.title.slice(0, 8)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <h3 className="text-2xl font-bold text-white">{course.title}</h3>
                                                <span className="text-violet-400 font-mono text-sm">{enrollment.progress}%</span>
                                            </div>
                                            <p className="text-zinc-500 mb-6 text-sm">
                                                {enrollment.completedLessons.length} lessons completed
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${enrollment.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-violet-500"
                                                />
                                            </div>

                                            <Link to={`/player/${course._id}`}>
                                                <Button className="w-full sm:w-auto" variant="primary">
                                                    <PlayCircle className="w-4 h-4 mr-2" /> Resume Learning
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Sidebar: Activity/Stats */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold font-mono uppercase text-zinc-500 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Achievements
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-xl text-center">
                                <div className="w-10 h-10 mx-auto bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mb-2">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-white">Fast Learner</div>
                                <div className="text-xs text-zinc-500">Top 10% Speed</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-xl text-center">
                                <div className="w-10 h-10 mx-auto bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-2">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-white">Consistent</div>
                                <div className="text-xs text-zinc-500">7 Day Streak</div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold mb-4">Activity Map</h3>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 49 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-full aspect-square rounded-sm ${Math.random() > 0.7 ? 'bg-violet-500/80 shadow-[0px_0px_4px_0px_rgba(139,92,246,0.5)]' : 'bg-zinc-800'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
