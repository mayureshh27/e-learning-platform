import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle, Check, Shield, Star, BookOpen, Loader2, AlertCircle, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useEnroll } from '@/hooks/useEnrollments';
import { useAuth } from '@/context/AuthContext';

export function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { data: course, isLoading, isError } = useCourse(id || '');
    const enrollMutation = useEnroll();
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
    };

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
    const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
    const freeLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.filter(l => l.isFree).length || 0), 0) || 0;

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
                                <BookOpen className="w-4 h-4 text-zinc-300" /> {course.modules?.length || 0} Modules
                            </div>
                            <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4 text-zinc-300" /> {totalLessons} Lessons
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" /> {freeLessons} Free Preview
                            </div>
                        </div>

                        <div className="flex items-center gap-4" id="enroll-section">
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
                            <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                            <div className="space-y-3">
                                {course.modules?.map((module, index) => (
                                    <div key={module._id || index} className="glass-panel rounded-xl border border-white/5 bg-zinc-900/20 overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(index)}
                                            className="w-full p-6 flex justify-between items-center hover:bg-zinc-900/40 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                {expandedModules[index] ? (
                                                    <ChevronDown className="w-5 h-5 text-violet-500" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                                                )}
                                                <div className="text-left">
                                                    <h3 className="font-bold text-white">Module {index + 1}: {module.title}</h3>
                                                    <p className="text-xs text-zinc-500 mt-1">{module.lessons?.length || 0} lessons</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-zinc-500">
                                                {module.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0)} min
                                            </span>
                                        </button>

                                        {expandedModules[index] && (
                                            <div className="border-t border-white/5 bg-zinc-950/50">
                                                {module.lessons?.map((lesson, lessonIndex) => {
                                                    const canPreview = lesson.isFree;
                                                    const handleLessonClick = () => {
                                                        if (canPreview && lesson._id) {
                                                            // Navigate to course player for free lessons
                                                            navigate(`/player/${id}?lesson=${lesson._id}`);
                                                        } else {
                                                            // Scroll to enrollment section for locked lessons
                                                            const enrollSection = document.getElementById('enroll-section');
                                                            enrollSection?.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    };

                                                    return (
                                                        <div
                                                            key={lesson._id || lessonIndex}
                                                            onClick={handleLessonClick}
                                                            className={`flex items-center justify-between p-4 border-b border-white/5 last:border-0 transition-colors cursor-pointer ${canPreview ? 'hover:bg-violet-900/20' : 'hover:bg-zinc-900/30'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <PlayCircle className={`w-4 h-4 ${canPreview ? 'text-violet-500' : 'text-zinc-500'}`} />
                                                                <span className="text-sm text-zinc-300">{lesson.title}</span>
                                                                {lesson.isFree ? (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                        Free Preview
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                                                                        Enroll to Watch
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-zinc-500">{lesson.duration || 0} min</span>
                                                                {!lesson.isFree && <Lock className="w-3 h-3 text-zinc-600" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {instructor && (
                            <div className="glass-panel p-6 rounded-xl border border-white/5 bg-zinc-900/20">
                                <h3 className="font-bold text-white mb-4">Instructor</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                                        {instructor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{instructor.name}</p>
                                        <p className="text-xs text-zinc-500 capitalize">{instructor.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
