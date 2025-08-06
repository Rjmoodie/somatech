import React from "react";

const RealTimeDataFeedsSection: React.FC = () => (
  <section className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Real-Time Data Feeds</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Embed Dataroma tables</li>
      <li>Automated updates for top 13F filings</li>
      <li>Visuals for changes in quarterly allocations</li>
      <li>Notifications for major buys/sells</li>
    </ul>
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <strong>Live data integrations coming soon.</strong>
    </div>
  </section>
);

export default RealTimeDataFeedsSection; 