import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    { question: "Do I get lifetime access?", answer: "Yes! Once you enroll in a course, you have lifetime access to all future updates." },
    { question: "Is this suitable for beginners?", answer: "We have specific paths for beginners, but our core focus is taking you from intermediate to advanced." },
    { question: "Do you offer team licenses?", answer: "Absolutely. Contact our sales team for bulk access for your engineering team." }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-violet-400 transition-colors"
            >
                <span className="text-lg font-medium text-white">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-zinc-400">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQSection() {
    return (
        <section className="py-24 px-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-2">
                {FAQS.map((faq, i) => (
                    <FAQItem key={i} {...faq} />
                ))}
            </div>
        </section>
    );
}
