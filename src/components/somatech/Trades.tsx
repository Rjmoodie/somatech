import React, { useState } from 'react';
import { TradesProvider } from './trades/context/TradesProvider';
import ConnectBrokerDialog from './trades/ConnectBrokerDialog';
import TradesDashboard from './trades/dashboard/TradesDashboard';
import TradeLogTable from './trades/logs/TradeLogTable';
import TradingRulesPanel from './trades/rules/TradingRulesPanel';
import TradeAISuggestions from './trades/ai/TradeAISuggestions';
import TradeDetailModal from './trades/detail/TradeDetailModal';

const Trades: React.FC = () => {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  return (
    <TradesProvider>
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Trades</h1>
        <ConnectBrokerDialog />
        <TradesDashboard />
        <div className="card p-4">
          <h2 className="text-xl font-bold mb-4">Trade Log</h2>
          {/* For demo, clicking a row could open detail modal. In real app, pass setSelectedTradeId to TradeLogTable */}
          <TradeLogTable />
        </div>
        <TradingRulesPanel />
        <TradeAISuggestions />
        {selectedTradeId && (
          <TradeDetailModal tradeId={selectedTradeId} onClose={() => setSelectedTradeId(null)} />
        )}
      </div>
    </TradesProvider>
  );
};

export default Trades; 