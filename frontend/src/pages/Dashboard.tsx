import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlayCircle, Award, Calendar, Activity, Loader2, Trophy, Target, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMyEnrollments } from '@/hooks/useEnrollments';
import { useMemo } from 'react';

interface Achievement {
    icon: any;
    title: string;
    description: string;
    color: 'emerald' | 'yellow' | 'violet' | 'blue';
}

// Helper to calculate achievements based on real user data
function calculateAchievements(enrollments: any[]): Achievement[] {
    const achievements: Achievement[] = [];

    if (!enrollments || enrollments.length === 0) return achievements;

    // Calculate total lessons completed across all courses
    const totalCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);

    // Calculate average progress
    const avgProgress = enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length;

    // Achievement 1: First Steps (Complete 1+ lessons)
    if (totalCompleted >= 1) {
        achievements.push({
            icon: Target,
            title: 'First Steps',
            description: `${totalCompleted} lesson${totalCompleted > 1 ? 's' : ''} completed`,
            color: 'emerald',
        });
    }

    // Achievement 2: Fast Learner (50%+ average progress)
    if (avgProgress >= 50) {
        achievements.push({
            icon: Zap,
            title: 'Fast Learner',
            description: `${Math.round(avgProgress)}% avg progress`,
            color: 'yellow',
        });
    }

    // Achievement 3: Course Master (100% completion on any course)
    const completedCourses = enrollments.filter(e => e.isCompleted).length;
    if (completedCourses > 0) {
        achievements.push({
            icon: Trophy,
            title: 'Course Master',
            description: `${completedCourses} course${completedCourses > 1 ? 's' : ''} completed`,
            color: 'violet',
        });
    }

    // Achievement 4: Dedicated Learner (3+ courses enrolled)
    if (enrollments.length >= 3) {
        achievements.push({
            icon: Award,
            title: 'Dedicated Learner',
            description: `${enrollments.length} courses enrolled`,
            color: 'blue',
        });
    }

    return achievements;
}

interface ActivityDay {
    date: string;
    count: number;
    intensity: number;
}

// Helper to generate activity heat map from enrollment data
function generateActivityMap(enrollments: any[]): ActivityDay[] {
    const today = new Date();
    const activityMap: Record<string, number> = {};

    // Get last 49 days (7x7 grid)
    const days: string[] = [];
    for (let i = 48; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        days.push(dateStr);
        activityMap[dateStr] = 0;
    }

    // Count activities per day based on enrollment dates and completion
    enrollments?.forEach(enrollment => {
        // Mark enrollment date
        const enrollDate = new Date(enrollment.enrolledAt).toISOString().split('T')[0];
        if (activityMap[enrollDate] !== undefined) {
            activityMap[enrollDate] += 1;
        }

        // For completed lessons, we'd need timestamps, but we can estimate based on progress
        // This is a simplified version - ideally you'd track lesson completion timestamps
        if (enrollment.completedLessons.length > 0) {
            // Distribute completed lessons across recent days as an estimate
            const recentDays = days.slice(-14); // Last 2 weeks
            enrollment.completedLessons.forEach((_: any, index: number) => {
                const dayIndex = index % recentDays.length;
                const day = recentDays[dayIndex];
                if (activityMap[day] !== undefined) {
                    activityMap[day] += 1;
                }
            });
        }
    });

    return days.map(date => ({
        date,
        count: activityMap[date],
        intensity: activityMap[date] === 0 ? 0 : activityMap[date] <= 2 ? 1 : activityMap[date] <= 4 ? 2 : 3,
    }));
}

export function Dashboard() {
    const { user } = useAuth();
    const { data: enrollments, isLoading } = useMyEnrollments();

    // Calculate real achievements
    const achievements = useMemo(() => {
        return calculateAchievements(enrollments || []);
    }, [enrollments]);

    // Generate activity heat map
    const activityData = useMemo(() => {
        return generateActivityMap(enrollments || []);
    }, [enrollments]);

    // Calculate current streak (consecutive days with activity)
    const currentStreak = useMemo(() => {
        if (!activityData || activityData.length === 0) return 0;

        let streak = 0;
        // Count backwards from today
        for (let i = activityData.length - 1; i >= 0; i--) {
            if (activityData[i].count > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }, [activityData]);

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

                        {achievements.length === 0 ? (
                            <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl text-center">
                                <p className="text-zinc-500 text-sm">Complete lessons to unlock achievements!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {achievements.map((achievement, index) => {
                                    const Icon = achievement.icon;
                                    const colorClasses: Record<Achievement['color'], string> = {
                                        emerald: 'bg-emerald-500/20 text-emerald-500',
                                        yellow: 'bg-yellow-500/20 text-yellow-500',
                                        violet: 'bg-violet-500/20 text-violet-500',
                                        blue: 'bg-blue-500/20 text-blue-500',
                                    };
                                    const colorClass = colorClasses[achievement.color];

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-zinc-900/50 border border-white/10 p-4 rounded-xl text-center"
                                        >
                                            <div className={`w-10 h-10 mx-auto ${colorClass} rounded-full flex items-center justify-center mb-2`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="font-bold text-white text-sm">{achievement.title}</div>
                                            <div className="text-xs text-zinc-500 mt-1">{achievement.description}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Current Streak */}
                        {currentStreak > 0 && (
                            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-4 rounded-xl text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-orange-500" />
                                    <span className="text-2xl font-bold text-white">{currentStreak}</span>
                                </div>
                                <div className="text-sm text-zinc-300">Day Streak 🔥</div>
                            </div>
                        )}

                        {/* Activity Heat Map */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold mb-4 text-white">Activity Map</h3>
                            <div className="grid grid-cols-7 gap-1">
                                {activityData.map((day, i) => {
                                    const intensityColors = [
                                        'bg-zinc-800',
                                        'bg-violet-500/30',
                                        'bg-violet-500/60',
                                        'bg-violet-500/90 shadow-[0px_0px_4px_0px_rgba(139,92,246,0.5)]',
                                    ];

                                    return (
                                        <div
                                            key={i}
                                            title={`${day.date}: ${day.count} activities`}
                                            className={`w-full aspect-square rounded-sm transition-all hover:scale-110 ${intensityColors[day.intensity]}`}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-4 text-xs text-zinc-500">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-3 h-3 rounded-sm ${['bg-zinc-800', 'bg-violet-500/30', 'bg-violet-500/60', 'bg-violet-500/90'][i]}`} />
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
