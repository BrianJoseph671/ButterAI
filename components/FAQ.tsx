import React, { useState } from 'react';

const faqs = [
    {
        question: "Will it sound like a robot?",
        answer: "No. Alex uses natural voice AI, and customers regularly do not realize they are speaking with an AI agent."
    },
    {
        question: "What if I already have someone answering phones?",
        answer: "This is not a replacement for your team. It adds coverage for after-hours, overflow, and outbound campaigns your team may not have time to run."
    },
    {
        question: "How much does it cost?",
        answer: "Pricing is commission-based and tied to jobs booked. You pay when it works."
    },
    {
        question: "How fast can I get started?",
        answer: "Most contractors can have their AI agent live within a week."
    }
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-amber-600' : 'text-gray-900 group-hover:text-amber-600'}`}>
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    return (
        <section id="faq" className="py-20 md:py-28 bg-gray-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mt-4">Everything you need to know about getting started.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;