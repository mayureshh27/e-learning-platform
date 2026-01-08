import { z } from 'zod';

export const createEnrollmentSchema = z.object({
    body: z.object({
        courseId: z.string().min(1, "Course ID is required"),
    }),
});

export const updateProgressSchema = z.object({
    body: z.object({
        lessonId: z.string().min(1, "Lesson ID is required"),
        completed: z.boolean(),
    }),
});
