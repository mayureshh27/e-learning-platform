import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { useScroll, useTransform } from 'framer-motion';

export function HeroSection() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <motion.section
            style={{ opacity, scale }}
            className="relative min-h-screen flex items-center pt-20 px-6"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-violet-500/30 rounded-full bg-violet-500/10 text-violet-300 text-xs font-mono tracking-wider uppercase backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        v2.0 Now Available
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
                        BUILD <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-white animate-gradient-x">
                            THE FUTURE
                        </span> <br />
                        TODAY.
                    </h1>
                    <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                        Stop watching tutorials. Start building production-grade distributed systems.
                        The only platform bridging the gap between "Hello World" and Senior Engineer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/courses">
                            <Button size="lg" variant="primary" className="h-14 px-8 text-base group">
                                Start Learning Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/courses">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-zinc-900/50 backdrop-blur-md border-zinc-800 hover:bg-zinc-800">
                                View Curriculum
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span>Trusted by 10,000+ devs</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative glass-panel p-1 rounded-2xl neo-brutalist bg-zinc-900/80 border border-white/10 rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl shadow-violet-500/10">
                        <div className="bg-zinc-950 rounded-xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-900/50">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="ml-auto text-xs text-zinc-500 font-mono">deploy_pipeline.ts</span>
                            </div>
                            <div className="p-6 font-mono text-sm overflow-x-auto">
                                <div className="text-zinc-400">
                                    <span className="text-violet-400">const</span> <span className="text-yellow-200">deploy</span> = <span className="text-violet-400">async</span> () ={'>'} {'{'}
                                </div>
                                <div className="pl-4 text-zinc-400">
                                    <span className="text-zinc-500">// Initialize infrastructure</span>
                                </div>
                                <div className="pl-4 text-zinc-400">
                                    <span className="text-violet-400">await</span> <span className="text-blue-400">terraform</span>.<span className="text-yellow-200">apply</span>({'{'}
                                </div>
                                <div className="pl-8 text-zinc-400">
                                    <span className="text-emerald-400">region</span>: <span className="text-orange-300">"us-east-1"</span>,
                                </div>
                                <div className="pl-8 text-zinc-400">
                                    <span className="text-emerald-400">scaling</span>: <span className="text-violet-400">true</span>
                                </div>
                                <div className="pl-4 text-zinc-400">{'}'});</div>
                                <div className="pl-4 text-zinc-400 mt-2">
                                    <span className="text-violet-400">return</span> <span className="text-orange-300">"Production Ready 🚀"</span>;
                                </div>
                                <div className="text-zinc-400">{'}'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute -left-12 bottom-20 p-4 bg-zinc-900/90 backdrop-blur-md border border-emerald-500/20 rounded-xl shadow-xl flex items-center gap-3 z-20"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Status</div>
                            <div className="text-sm font-bold text-white">All Systems Go</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
