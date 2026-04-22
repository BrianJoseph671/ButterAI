import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6">
      <div className="container mx-auto px-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Butter AI. AI voice agent for HVAC contractors.</p>
      </div>
    </footer>
  );
};

export default Footer;