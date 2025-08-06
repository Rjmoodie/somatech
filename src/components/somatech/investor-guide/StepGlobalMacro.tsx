import React from 'react';
import { useGlobalMacroData } from '@/hooks/useInvestorGuideData';

const macroLabels: Record<string, string> = {
  gdpGrowth: 'US GDP Growth (YoY %)',
  inflation: 'US CPI (YoY %)',
  oilPrice: 'Brent Oil Price ($/bbl)',
  usdIndex: 'USD Index (DXY)',
  fedFundsRate: 'Fed Funds Rate (%)',
  treasury10Y: '10Y Treasury Yield (%)',
  unemployment: 'US Unemployment Rate (%)',
};

const StepGlobalMacro: React.FC = () => {
  const { data, isLoading, error } = useGlobalMacroData();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Step 1: Global Macro View</h2>
      <p className="text-lg text-gray-600 mb-6">Explore global economic indicators like GDP, inflation, and central bank rates. Visualize macro trends and understand their impact on investing.</p>
      {isLoading && <div className="text-center text-blue-500 py-8">Loading macro data...</div>}
      {error && <div className="text-center text-red-500 py-8">Failed to load macro data.</div>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(macroLabels).map(([key, label]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-gray-500 text-sm mb-2">{label}</span>
              <span className="text-2xl font-bold">
                {data[key] !== null && data[key] !== undefined ? data[key].toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default StepGlobalMacro; 