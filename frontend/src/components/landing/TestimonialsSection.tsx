import { Quote } from 'lucide-react';

export function TestimonialsSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <Quote className="w-12 h-12 text-violet-500 mx-auto mb-8 opacity-50" />
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                    "This platform single-handedly helped me transition from Junior to Senior Engineer. The system design course is pure gold."
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-12 h-12 rounded-full border-2 border-violet-500"
                    />
                    <div className="text-left">
                        <div className="font-bold text-white">Alex Chen</div>
                        <div className="text-sm text-violet-400">Senior Engineer @ Google</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
