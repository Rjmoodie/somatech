import { EnhancedPDUFAScraper } from './enhanced-pdufa-scraper';
import { PDUFAScheduler } from './pdufa-scheduler';
import { discordAlerts } from './discord-alerts';

export interface PDUFAData {
  ticker: string;
  company: string;
  drug: string;
  indication: string;
  pdufaDate: string;
  reviewType: string;
  status: string;
  sourceUrl?: string;
  lastUpdated: string;
  confidence: number;
}

export interface PDUFAStats {
  total: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
  thisMonth: number;
}

export interface PDUFAResult {
  data: PDUFAData[];
  stats: PDUFAStats;
}

export class PDUFAAPI {
  private scraper: EnhancedPDUFAScraper;
  private scheduler: PDUFAScheduler;
  private alerts: any;

  constructor() {
    this.scraper = new EnhancedPDUFAScraper();
    this.scheduler = new PDUFAScheduler();
    this.alerts = discordAlerts;
  }

  async getPDUFAData(): Promise<PDUFAResult> {
    try {
      const data = await this.scraper.getPDUFAData();
      const stats = this.calculateStats(data);
      return { data, stats };
    } catch (error) {
      console.error('PDUFA API error:', error);
      throw error;
    }
  }

  async sendTestAlert(): Promise<void> {
    try {
      await this.alerts.sendTestAlert();
    } catch (error) {
      console.error('Test alert error:', error);
      throw error;
    }
  }

  async startScheduler(): Promise<void> {
    try {
      await this.scheduler.start();
    } catch (error) {
      console.error('Scheduler start error:', error);
      throw error;
    }
  }

  async stopScheduler(): Promise<void> {
    try {
      await this.scheduler.stop();
    } catch (error) {
      console.error('Scheduler stop error:', error);
      throw error;
    }
  }

  private calculateStats(data: PDUFAData[]): PDUFAStats {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() + 1);

    return {
      total: data.length,
      today: data.filter(item => this.isSameDay(new Date(item.pdufaDate), today)).length,
      tomorrow: data.filter(item => this.isSameDay(new Date(item.pdufaDate), tomorrow)).length,
      thisWeek: data.filter(item => {
        const itemDate = new Date(item.pdufaDate);
        return itemDate >= today && itemDate <= thisWeek;
      }).length,
      thisMonth: data.filter(item => {
        const itemDate = new Date(item.pdufaDate);
        return itemDate >= today && itemDate <= thisMonth;
      }).length
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }
}
