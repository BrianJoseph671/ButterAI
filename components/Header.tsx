import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">Butter AI</span>
        </a>
        <nav className="hidden md:flex space-x-8">
          <a href="#about" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">Problem</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">How It Works</a>
          <a href="#product" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">Features</a>
          <a href="#stats" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">Results</a>
          <a href="#faq" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">FAQ</a>
          <a href="#contact" className="text-gray-600 hover:text-butter-dark font-medium transition-colors">Contact</a>
        </nav>
        <a href="#contact" className="hidden md:inline-block bg-gray-900 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-colors">
          Book a Demo
        </a>
      </div>
    </header>
  );
};

export default Header;