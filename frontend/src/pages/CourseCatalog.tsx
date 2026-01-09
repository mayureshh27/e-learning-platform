import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { Search, Filter, BookOpen, Clock, BarChart, Loader2, X } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';

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
    const [sortBy, setSortBy] = useState<'newest' | 'content'>('content'); // Default to most content

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
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Course Catalog</h1>
                        <p className="text-zinc-400">Level up your skills with our curated curriculum.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 w-full md:w-64 transition-all"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="hidden sm:flex"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-violet-500 rounded-full" />}
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 p-6 bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Filters</h3>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        <X className="w-4 h-4 mr-1" /> Clear All
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Level Filter */}
                                <div>
                                    <label className="text-xs font-mono text-zinc-500 uppercase mb-2 block">Difficulty</label>
                                    <div className="flex flex-wrap gap-2">
                                        {LEVELS.map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setActiveLevel(level)}
                                                className={`px-3 py-1 rounded text-sm font-medium border transition-all capitalize ${activeLevel === level
                                                    ? 'bg-violet-600 border-violet-500 text-white'
                                                    : 'bg-zinc-800 border-white/10 text-zinc-400 hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Categories Pill Bar */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${activeCategory === cat
                                ? 'bg-violet-600 border-violet-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-[1px]'
                                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-20 text-red-400">
                        <p>Failed to load courses. Please try again.</p>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !isError && (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {courses.map(course => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={course._id}
                                    className="group glass-panel rounded-xl p-0 border border-white/10 overflow-hidden hover:border-violet-500/30 transition-colors flex flex-col"
                                >
                                    {/* Card Content */}
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-white/5`}>
                                                {course.category}
                                            </span>
                                            <span className="text-xs font-mono text-zinc-500 uppercase">{course.level}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{course.modules?.length || 0} Modules</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>--</span>
                                            </div>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <BarChart className="w-3 h-3" />
                                                <span>--</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="p-4 border-t border-white/5 bg-zinc-900/30 flex justify-between items-center group-hover:bg-violet-900/10 transition-colors">
                                        <span className="font-bold text-white">${course.price?.toFixed(2) || '0.00'}</span>
                                        <Link to={`/courses/${course._id}`}>
                                            <Button size="sm" variant="ghost" className="hover:bg-violet-600 hover:text-white transition-all">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!isLoading && courses.length === 0 && (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No courses found matching your criteria.</p>
                        <Button variant="link" onClick={clearFilters}>Clear filters</Button>
                    </div>
                )}

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
