import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types/api.types';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
    );
}
