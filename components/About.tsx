import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Lead Response Problem Is Costing You Jobs</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          HVAC contractors lose 30-40% of high-intent leads because nobody calls back fast enough. After-hours calls go to voicemail and never get returned. Answering services are expensive and usually do not qualify leads the way your team would.
          <br /><br />
          Butter AI fixes the speed-to-lead gap. Alex, our AI voice agent, responds in seconds, asks the right questions, and helps get appointments booked. It also runs outbound campaigns to your past customer list so money is not left on the table.
        </p>
      </div>
    </section>
  );
};

export default About;