import React from "react";

const InvestorInsightsSection: React.FC = () => (
  <section className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Investor Insights</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>"How we value X industry" articles</li>
      <li>"What changed this quarter?" notes</li>
      <li>YouTube/Podcast embeds from thought leaders</li>
      <li>Daily thought: 1 sentence market wisdom</li>
    </ul>
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <strong>More insights and media coming soon.</strong>
    </div>
  </section>
);

export default InvestorInsightsSection; 