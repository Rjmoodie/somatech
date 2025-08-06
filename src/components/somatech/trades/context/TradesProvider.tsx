import React, { createContext, useContext, useState, useEffect } from 'react';

interface Trade {
  id: string;
  ticker: string;
  position: 'long' | 'short';
  entryTime: string;
  exitTime: string;
  size: number;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  strategy: string;
}

interface TradesContextType {
  trades: Trade[];
  isSyncing: boolean;
  connectBroker: () => Promise<void>;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export const TradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock connectBroker
  const connectBroker = async () => {
    setIsSyncing(true);
    // TODO: Implement real OAuth and trade import
    setTimeout(() => {
      setTrades([
        {
          id: '1',
          ticker: 'AAPL',
          position: 'long',
          entryTime: '2024-07-01T09:30:00Z',
          exitTime: '2024-07-01T10:15:00Z',
          size: 100,
          entryPrice: 190.5,
          exitPrice: 192.2,
          profitLoss: 170,
          strategy: 'Breakout',
        },
      ]);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <TradesContext.Provider value={{ trades, isSyncing, connectBroker }}>
      {children}
    </TradesContext.Provider>
  );
};

export function useTrades() {
  const ctx = useContext(TradesContext);
  if (!ctx) throw new Error('useTrades must be used within TradesProvider');
  return ctx;
} 