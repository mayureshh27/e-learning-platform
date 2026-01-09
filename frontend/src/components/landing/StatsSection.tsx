import { motion } from 'framer-motion';

const STATS = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Hours of Content', value: '500+' },
    { label: 'Lines of Code Written', value: '1M+' },
    { label: 'Completion Rate', value: '94%' },
];

export function StatsSection() {
    return (
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
    );
}
