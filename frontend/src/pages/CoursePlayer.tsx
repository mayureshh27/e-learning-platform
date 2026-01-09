import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import {
    Play,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Maximize2,
    Minimize2,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useMyEnrollments, useUpdateProgress } from '@/hooks/useEnrollments';
import type { Lesson, Module } from '@/types/api.types';

export function CoursePlayer() {
    const { id } = useParams<{ id: string }>();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [cinemaMode, setCinemaMode] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

    const { data: course, isLoading, isError } = useCourse(id || '');
    const { data: enrollments } = useMyEnrollments();
    const updateProgressMutation = useUpdateProgress();

    // Find enrollment for this course
    const enrollment = useMemo(() => {
        return enrollments?.find((e) => {
            const courseId = typeof e.course === 'object' ? e.course._id : e.course;
            return courseId === id;
        });
    }, [enrollments, id]);

    // Flatten all lessons for navigation
    const allLessons = useMemo(() => {
        if (!course?.modules) return [];
        const lessons: { lesson: Lesson; moduleTitle: string; moduleIndex: number }[] = [];
        course.modules.forEach((module, moduleIndex) => {
            module.lessons?.forEach((lesson) => {
                lessons.push({ lesson, moduleTitle: module.title, moduleIndex });
            });
        });
        return lessons;
    }, [course]);

    // Current lesson
    const currentLessonData = useMemo(() => {
        if (!allLessons.length) return null;
        if (currentLessonId) {
            return allLessons.find((l) => l.lesson._id === currentLessonId) || allLessons[0];
        }
        // Find first incomplete lesson or first lesson
        const firstIncomplete = allLessons.find(
            (l) => l.lesson._id && !enrollment?.completedLessons.includes(l.lesson._id)
        );
        return firstIncomplete || allLessons[0];
    }, [allLessons, currentLessonId, enrollment]);

    const currentIndex = allLessons.findIndex((l) => l.lesson._id === currentLessonData?.lesson._id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const handleLessonClick = (lessonId: string) => {
        setCurrentLessonId(lessonId);
    };

    const handleMarkComplete = async () => {
        if (!id || !currentLessonData) return;
        try {
            await updateProgressMutation.mutateAsync({
                courseId: id,
                lessonId: currentLessonData.lesson._id || '',
            });
            // Move to next lesson if available
            if (nextLesson?.lesson._id) {
                setCurrentLessonId(nextLesson.lesson._id);
            }
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    const isLessonCompleted = (lessonId: string) => {
        return enrollment?.completedLessons.includes(lessonId) || false;
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
                <p className="text-zinc-400">Course not found or you're not enrolled.</p>
                <Link to="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-screen bg-zinc-950 border-r border-white/5 flex-shrink-0 flex flex-col z-20"
                    >
                        {/* Sidebar Header with Back Link */}
                        <div className="p-4 border-b border-white/5">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-3"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back to Dashboard</span>
                            </Link>
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-white text-sm truncate pr-2">
                                    {course.title}
                                </h3>
                                <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                            </div>
                            {enrollment && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                        <span>Progress</span>
                                        <span className="text-violet-400">{enrollment.progress}%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-500 transition-all"
                                            style={{ width: `${enrollment.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {course.modules?.map((module: Module, moduleIndex: number) => (
                                <div key={module._id}>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                        Module {moduleIndex + 1}: {module.title}
                                    </h4>
                                    <div className="space-y-1">
                                        {module.lessons?.map((lesson: Lesson) => {
                                            const isCompleted = lesson._id ? isLessonCompleted(lesson._id) : false;
                                            const isCurrent = currentLessonData?.lesson._id === lesson._id;
                                            return (
                                                <button
                                                    key={lesson._id || Math.random()}
                                                    onClick={() => lesson._id && handleLessonClick(lesson._id)}
                                                    className={`w-full text-left p-3 rounded-lg text-sm flex items-center justify-between group transition-all ${isCurrent
                                                        ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20'
                                                        : 'text-zinc-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <Play className="w-4 h-4 fill-current" />
                                                        )}
                                                        <span className="line-clamp-1">{lesson.title}</span>
                                                    </div>
                                                    {lesson.duration && (
                                                        <span className="text-xs opacity-50 font-mono">
                                                            {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Player Area */}
            <div className={`flex-1 flex flex-col h-screen relative ${cinemaMode ? 'bg-black' : ''}`}>
                <div className="flex-1 bg-zinc-900 flex items-center justify-center relative group">
                    {/* Video Player */}
                    <div className="w-full h-full max-h-[80vh] aspect-video bg-black relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

                        {currentLessonData?.lesson.videoPublicId && id && currentLessonData.lesson._id ? (
                            // Use Cloudinary VideoPlayer for HLS streaming
                            <VideoPlayer
                                courseId={id}
                                lessonId={currentLessonData.lesson._id}
                                className="w-full h-full"
                                onEnded={handleMarkComplete}
                            />
                        ) : currentLessonData?.lesson.videoUrl ? (
                            // Fallback to legacy videoUrl
                            <video
                                src={currentLessonData.lesson.videoUrl}
                                controls
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-center">
                                <Play className="w-20 h-20 text-white opacity-50 mx-auto mb-4" />
                                <p className="text-zinc-500">No video available</p>
                            </div>
                        )}

                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none z-20">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    {currentLessonData?.lesson.title || 'Select a lesson'}
                                </h1>
                                <p className="text-zinc-400">
                                    {currentLessonData?.moduleTitle || 'No module'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Sidebar Button (when closed) */}
                    {!sidebarOpen && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSidebarOpen(true)}
                            className="absolute left-4 top-4 p-2 bg-zinc-800 rounded-full text-white hover:bg-violet-600 transition-colors z-30"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    )}

                    {/* Cinema Mode Toggle */}
                    <div className="absolute top-4 right-4 z-30 flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setCinemaMode(!cinemaMode)}>
                            {cinemaMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Footer Controls */}
                {!cinemaMode && (
                    <div className="h-20 bg-zinc-950 border-t border-white/5 flex items-center justify-between px-8">
                        <Button
                            variant="outline"
                            disabled={!prevLesson}
                            onClick={() => prevLesson?.lesson._id && setCurrentLessonId(prevLesson.lesson._id)}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>

                        <div className="flex gap-4">
                            <Button variant="ghost">
                                <MessageSquare className="w-4 h-4 mr-2" /> Discussion
                            </Button>
                            {currentLessonData && currentLessonData.lesson._id && !isLessonCompleted(currentLessonData.lesson._id) && (
                                <Button
                                    variant="outline"
                                    onClick={handleMarkComplete}
                                    disabled={updateProgressMutation.isPending}
                                >
                                    {updateProgressMutation.isPending ? 'Saving...' : 'Mark Complete'}
                                </Button>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            disabled={!nextLesson}
                            onClick={() => nextLesson?.lesson._id && setCurrentLessonId(nextLesson.lesson._id)}
                        >
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
