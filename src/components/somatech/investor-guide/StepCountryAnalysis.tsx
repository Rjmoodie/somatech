import React from 'react';
import { useCountryAnalysisData } from '@/hooks/useInvestorGuideData';

const StepCountryAnalysis: React.FC = () => {
  const { data, isLoading, error } = useCountryAnalysisData();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Step 2: Country-Level Analysis</h2>
      <p className="text-lg text-gray-600 mb-6">Compare major countries on GDP growth, interest rates, political risk, and consumer confidence. Bookmark countries for deeper research.</p>
      {isLoading && <div className="text-center text-blue-500 py-8">Loading country data...</div>}
      {error && <div className="text-center text-red-500 py-8">Failed to load country data.</div>}
      {data && (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Country</th>
                <th className="px-4 py-2 text-left">GDP Growth (%)</th>
                <th className="px-4 py-2 text-left">Interest Rate (%)</th>
                <th className="px-4 py-2 text-left">Political Risk</th>
                <th className="px-4 py-2 text-left">Consumer Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.country} className="border-t">
                  <td className="px-4 py-2 font-medium">{row.country}</td>
                  <td className="px-4 py-2">{row.gdpGrowth !== null && row.gdpGrowth !== undefined ? row.gdpGrowth.toFixed(2) : 'N/A'}</td>
                  <td className="px-4 py-2">{row.interestRate !== null && row.interestRate !== undefined ? row.interestRate.toFixed(2) : 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-400">{row.politicalRisk !== null ? row.politicalRisk : 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-400">{row.consumerConfidence !== null ? row.consumerConfidence : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default StepCountryAnalysis; 