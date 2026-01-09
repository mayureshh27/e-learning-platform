import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MOCK_COURSES = [
    {
        title: "Fullstack React & Node.js",
        category: "Web Development",
        lessons: 142,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Advanced System Design",
        category: "Architecture",
        lessons: 85,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Rust for JavaScript Devs",
        category: "System Programming",
        lessons: 64,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97663?q=80&w=2070&auto=format&fit=crop",
        color: "from-orange-500/20 to-red-500/20"
    }
];

export function FeaturedCourses() {
    return (
        <section className="py-24 px-6 bg-zinc-900/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-2">Popular Paths</h2>
                        <p className="text-zinc-400">Most enrolled courses this month</p>
                    </div>
                    <Link to="/courses">
                        <Button variant="ghost" className="hidden md:flex">
                            View All Courses <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_COURSES.map((course, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} mix-blend-overlay z-10`} />
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">{course.category}</div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{course.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        <span>{course.rating}</span>
                                    </div>
                                    <div>{course.lessons} Lessons</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
