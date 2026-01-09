import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseFiltersProps {
    categories: string[];
    levels: string[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    activeLevel: string;
    setActiveLevel: (level: string) => void;
    searchInput: string;
    setSearchInput: (input: string) => void;
    sortBy: 'newest' | 'content';
    setSortBy: (sort: 'newest' | 'content') => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function CourseFilters({
    categories,
    levels,
    activeCategory,
    setActiveCategory,
    activeLevel,
    setActiveLevel,
    searchInput,
    setSearchInput,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    clearFilters,
    hasActiveFilters
}: CourseFiltersProps) {
    return (
        <>
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
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'content')}
                        className="bg-zinc-900 border border-white/10 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
                    >
                        <option value="content">Most Content</option>
                        <option value="newest">Newest</option>
                    </select>
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
                                    {levels.map(level => (
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
                {categories.map(cat => (
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
        </>
    );
}
