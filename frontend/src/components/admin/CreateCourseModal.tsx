import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateCourse } from '@/hooks/useCourses';

const courseSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    category: z.string().min(1, 'Category is required'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    thumbnail: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = ['Web Development', 'Backend', 'DevOps', 'Data Science', 'Mobile', 'Design', 'Other'];
const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
    const createCourse = useCreateCourse();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            category: '',
            level: 'beginner',
            thumbnail: '',
        },
    });

    const onSubmit = async (data: CourseFormData) => {
        try {
            const newCourse = await createCourse.mutateAsync({
                ...data,
                modules: [], // Initialize with empty modules
                isPublished: false,
            });
            reset();
            onClose();
            if (newCourse?._id) {
                navigate(`/admin/courses/${newCourse._id}`);
            }
        } catch (error) {
            console.error('Failed to create course:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50">
                            <h2 className="text-xl font-bold text-white">Create New Course</h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Course Title
                                </label>
                                <input
                                    {...register('title')}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="e.g., Advanced React Patterns"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                                    placeholder="Brief description of the course content..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price', { valueAsNumber: true })}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                                        Level
                                    </label>
                                    <select
                                        {...register('level')}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    >
                                        {LEVELS.map((level) => (
                                            <option key={level} value={level} className="bg-zinc-900">
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.level && (
                                        <p className="mt-1 text-xs text-red-500">{errors.level.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Category
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat} className="bg-zinc-900">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Thumbnail URL
                                </label>
                                <div className="relative">
                                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        {...register('thumbnail')}
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
                                <Button type="button" variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Course
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
