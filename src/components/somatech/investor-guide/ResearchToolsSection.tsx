import React from "react";

const tools = [
  { name: "Dataroma", function: "Institutional holdings", source: "Public (scraped)" },
  { name: "EDGAR", function: "SEC filing access", source: "sec.gov" },
  { name: "TradingEconomics", function: "Macro indicators by country", source: "Free/Paid" },
  { name: "Alpha Vantage", function: "Financial metrics, tickers", source: "Free tier" },
  { name: "World Bank API", function: "Country data & trends", source: "Public" },
  { name: "YFinance", function: "Stock data/ratios", source: "Python API" },
];

const ResearchToolsSection: React.FC = () => (
  <section className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Research Tools</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Tool/API</th>
            <th className="p-2">Function</th>
            <th className="p-2">Source</th>
            <th className="p-2">Sample</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((t) => (
            <tr key={t.name}>
              <td className="p-2 font-semibold">{t.name}</td>
              <td className="p-2">{t.function}</td>
              <td className="p-2">{t.source}</td>
              <td className="p-2">
                <button className="px-2 py-1 bg-blue-100 rounded mr-2">Copy API</button>
                <button className="px-2 py-1 bg-green-100 rounded">Download JSON</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ResearchToolsSection; 