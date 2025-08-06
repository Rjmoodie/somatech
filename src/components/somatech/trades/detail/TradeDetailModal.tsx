import React from 'react';
import { useTrades } from '../context/TradesProvider';

interface TradeDetailModalProps {
  tradeId: string;
  onClose: () => void;
}

const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ tradeId, onClose }) => {
  const { trades } = useTrades();
  const trade = trades.find(t => t.id === tradeId);
  if (!trade) return null;

  return (
    <div className="modal">
      <button className="absolute top-2 right-2" onClick={onClose}>X</button>
      <h2 className="text-xl font-bold mb-2">Trade Detail: {trade.ticker}</h2>
      <div>Position: {trade.position}</div>
      <div>Entry: {trade.entryTime} @ {trade.entryPrice}</div>
      <div>Exit: {trade.exitTime} @ {trade.exitPrice}</div>
      <div>Size: {trade.size}</div>
      <div>P/L: {trade.profitLoss}</div>
      <div>Strategy: {trade.strategy}</div>
      {/* TODO: Add screenshots, rationale, replay, news/events, etc. */}
    </div>
  );
};

export default TradeDetailModal; 