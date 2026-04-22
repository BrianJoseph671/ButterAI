import React from 'react';

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const LightningIconHIW = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);


const steps = [
    {
        icon: <TargetIcon />,
        title: 'Lead Comes In',
        description: 'A form submission, missed call, or after-hours emergency triggers Butter AI the moment the lead appears.'
    },
    {
        icon: <LightningIconHIW />,
        title: 'AI Calls Back Instantly',
        description: 'Alex calls within seconds, asks qualification questions, and books the appointment when possible.'
    },
    {
        icon: <ChartBarIcon />,
        title: 'You Get the Brief',
        description: 'Your team receives a complete handoff with need, urgency, availability, and payment preferences.'
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-white/0 to-amber-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900">How It Works</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Three simple steps to stop losing leads and book more jobs.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-gray-200/50">
                            <div className="absolute -top-5 -left-5 bg-amber-400 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                                {index + 1}
                            </div>
                            <div className="mb-4 pt-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;