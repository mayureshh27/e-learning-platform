import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types/api.types';
import { CourseCard } from './CourseCard';

interface CourseGridProps {
    courses: Course[];
    isLoading: boolean;
    isError: boolean;
    clearFilters: () => void;
}

export function CourseGrid({ courses, isLoading, isError, clearFilters }: CourseGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-20 text-red-400">
                <p>Failed to load courses. Please try again.</p>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <p>No courses found matching your criteria.</p>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence>
                {courses.map(course => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
