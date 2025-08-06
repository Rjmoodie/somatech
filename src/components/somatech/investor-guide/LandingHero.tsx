import React from 'react';

interface LandingHeroProps {
  onStartGuide: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartGuide }) => (
  <section className="text-center py-16">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">Invest Smarter. Understand the Market from the Top Down.</h1>
    <p className="text-lg md:text-xl text-gray-600 mb-8">
      A guided experience to help you learn and navigate investing, from macro trends to company analysis.
    </p>
    <button
      className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
      onClick={onStartGuide}
    >
      Start Guide
    </button>
  </section>
);

export default LandingHero; 