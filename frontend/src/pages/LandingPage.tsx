import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { FeaturedCourses } from '@/components/landing/FeaturedCourses';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/layout/Footer';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
                <HeroSection />

                {/* Marquee Section embedded or extracted? */}
                {/* I realized I missed extracting the Marquee section in the previous steps. 
                    The HeroSection in my previous step INCLUDED the marquee? 
                    Let me check the HeroSection content I wrote in Step 1262.
                    ... It did NOT include the marquee. 
                    I should add the marquee here or extract it quickly. 
                    To keep it simple and safe for now, I'll inline the marquee here or add it as a small component.
                    Actually, checking Step 1262, HeroSection ends after the "Status" floating card.
                    The original LandingPage had a Marquee. 
                    I will create a Marquee component quickly to be thorough.
                */}
                <MarqueeSection />

                <StatsSection />
                <FeaturesGrid />
                <FeaturedCourses />
                <TestimonialsSection />
                <FAQSection />
                <Footer />
            </div>
        </div>
    );
}

import { motion } from 'framer-motion';

function MarqueeSection() {
    return (
        <div className="py-8 bg-zinc-900/50 border-y border-white/5 overflow-hidden">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="flex gap-16 whitespace-nowrap items-center text-zinc-500 font-bold text-xl uppercase tracking-widest px-8"
            >
                {['Python', 'Rust', 'Go', 'Typescript', 'React', 'Kubernetes', 'Docker', 'AWS', 'Terraform', 'GraphQL', 'Python', 'Rust', 'Go', 'Typescript'].map((tech, i) => (
                    <span key={i} className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-violet-500/50" />
                        {tech}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
