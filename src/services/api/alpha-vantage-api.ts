import { discordAlerts } from './discord-alerts';

export interface EarningsData {
  symbol: string;
  name: string;
  reportDate: string;
  fiscalDateEnding: string;
  estimate: string;
  actual: string;
  surprise: string;
  surprisePercent: string;
  timeZone: string;
  lastUpdated: string;
  isSP500: boolean;
}

export interface EarningsStats {
  total: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
  sp500Count: number;
}

export interface EarningsResult {
  data: EarningsData[];
  stats: EarningsStats;
}

// S&P 500 companies list for filtering
const SP500_COMPANIES = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'BRK.B', 'LLY', 'V', 'TSM',
  'UNH', 'XOM', 'JNJ', 'WMT', 'JPM', 'PG', 'MA', 'HD', 'CVX', 'AVGO',
  'ABBV', 'PFE', 'KO', 'PEP', 'BAC', 'TMO', 'COST', 'ACN', 'DHR', 'VZ',
  'ADBE', 'NFLX', 'CRM', 'CMCSA', 'NEE', 'TXN', 'QCOM', 'HON', 'INTC', 'AMD',
  'INTU', 'IBM', 'UNP', 'CAT', 'GS', 'MS', 'RTX', 'AMGN', 'ISRG', 'GILD'
];

export class AlphaVantageAPI {
  private alerts: any;
  private apiKey: string;

  constructor() {
    this.alerts = discordAlerts;
    this.apiKey = process.env.VITE_ALPHA_VANTAGE_API_KEY || '';
  }

  async getEarningsData(): Promise<EarningsResult> {
    try {
      // For now, return mock data since we don't have a real API key
      const mockData = this.getMockEarningsData();
      const stats = this.calculateStats(mockData);
      return { data: mockData, stats };
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      throw error;
    }
  }

  async sendTestAlert(): Promise<void> {
    try {
      await this.alerts.sendEarningsTestAlert();
    } catch (error) {
      console.error('Earnings test alert error:', error);
      throw error;
    }
  }

  private getMockEarningsData(): EarningsData[] {
    const today = new Date();
    const mockData: EarningsData[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        reportDate: today.toISOString().split('T')[0],
        fiscalDateEnding: '2024-12-31',
        estimate: '2.10',
        actual: '2.18',
        surprise: '0.08',
        surprisePercent: '3.81',
        timeZone: 'UTC-4',
        lastUpdated: new Date().toISOString(),
        isSP500: true
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        reportDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fiscalDateEnding: '2024-12-31',
        estimate: '2.78',
        actual: '2.93',
        surprise: '0.15',
        surprisePercent: '5.40',
        timeZone: 'UTC-4',
        lastUpdated: new Date().toISOString(),
        isSP500: true
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        reportDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fiscalDateEnding: '2024-12-31',
        estimate: '1.59',
        actual: '1.64',
        surprise: '0.05',
        surprisePercent: '3.14',
        timeZone: 'UTC-4',
        lastUpdated: new Date().toISOString(),
        isSP500: true
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        reportDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fiscalDateEnding: '2024-12-31',
        estimate: '0.80',
        actual: '0.78',
        surprise: '-0.02',
        surprisePercent: '-2.50',
        timeZone: 'UTC-4',
        lastUpdated: new Date().toISOString(),
        isSP500: true
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        reportDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fiscalDateEnding: '2024-12-31',
        estimate: '4.59',
        actual: '5.16',
        surprise: '0.57',
        surprisePercent: '12.42',
        timeZone: 'UTC-4',
        lastUpdated: new Date().toISOString(),
        isSP500: true
      }
    ];

    return mockData;
  }

  private calculateStats(data: EarningsData[]): EarningsStats {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);

    return {
      total: data.length,
      today: data.filter(item => this.isSameDay(new Date(item.reportDate), today)).length,
      tomorrow: data.filter(item => this.isSameDay(new Date(item.reportDate), tomorrow)).length,
      thisWeek: data.filter(item => {
        const itemDate = new Date(item.reportDate);
        return itemDate >= today && itemDate <= thisWeek;
      }).length,
      sp500Count: data.filter(item => item.isSP500).length
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  // Filter data to only include S&P 500 companies
  filterSP500(data: EarningsData[]): EarningsData[] {
    return data.filter(item => SP500_COMPANIES.includes(item.symbol));
  }
}
