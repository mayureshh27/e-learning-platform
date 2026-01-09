import { motion } from 'framer-motion';
import { Zap, Code, Terminal, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturesGrid() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Why We're Different</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        We don't just teach syntax. We teach engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 - Large Span */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-64 h-64 text-yellow-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Blazing Fast Rendering</h3>
                            <p className="text-zinc-400 mb-6">
                                Optimized for performance. Learn how to build applications that load in milliseconds, not seconds.
                                We cover edge caching, code splitting, and advanced hydration strategies.
                            </p>
                            <Button variant="ghost" className="text-yellow-500 hover:text-yellow-400 pl-0 hover:bg-transparent">
                                Learn Optimization <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 w-24 h-24 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-6">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Interactive Labs</h3>
                        <p className="text-zinc-400">
                            Don't just watch. Type. Run. Fail. Fix. Our in-browser IDE handles it all.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6">
                            <Code className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Project Based</h3>
                        <p className="text-zinc-400">
                            Build real apps. Clones, SaaS tools, and complex systems. No "todo lists" here.
                        </p>
                    </motion.div>

                    {/* Feature 4 - Large Span */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BookOpen className="w-64 h-64 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Modern Curriculum</h3>
                            <p className="text-zinc-400 mb-6">
                                Updated weekly. If a new React version drops today, the course is updated tomorrow.
                                Stay ahead of the curve with the absolute latest tech stack.
                            </p>
                            <Button variant="ghost" className="text-emerald-500 hover:text-emerald-400 pl-0 hover:bg-transparent">
                                View Syllabus <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
