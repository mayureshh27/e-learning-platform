import { useState, useEffect } from 'react';
import { Pagination } from '@/components/ui/Pagination';
import { useCourses } from '@/hooks/useCourses';
import { CourseFilters } from '@/components/catalog/CourseFilters';
import { CourseGrid } from '@/components/catalog/CourseGrid';

// Categories matching task.md requirements
const CATEGORIES = ['All', 'Web Development', 'Backend', 'DevOps', 'Data Science', 'Mobile'];
const LEVELS = ['All', 'beginner', 'intermediate', 'advanced'];

export function CourseCatalog() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeLevel, setActiveLevel] = useState('All');
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'newest' | 'content'>('content');

    // Debounce search input (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, activeLevel, debouncedSearch, sortBy]);

    const { data, isLoading, isError } = useCourses({
        category: activeCategory === 'All' ? undefined : activeCategory.toLowerCase(),
        level: activeLevel === 'All' ? undefined : activeLevel,
        search: debouncedSearch || undefined,
        page: currentPage,
        limit: 9,
    });

    const courses = data?.data || [];
    const pagination = data?.pagination;

    const clearFilters = () => {
        setActiveCategory('All');
        setActiveLevel('All');
        setSearchInput('');
    };

    const hasActiveFilters = activeCategory !== 'All' || activeLevel !== 'All' || searchInput;

    return (
        <div className="min-h-screen bg-zinc-950 pt-32 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <CourseFilters
                    categories={CATEGORIES}
                    levels={LEVELS}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activeLevel={activeLevel}
                    setActiveLevel={setActiveLevel}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    clearFilters={clearFilters}
                    hasActiveFilters={!!hasActiveFilters}
                />

                <CourseGrid
                    courses={courses}
                    isLoading={isLoading}
                    isError={isError}
                    clearFilters={clearFilters}
                />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalResults={pagination.total}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}
