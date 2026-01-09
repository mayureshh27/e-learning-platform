import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
    Save, ArrowLeft, Plus, Trash2, GripVertical,
    ChevronDown, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { VideoUpload } from '@/components/ui/VideoUpload';
import { useCourse, useUpdateCourse } from '@/hooks/useCourses';


// Schema Validation
const lessonSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Lesson title is required'),
    type: z.enum(['video', 'text']),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    videoPublicId: z.string().optional(), // Cloudinary public_id
    duration: z.number().optional(),
    isFree: z.boolean().optional(),
});

const moduleSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Module title is required'),
    lessons: z.array(lessonSchema),
});

const courseEditorSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    price: z.number().min(0),
    category: z.string().min(1),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    thumbnail: z.string().optional(),
    thumbnailPublicId: z.string().optional(), // Cloudinary public_id
    isPublished: z.boolean().optional(),
    modules: z.array(moduleSchema),
});

type CourseEditorData = z.infer<typeof courseEditorSchema>;

const CATEGORIES = ['Web Development', 'Backend', 'DevOps', 'Data Science', 'Mobile', 'Design', 'Other'];
const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export function CourseEditor() {
    const { id } = useParams<{ id: string }>();
    const { data: course, isLoading: isLoadingCourse } = useCourse(id || '');
    const updateCourse = useUpdateCourse();

    const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('curriculum');
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<CourseEditorData>({
        resolver: zodResolver(courseEditorSchema),
        defaultValues: {
            modules: [],
        },
    });

    const { fields: modules, append: appendModule, remove: removeModule } = useFieldArray({
        control,
        name: 'modules',
    });

    // Load initial data
    useEffect(() => {
        if (course) {
            reset({
                title: course.title,
                description: course.description,
                price: course.price,
                category: course.category,
                level: course.level,
                thumbnail: course.thumbnail,
                isPublished: course.isPublished,
                modules: course.modules || [],
            });
            // Auto expand all modules initially
            if (course.modules) {
                const initialExpanded: Record<number, boolean> = {};
                course.modules.forEach((_, idx: number) => { initialExpanded[idx] = true; });
                setExpandedModules(initialExpanded);
            }
        }
    }, [course, reset]);

    const onSubmit = async (data: CourseEditorData) => {
        if (!id) return;
        try {
            await updateCourse.mutateAsync({ id, ...data });
            // Optional: Show toast or feedback
        } catch (error) {
            console.error('Failed to update course:', error);
        }
    };

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (isLoadingCourse) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                                <ArrowLeft className="w-5 h-5 text-zinc-400" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Edit Course</h1>
                                <p className="text-zinc-400 text-sm">Manage curriculum and details.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 mr-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('curriculum')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'curriculum' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    Curriculum
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('details')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'details' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    Details
                                </button>
                            </div>
                            <Button type="submit" variant="primary" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="glass-panel border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50 p-6 min-h-[600px]">

                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Course Title</label>
                                        <input
                                            {...register('title')}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                                        />
                                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                                        <textarea
                                            {...register('description')}
                                            rows={5}
                                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 resize-none"
                                        />
                                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('price', { valueAsNumber: true })}
                                                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Level</label>
                                            <select
                                                {...register('level')}
                                                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                                            >
                                                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                                            <select
                                                {...register('category')}
                                                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
                                            >
                                                <option value="">Select Category</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center pt-8">
                                            <label className="flex items-center cursor-pointer gap-3">
                                                <input
                                                    type="checkbox"
                                                    {...register('isPublished')}
                                                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                />
                                                <span className="text-sm font-medium text-white">Publish Course</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Course Thumbnail</label>
                                        <Controller
                                            name="thumbnailPublicId"
                                            control={control}
                                            render={({ field }) => (
                                                <ImageUpload
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    aspectRatio="video"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Curriculum Tab */}
                        {activeTab === 'curriculum' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {modules.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                                        <p className="text-zinc-500 mb-4">No modules added yet.</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendModule({ title: 'Module 1', lessons: [] })}
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add First Module
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {modules.map((module, moduleIndex) => (
                                        <div key={module.id} className="bg-zinc-950 border border-white/10 rounded-lg overflow-hidden">
                                            {/* Module Header */}
                                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 border-b border-white/5">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleModule(moduleIndex)}
                                                        className="p-1 hover:bg-white/5 rounded"
                                                    >
                                                        {expandedModules[moduleIndex] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                    <div className="flex-1">
                                                        <input
                                                            {...register(`modules.${moduleIndex}.title` as const)}
                                                            className="bg-transparent text-white font-medium focus:outline-none focus:border-b border-violet-500 w-full"
                                                            placeholder="Module Title"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-zinc-500">{module.lessons?.length || 0} Lessons</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                                                        onClick={() => removeModule(moduleIndex)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Lessons List */}
                                            {expandedModules[moduleIndex] && (
                                                <div className="p-4 bg-zinc-950 space-y-3">
                                                    <LessonsList
                                                        nestIndex={moduleIndex}
                                                        control={control}
                                                        register={register}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {modules.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-dashed"
                                        onClick={() => appendModule({ title: 'New Module', lessons: [] })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Module
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

// Sub-component for Lessons List to handle field array nesting
interface LessonsListProps {
    nestIndex: number;
    control: Control<CourseEditorData>;
    register: any; // Type accurately if possible, but 'any' simplifies for this rapid task
}

function LessonsList({ nestIndex, control, register }: LessonsListProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `modules.${nestIndex}.lessons`
    });

    return (
        <div className="space-y-4 pl-4 border-l-2 border-white/5">
            {fields.map((item, k) => (
                <div key={item.id} className="group relative bg-zinc-900 rounded-lg p-4 border border-white/5 hover:border-violet-500/30 transition-colors">
                    <div className="space-y-4">
                        {/* Lesson Header */}
                        <div className="flex gap-3 items-center">
                            <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab flex-shrink-0" />
                            <input
                                {...register(`modules.${nestIndex}.lessons.${k}.title` as const)}
                                placeholder="Lesson Title"
                                className="flex-1 bg-zinc-950 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                            />
                            <select
                                {...register(`modules.${nestIndex}.lessons.${k}.type` as const)}
                                className="bg-zinc-950 border border-white/10 rounded px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-violet-500"
                            >
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    {...register(`modules.${nestIndex}.lessons.${k}.duration` as const, { valueAsNumber: true })}
                                    placeholder="Min"
                                    className="bg-zinc-950 border border-white/10 rounded px-2 py-2 text-sm text-zinc-400 focus:outline-none focus:border-violet-500 w-16"
                                />
                                <span className="text-xs text-zinc-600">min</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-500 hover:text-red-400 flex-shrink-0"
                                onClick={() => remove(k)}
                            >
                                <XSmall className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Video Upload */}
                        <div className="ml-7">
                            <label className="block text-xs font-medium text-zinc-500 mb-2">Lesson Video</label>
                            <Controller
                                name={`modules.${nestIndex}.lessons.${k}.videoPublicId` as const}
                                control={control}
                                render={({ field }) => (
                                    <VideoUpload
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        {/* Free Preview Toggle */}
                        <div className="ml-7 flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register(`modules.${nestIndex}.lessons.${k}.isFree` as const)}
                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-xs text-zinc-400">Free preview (available to non-enrolled users)</span>
                        </div>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-violet-400 hover:bg-violet-500/10"
                onClick={() => append({ title: 'New Lesson', type: 'video', duration: 0, isFree: false })}
            >
                <Plus className="w-3 h-3 mr-1" /> Add Lesson
            </Button>
        </div>
    );
}

function XSmall({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
