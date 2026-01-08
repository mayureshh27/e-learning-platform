import { z } from 'zod';

const lessonSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['video', 'text']),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.number().optional(),
    isFree: z.boolean().optional(),
});

const moduleSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Module title is required'),
    lessons: z.array(lessonSchema),
});

export const createCourseSchema = z.object({
    body: z.object({
        title: z.string().min(5, 'Title must be at least 5 chars'),
        description: z.string().min(20, 'Description must be longer'),
        price: z.number().min(0, 'Price cannot be negative'),
        thumbnail: z.string().optional(),
        category: z.string().min(1, 'Category is required'),
        level: z.enum(['beginner', 'intermediate', 'advanced']),
        modules: z.array(moduleSchema).optional(),
        isPublished: z.boolean().optional(),
    }),
});

export const updateCourseSchema = z.object({
    params: z.object({
        courseId: z.string().min(1, 'Course ID required'),
    }),
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        thumbnail: z.string().optional(),
        category: z.string().optional(),
        level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        modules: z.array(moduleSchema).optional(),
        isPublished: z.boolean().optional(),
    }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>['body'];
export type UpdateCourseParams = z.infer<typeof updateCourseSchema>['params'];
export type UpdateCourseBody = z.infer<typeof updateCourseSchema>['body'];
