import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Code, Terminal, BookOpen, Star, ChevronDown, Github, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

// Mock Data
const STATS = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Hours of Content', value: '500+' },
    { label: 'Lines of Code Written', value: '1M+' },
    { label: 'Completion Rate', value: '94%' },
];

const FEATURED_COURSES = [
    {
        title: "The Ultimate React Pattern",
        level: "Advanced",
        lessons: 42,
        image: "grad-1",
        color: "from-violet-500 to-purple-500"
    },
    {
        title: "Node.js Microservices",
        level: "Intermediate",
        lessons: 35,
        image: "grad-2",
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "Rust for JavaScript Devs",
        level: "Beginner",
        lessons: 28,
        image: "grad-3",
        color: "from-orange-500 to-red-500"
    }
];

const FAQS = [
    {
        q: "Is this suitable for beginners?",
        a: "Yes! We have paths for absolute beginners that start from 'Hello World' and go all the way to deploying complex distributed systems."
    },
    {
        q: "Do I get certificate?",
        a: "Absolutely. Upon completing a path or course, you receive a verifiable certificate that you can add to your LinkedIn profile."
    },
    {
        q: "Is it a subscription?",
        a: "We offer both individual course purchases and an all-access membership. Choose what fits your learning style best."
    },
    {
        q: "What if I get stuck?",
        a: "Our community Discord is active 24/7 with mentors and fellow students ready to help you debug any issue."
    }
];

