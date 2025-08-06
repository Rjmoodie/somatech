import React from 'react';
import { useTrades } from '../context/TradesProvider';

const TradesDashboard: React.FC = () => {
  const { trades } = useTrades();

  // Mock metrics
  const totalPnL = trades.reduce((sum, t) => sum + t.profitLoss, 0);
  const winRate = trades.length ? (trades.filter(t => t.profitLoss > 0).length / trades.length) * 100 : 0;

  return (
    <div className="dashboard">
      <h2 className="text-2xl font-bold mb-4">Trades Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card">
          <div className="text-lg">Total PnL</div>
          <div className="text-2xl font-bold">${totalPnL.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="text-lg">Win Rate</div>
          <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
        </div>
      </div>
      {/* TODO: Add equity curve, top tickers, best/worst trades, etc. */}
    </div>
  );
};

export default TradesDashboard; 