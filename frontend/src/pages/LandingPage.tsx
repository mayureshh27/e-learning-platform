import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Code, Terminal } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="z-10"
                    >
                        <div className="inline-block px-4 py-1 mb-6 border border-violet-500/50 rounded-full bg-violet-500/10 text-violet-300 text-sm font-mono tracking-wider uppercase">
                            v2.0 Beta Live
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
                            CODE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-white">
                                WITHOUT
                            </span> <br />
                            LIMITS.
                        </h1>
                        <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                            Master full-stack engineering with a platform designed for the obscessed. No fluff, just raw aesthetic and deep technical rigor.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/courses">
                                <Button size="lg" variant="primary" className="group">
                                    Start Learning <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/courses">
                                <Button size="lg" variant="outline">
                                    View Catalog
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 blur-3xl rounded-full" />
                        <div className="relative glass-panel p-8 rounded-xl neo-brutalist bg-zinc-900 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-auto text-xs text-zinc-500 font-mono">server.ts</span>
                            </div>
                            <pre className="font-mono text-sm text-zinc-300 overflow-x-auto">
                                <code>
                                    {`async function masterCode() {
  const skills = await learn('AntiGrav');
  
  if (skills.level > 9000) {
    return "Legendary Dev";
  }
}
// Executing...`}
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Marquee */}
            <div className="py-12 border-y border-white/5 bg-white/2 backdrop-blur-sm overflow-hidden flex">
                <motion.div
                    className="flex gap-16 whitespace-nowrap text-zinc-600 font-black text-4xl uppercase tracking-widest select-none opacity-50"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    <span>React</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>Rust</span>
                    <span>GoLang</span>
                    <span>Docker</span>
                    <span>Kubernetes</span>
                    <span>React</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                </motion.div>
            </div>

            {/* Bento Grid Features */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold mb-16 text-center">Why simple is <span className="text-violet-500 line-through">boring</span>.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    {/* Large Card */}
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-2 md:row-span-2 glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-violet-600/20 blur-[100px] rounded-full group-hover:bg-violet-600/30 transition-all" />
                        <Zap className="w-12 h-12 text-yellow-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Blazing Fast Learning</h3>
                        <p className="text-zinc-400 max-w-md">Our optimistic UI and edge-cached video delivery ensures you never see a buffer wheel. Just pure knowledge transfer.</p>
                    </motion.div>

                    {/* Tall Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-panel p-8 rounded-2xl border border-white/5 bg-zinc-900/50 flex flex-col justify-end relative"
                    >
                        <Terminal className="w-10 h-10 text-emerald-400 mb-auto" />
                        <h3 className="text-xl font-bold mb-2">Interactive Labs</h3>
                        <p className="text-zinc-500 text-sm">Spin up Docker containers instantly.</p>
                    </motion.div>

                    {/* Wide Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-1 glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-900 to-black"
                    >
                        <Code className="w-10 h-10 text-pink-400 mb-4" />
                        <h3 className="text-xl font-bold">Project Based</h3>
                        <p className="text-zinc-500 text-sm mt-2">Build real SaaS apps, not To-Do lists.</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center px-6">
                <div className="neo-brutalist inline-block bg-violet-600 p-12 max-w-4xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">READY TO BREAK STUFF?</h2>
                    <Link to="/signup">
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 border-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            JOIN THE CULT
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