export function LandingPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="min-h-screen bg-zinc-950 overflow-hidden font-body selection:bg-violet-500/30">
            {/* Hero Section */}
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

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <ChevronDown className="w-6 h-6 text-zinc-500" />
                </div>
            </motion.section>

            {/* Marquee */}
            <div className="py-12 border-y border-white/5 bg-zinc-900/50 backdrop-blur-sm overflow-hidden flex relative z-20">
                <motion.div
                    className="flex gap-16 whitespace-nowrap text-zinc-700 font-black text-4xl uppercase tracking-widest select-none"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                >
                    {['React', 'TypeScript', 'Node.js', 'Rust', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Next.js', 'Python', 'GoLang', 'React', 'TypeScript'].map((tech, i) => (
                        <span key={i} className="hover:text-zinc-500 transition-colors cursor-default">{tech}</span>
                    ))}
                </motion.div>
            </div>

            {/* Stats Section */}
            <section className="py-24 px-6 border-b border-white/5 relative bg-zinc-950">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    {STATS.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-zinc-500 uppercase tracking-widest font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 max-w-7xl mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">WHY SIMPLE IS <span className="text-violet-500 line-through decoration-wavy decoration-violet-500/50">BORING</span>.</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        We don't do "Hello World". We build complex, resilient, and scalable systems that mimic real-world production environments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px] relative z-10">
                    <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-2 md:row-span-2 glass-panel p-10 rounded-3xl border border-white/10 bg-zinc-900/50 relative overflow-hidden group hover:border-violet-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-40 bg-violet-600/20 blur-[100px] rounded-full group-hover:bg-violet-600/30 transition-all" />
                        <Zap className="w-16 h-16 text-yellow-400 mb-8" />
                        <h3 className="text-3xl font-bold mb-4">Blazing Fast Learning</h3>
                        <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
                            Our optimistic UI and edge-cached video delivery ensures you never see a buffer wheel.
                            Interactive playgrounds load instantly so you stay in the flow state.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-panel p-10 rounded-3xl border border-white/10 bg-zinc-900/50 flex flex-col justify-end relative overflow-hidden hover:border-emerald-500/50 transition-colors"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full" />
                        <Terminal className="w-12 h-12 text-emerald-400 mb-auto" />
                        <h3 className="text-2xl font-bold mb-2">Interactive Labs</h3>
                        <p className="text-zinc-500">Spin up Docker containers instantly per lesson.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-1 glass-panel p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black hover:border-pink-500/50 transition-colors"
                    >
                        <Code className="w-12 h-12 text-pink-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Project Based</h3>
                        <p className="text-zinc-500">Build real SaaS apps, not To-Do lists. Production ready code only.</p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-24 bg-zinc-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Paths</h2>
                            <p className="text-zinc-400">Curated learning paths for specialized careers.</p>
                        </div>
                        <Link to="/courses" className="hidden md:block">
                            <Button variant="outline" className="group">
                                View Dictionary <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURED_COURSES.map((course, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <div className={`h-48 bg-gradient-to-br ${course.color} relative p-6 flex flex-col justify-end`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    <span className="relative z-10 inline-block px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-mono text-white mb-2 self-start">{course.level}</span>
                                    <h3 className="relative z-10 text-xl font-bold text-white">{course.title}</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center text-sm text-zinc-500 mb-4">
                                        <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.lessons} Lessons</span>
                                        <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" /> 4.9</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-6">
                                        Learn by doing. Build a complete clone of a popular service from scratch.
                                    </p>
                                    <div className="flex items-center text-violet-400 text-sm font-bold group-hover:underline">
                                        Preview Course <ArrowRight className="ml-2 w-3 h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/courses">
                            <Button variant="outline" className="w-full">View All Courses</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-24 px-6 max-w-5xl mx-auto text-center">
                <QuoteIcon className="w-12 h-12 text-violet-500 mx-auto mb-8 opacity-50" />
                <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                    "I learned more in 3 weeks on this platform than I did in 3 years of computer science degree. The rigor is unmatched."
                </h3>
                <div className="flex items-center justify-center gap-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-12 h-12 rounded-full border border-white/10" />
                    <div className="text-left">
                        <div className="font-bold text-white">Alex Chen</div>
                        <div className="text-sm text-zinc-500">Senior Engineer @ Google</div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center px-6">
                <div className="neo-brutalist inline-block bg-violet-600 p-12 md:p-20 max-w-5xl mx-auto w-full rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2),transparent_50%)]" />

                    <h2 className="relative z-10 text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                        READY TO BREAK STUFF?
                    </h2>
                    <p className="relative z-10 text-violet-100 text-lg mb-10 max-w-xl mx-auto">
                        Join 10,000+ engineers building the future. Start your free trial today.
                    </p>
                    <Link to="/signup" className="relative z-10">
                        <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-100 border-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all">
                            JOIN THE CULT
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto mb-16 grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">AntiGrav</span>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            The premium platform for engineers who want to go deep. Built by engineers, for engineers.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<Twitter className="w-4 h-4" />} />
                            <SocialLink icon={<Github className="w-4 h-4" />} />
                            <SocialLink icon={<Linkedin className="w-4 h-4" />} />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <FooterLink>All Courses</FooterLink>
                        <FooterLink>Learning Paths</FooterLink>
                        <FooterLink>Pricing</FooterLink>
                        <FooterLink>For Teams</FooterLink>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <FooterLink>Blog</FooterLink>
                        <FooterLink>Community</FooterLink>
                        <FooterLink>Documentation</FooterLink>
                        <FooterLink>Help Center</FooterLink>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <FooterLink>Privacy Policy</FooterLink>
                        <FooterLink>Terms of Service</FooterLink>
                        <FooterLink>Cookie Policy</FooterLink>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <div>&copy; 2026 AntiGravity Learning Inc. All rights reserved.</div>
                    <div className="flex gap-8">
                        <span>Made with ⚡️ and ☕️</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function QuoteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
        </svg>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-900/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-lg">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                <div className="p-6 pt-0 text-zinc-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all">
            {icon}
        </a>
    );
}

function FooterLink({ children }: { children: React.ReactNode }) {
    return (
        <a href="#" className="block text-zinc-500 hover:text-violet-400 transition-colors mb-3 text-sm">
            {children}
        </a>
    );
}
