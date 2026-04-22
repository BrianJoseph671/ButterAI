import React from 'react';

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const TrendUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const LightningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const Product: React.FC = () => {
  const features = [
    {
      title: "Instant Inbound Callback",
      description: "When a lead comes in, Alex calls back in seconds so your shop does not lose jobs to slow response times."
    },
    {
      title: "Outbound Campaigns",
      description: "Call past customers for seasonal tune-ups, maintenance reminders, and reactivation campaigns your team does not have time to run."
    },
    {
      title: "After-Hours Coverage",
      description: "Capture nights and weekends without adding headcount. Butter AI keeps responding when your office is closed."
    },
    {
      title: "Custom Qualification",
      description: "Ask your questions your way: house size, equipment age, urgency, financing interest, and payment method."
    },
    {
      title: "Appointment Booking",
      description: "Alex helps lock in next steps and schedules appointments with your workflow and calendar process."
    },
    {
      title: "Lead Brief Delivery",
      description: "Every call ends with a clean handoff sent by text, email, or CRM so your team is ready to close."
    }
  ];

  const statsData = [
    { icon: <StarIcon />, value: '21x', description: 'Higher conversion when you respond in under 5 minutes' },
    { icon: <TrendUpIcon />, value: '47 min', description: 'Average response time in home services you are competing against' },
    { icon: <LightningIcon />, value: '11%', description: 'Booking rate on outbound calls to a 26,000-record customer database' },
  ];

  return (
    <section id="product" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        {/* Top Section: Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for Real HVAC Workflows</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">From inbound rescue to outbound maintenance campaigns, Butter AI helps fill the schedule.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section: Stats */}
        <div id="stats" className="border-t border-gray-100 pt-16">
            <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900">The Speed-to-Lead Numbers</h3>
                <p className="text-gray-500 mt-2">Fast response wins booked jobs. Slow response loses them.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {statsData.map((stat, index) => (
                    <div key={index} 
                        className="bg-white p-8 rounded-2xl shadow-lg shadow-amber-300/40 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-amber-50">
                        <div className="mb-4">{stat.icon}</div>
                        <p className="text-4xl md:text-5xl font-bold text-amber-600 mb-3">{stat.value}</p>
                        <p className="text-gray-500 leading-relaxed text-center">{stat.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Product;