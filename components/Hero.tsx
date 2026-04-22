import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Melting Butter Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        {/* Blob 1 */}
        <div className="absolute w-[40rem] h-[40rem] bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        {/* Blob 2 */}
        <div className="absolute w-[35rem] h-[35rem] bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 left-1/4 top-0"></div>
        {/* Blob 3 */}
        <div className="absolute w-[40rem] h-[40rem] bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 right-1/4 bottom-0"></div>
        
        {/* Inline styles for the organic movement animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            33% { transform: translate(30px, -50px) scale(1.1); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            66% { transform: translate(-20px, 20px) scale(0.9); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            100% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          }
          .animate-blob {
            animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
          Never Miss Another HVAC Lead
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          AI voice agent that calls back your leads in seconds, qualifies them, and books the appointment. 24/7 coverage without hiring staff.
        </p>
        <a 
          href="#contact" 
          className="bg-butter-DEFAULT hover:bg-butter-dark text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-block shadow-lg shadow-amber-300/50"
        >
          See It In Action
        </a>
      </div>
    </section>
  );
};

export default Hero;