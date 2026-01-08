import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Check, Shield, Star, Clock, Users, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useEnroll } from '@/hooks/useEnrollments';
import { useAuth } from '@/context/AuthContext';

export function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { data: course, isLoading, isError } = useCourse(id || '');
    const enrollMutation = useEnroll();

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
            return;
        }

        try {
            await enrollMutation.mutateAsync({ courseId: id! });
            navigate('/dashboard');
        } catch (err) {
            console.error('Enrollment failed:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-zinc-400">Course not found.</p>
                <Link to="/courses">
                    <Button variant="outline">Back to Courses</Button>
                </Link>
            </div>
        );
    }

    const instructor = typeof course.instructor === 'object' ? course.instructor : null;

    return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono uppercase mb-6">
                            <Star className="w-3 h-3" /> {course.level}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                            {course.title}
                        </h1>
                        <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-lg">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap gap-8 text-sm font-mono text-zinc-500 mb-10">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-300" /> --
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-zinc-300" /> --
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-zinc-300" /> {course.modules?.length || 0} Modules
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                size="lg"
                                className="px-8 text-lg h-14 bg-white text-black hover:bg-zinc-200 border-none"
                                onClick={handleEnroll}
                                disabled={enrollMutation.isPending}
                            >
                                {enrollMutation.isPending ? 'Enrolling...' : `Enroll Now — $${course.price?.toFixed(2) || '0.00'}`}
                            </Button>
                            <p className="text-xs text-zinc-500 max-w-[150px]">
                                Lifetime access. <br /> 30-day money back guarantee.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-violet-600/20 blur-[100px] rounded-full" />
                        <div className="relative glass-panel rounded-2xl border border-white/10 overflow-hidden bg-zinc-900 group aspect-video flex items-center justify-center">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20" />
                            )}
                            <div className="absolute inset-0 bg-black/40" />

                            <Button size="icon" className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform z-10">
                                <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Syllabus & Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-emerald-500" /> What you'll learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.modules?.slice(0, 6).map((module, i) => (
                                    <div key={module._id || i} className="flex items-start gap-3 p-4 rounded-lg bg-zinc-900/50 border border-white/5">
                                        <Check className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                                        <span className="text-zinc-300">{module.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Course Syllabus</h2>
                            <div className="space-y-4">
                                {course.modules?.map((module, index) => (
                                    <div key={module._id || index} className="glass-panel p-6 rounded-xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-white">Module {index + 1}: {module.title}</h3>
                                            <span className="text-xs font-mono text-zinc-500">{module.lessons?.length || 0} Lessons</span>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {module.lessons?.map(l => l.title).slice(0, 3).join(', ')}{module.lessons?.length > 3 ? '...' : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-panel p-6 rounded-xl border border-white/10 bg-zinc-900/50 sticky top-32">
                            <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Your Instructor</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {instructor?.avatar ? (
                                        <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-zinc-600">{instructor?.name?.charAt(0) || '?'}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white">{instructor?.name || 'Unknown'}</div>
                                    <div className="text-xs text-violet-400 font-mono">{instructor?.role || 'Instructor'}</div>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                Expert instructor with years of industry experience.
                            </p>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded bg-zinc-950 border border-white/5 text-xs text-zinc-500 font-mono">--</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
