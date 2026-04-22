import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Stop Losing Leads to Slow Response Times</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">See how Butter AI helps HVAC teams respond in seconds, qualify better, and book more appointments.</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
          <p className="text-gray-700 text-lg mb-6">
            Design partner: I&amp;M Heating and Cooling (South Bend, IN). Accepted into BASE Startup Accelerator.
          </p>
          <a
            href="mailto:bjoseph2@nd.edu?subject=Butter%20AI%20Demo"
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors text-lg"
          >
            Book a Demo
          </a>
          <p className="text-gray-500 mt-4">
            Or email <a className="text-amber-600 hover:text-amber-700 font-medium" href="mailto:bjoseph2@nd.edu">bjoseph2@nd.edu</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;