import React from 'react';

const MarketSummary: React.FC = () => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <span className="text-gray-500 text-sm mb-2">Interest Rate</span>
      <span className="text-2xl font-bold">5.25%</span>
      <span className="text-green-600 text-xs mt-1">+0.25% YoY</span>
    </div>
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <span className="text-gray-500 text-sm mb-2">CPI (Inflation)</span>
      <span className="text-2xl font-bold">3.1%</span>
      <span className="text-red-600 text-xs mt-1">-0.4% MoM</span>
    </div>
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <span className="text-gray-500 text-sm mb-2">S&P 500 Index</span>
      <span className="text-2xl font-bold">4,950</span>
      <span className="text-green-600 text-xs mt-1">+1.2% Today</span>
    </div>
  </section>
);

export default MarketSummary; 