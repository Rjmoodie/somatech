// Brokerage abstraction for multi-broker support

export interface BrokerAdapter {
  name: string;
  connect: () => Promise<any>;
  fetchTrades: (token: string) => Promise<any[]>;
}

export const brokerAdapters: BrokerAdapter[] = [
  // Add Thinkorswim, Interactive Brokers, Alpaca, etc.
]; 