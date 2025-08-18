import { enhancedPdufaScraper, PDUFAData } from '../services/enhanced-pdufa-scraper';
import { pdufaScheduler } from '../services/pdufa-scheduler';
import { discordAlerts } from '../services/discord-alerts';

export interface PDUFAAPIResponse {
  success: boolean;
  data?: PDUFAData[];
  message?: string;
  timestamp: string;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PDUFAStats {
  totalPDUFAs: number;
  upcomingPDUFAs: number;
  todayPDUFAs: number;
  tomorrowPDUFAs: number;
  thisWeekPDUFAs: number;
  thisMonthPDUFAs: number;
  lastUpdated: string;
}

export class PDUFAAPI {
  private static instance: PDUFAAPI;

  private constructor() {}

  static getInstance(): PDUFAAPI {
    if (!PDUFAAPI.instance) {
      PDUFAAPI.instance = new PDUFAAPI();
    }
    return PDUFAAPI.instance;
  }

  async getAllPDUFAs(page: number = 1, limit: number = 50): Promise<PDUFAAPIResponse> {
    try {
      const allData = await enhancedPdufaScraper.scrapeAllSources();
      const total = allData.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allData.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedData,
        total,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch PDUFA data',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getUpcomingPDUFAs(days: number = 30): Promise<PDUFAAPIResponse> {
    try {
      const data = await enhancedPdufaScraper.getUpcomingPDUFAs(days);
      
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch upcoming PDUFAs',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getPDUFAsForDate(date: string): Promise<PDUFAAPIResponse> {
    try {
      const data = await enhancedPdufaScraper.getPDUFAsForDate(date);
      
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch PDUFAs for date',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getPDUFAsByTicker(ticker: string): Promise<PDUFAAPIResponse> {
    try {
      const allData = await enhancedPdufaScraper.scrapeAllSources();
      const data = allData.filter(item => 
        item.ticker.toLowerCase() === ticker.toLowerCase()
      );
      
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch PDUFAs by ticker',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getPDUFAsByCompany(company: string): Promise<PDUFAAPIResponse> {
    try {
      const allData = await enhancedPdufaScraper.scrapeAllSources();
      const data = allData.filter(item => 
        item.company.toLowerCase().includes(company.toLowerCase())
      );
      
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch PDUFAs by company',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStats(): Promise<PDUFAAPIResponse & { stats?: PDUFAStats }> {
    try {
      const allData = await enhancedPdufaScraper.scrapeAllSources();
      const today = new Date().toLocaleDateString('en-CA');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
      
      const todayPDUFAs = allData.filter(item => item.pdufaDate === today);
      const tomorrowPDUFAs = allData.filter(item => item.pdufaDate === tomorrowStr);
      
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() + 7);
      const thisWeekPDUFAs = allData.filter(item => {
        const pdufaDate = new Date(item.pdufaDate);
        return pdufaDate >= new Date() && pdufaDate <= thisWeek;
      });
      
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() + 1);
      const thisMonthPDUFAs = allData.filter(item => {
        const pdufaDate = new Date(item.pdufaDate);
        return pdufaDate >= new Date() && pdufaDate <= thisMonth;
      });

      const stats: PDUFAStats = {
        totalPDUFAs: allData.length,
        upcomingPDUFAs: allData.filter(item => new Date(item.pdufaDate) >= new Date()).length,
        todayPDUFAs: todayPDUFAs.length,
        tomorrowPDUFAs: tomorrowPDUFAs.length,
        thisWeekPDUFAs: thisWeekPDUFAs.length,
        thisMonthPDUFAs: thisMonthPDUFAs.length,
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch PDUFA stats',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getSchedulerStatus(): Promise<PDUFAAPIResponse & { status?: any }> {
    try {
      const status = pdufaScheduler.getStatus();
      const config = pdufaScheduler.getConfig();
      
      return {
        success: true,
        status: { ...status, config },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch scheduler status',
        timestamp: new Date().toISOString()
      };
    }
  }

  async runManualCheck(): Promise<PDUFAAPIResponse> {
    try {
      await pdufaScheduler.runManualCheck();
      
      return {
        success: true,
        message: 'Manual PDUFA check completed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to run manual check',
        timestamp: new Date().toISOString()
      };
    }
  }

  async sendTestAlert(): Promise<PDUFAAPIResponse> {
    try {
      const success = await pdufaScheduler.sendTestAlert();
      
      return {
        success,
        message: success ? 'Test alert sent successfully' : 'Failed to send test alert',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test alert',
        timestamp: new Date().toISOString()
      };
    }
  }

  async validateSystem(): Promise<PDUFAAPIResponse & { validation?: any }> {
    try {
      const validation = await pdufaScheduler.validateSystem();
      
      return {
        success: true,
        validation,
        message: 'System validation completed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to validate system',
        timestamp: new Date().toISOString()
      };
    }
  }

  async clearCache(): Promise<PDUFAAPIResponse> {
    try {
      await enhancedPdufaScraper.clearCache();
      
      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear cache',
        timestamp: new Date().toISOString()
      };
    }
  }

  async searchPDUFAs(query: string): Promise<PDUFAAPIResponse> {
    try {
      const allData = await enhancedPdufaScraper.scrapeAllSources();
      const searchTerm = query.toLowerCase();
      
      const data = allData.filter(item => 
        item.ticker.toLowerCase().includes(searchTerm) ||
        item.company.toLowerCase().includes(searchTerm) ||
        item.drug.toLowerCase().includes(searchTerm) ||
        item.indication.toLowerCase().includes(searchTerm)
      );
      
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search PDUFAs',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const pdufaAPI = PDUFAAPI.getInstance();
