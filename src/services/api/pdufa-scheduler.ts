import { enhancedPdufaScraper, PDUFAData } from './enhanced-pdufa-scraper';
import { discordAlerts } from './discord-alerts';


export interface SchedulerConfig {
  checkTime: string; // "08:00" for 8:00 AM ET
  timezone: string; // "America/New_York"
  alertDaysAhead: number; // 1 for tomorrow alerts
  weeklySummaryDay: string; // "monday" for weekly summary
  enabled: boolean;
}

export interface SchedulerStatus {
  lastRun: string;
  nextRun: string;
  totalAlertsSent: number;
  lastError?: string;
  isRunning: boolean;
}

export class PDUFAScheduler {
  private cache: Map<string, { data: any; timestamp: number }>;
  private config: SchedulerConfig;
  private status: SchedulerStatus;
  private intervalId?: NodeJS.Timeout;
  private isProcessing = false;

  constructor(config?: Partial<SchedulerConfig>) {
    this.cache = new Map();
    this.config = {
      checkTime: "08:00",
      timezone: "America/New_York",
      alertDaysAhead: 1,
      weeklySummaryDay: "monday",
      enabled: true,
      ...config
    };

    this.status = {
      lastRun: new Date().toISOString(),
      nextRun: this.calculateNextRun(),
      totalAlertsSent: 0,
      isRunning: false
    };
  }

  async start(): Promise<void> {
    if (this.intervalId) {
      console.log('PDUFA Scheduler is already running');
      return;
    }

    console.log('Starting PDUFA Scheduler...');
    this.status.isRunning = true;

    // Run initial check
    await this.runScheduledCheck();

    // Set up interval to check every minute
    this.intervalId = setInterval(async () => {
      await this.runScheduledCheck();
    }, 60000); // Check every minute

    console.log('PDUFA Scheduler started successfully');
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.status.isRunning = false;
      console.log('PDUFA Scheduler stopped');
    }
  }

  private async runScheduledCheck(): Promise<void> {
    if (this.isProcessing) {
      console.log('Scheduler check already in progress, skipping...');
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', {
      timeZone: this.config.timezone,
      hour12: false
    });

    // Check if it's time to run (8:00 AM ET)
    if (currentTime.startsWith(this.config.checkTime)) {
      this.isProcessing = true;
      console.log(`Running scheduled PDUFA check at ${currentTime}`);

      try {
        await this.processAlerts();
        this.status.lastRun = now.toISOString();
        this.status.nextRun = this.calculateNextRun();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in scheduled PDUFA check:', error);
        this.status.lastError = errorMessage;
        
        // Send error alert to Discord
        await discordAlerts.sendErrorAlert(errorMessage, 'Scheduled Check');
      } finally {
        this.isProcessing = false;
      }
    }
  }

  private async processAlerts(): Promise<void> {
    console.log('Processing PDUFA alerts...');

    // Get today's date in ET
    const today = new Date().toLocaleDateString('en-CA', {
      timeZone: this.config.timezone
    });

    // Get tomorrow's date in ET
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA', {
      timeZone: this.config.timezone
    });

    // Check for PDUFAs today
          const todayPDUFAs = await enhancedPdufaScraper.getPDUFAsForDate(today);
    if (todayPDUFAs.length > 0) {
      console.log(`Found ${todayPDUFAs.length} PDUFA(s) for today`);
      const success = await discordAlerts.sendPDUFATodayAlert(todayPDUFAs);
      if (success) {
        this.status.totalAlertsSent++;
        this.cache.set(`alert_sent_today_${today}`, { data: todayPDUFAs, timestamp: Date.now() });
      }
    }

    // Check for PDUFAs tomorrow
          const tomorrowPDUFAs = await enhancedPdufaScraper.getPDUFAsForDate(tomorrowStr);
    if (tomorrowPDUFAs.length > 0) {
      console.log(`Found ${tomorrowPDUFAs.length} PDUFA(s) for tomorrow`);
      const success = await discordAlerts.sendPDUFATomorrowAlert(tomorrowPDUFAs);
      if (success) {
        this.status.totalAlertsSent++;
        this.cache.set(`alert_sent_tomorrow_${tomorrowStr}`, { data: tomorrowPDUFAs, timestamp: Date.now() });
      }
    }

    // Check if it's Monday for weekly summary
    const dayOfWeek = new Date().toLocaleDateString('en-US', {
      timeZone: this.config.timezone,
      weekday: 'long'
    }).toLowerCase();

    if (dayOfWeek === this.config.weeklySummaryDay.toLowerCase()) {
      const weeklyPDUFAs = await enhancedPdufaScraper.getUpcomingPDUFAs(7);
      if (weeklyPDUFAs.length > 0) {
        console.log(`Sending weekly summary with ${weeklyPDUFAs.length} PDUFA(s)`);
        const success = await discordAlerts.sendWeeklySummary(weeklyPDUFAs);
        if (success) {
          this.status.totalAlertsSent++;
        }
      }
    }

    console.log('PDUFA alert processing completed');
  }

  private calculateNextRun(): string {
    const now = new Date();
    const [hours, minutes] = this.config.checkTime.split(':').map(Number);
    
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If it's already past the scheduled time today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toISOString();
  }

  async runManualCheck(): Promise<void> {
    console.log('Running manual PDUFA check...');
    await this.processAlerts();
  }

  async sendTestAlert(): Promise<boolean> {
    return await discordAlerts.sendTestAlert();
  }

  getStatus(): SchedulerStatus {
    return { ...this.status };
  }

  getConfig(): SchedulerConfig {
    return { ...this.config };
  }

  async updateConfig(newConfig: Partial<SchedulerConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    this.status.nextRun = this.calculateNextRun();
    
    // Save config to cache
    this.cache.set('pdufa_scheduler_config', { data: this.config, timestamp: Date.now() });
  }

  async getUpcomingAlerts(days: number = 7): Promise<PDUFAData[]> {
    return await enhancedPdufaScraper.getUpcomingPDUFAs(days);
  }

  async validateSystem(): Promise<{
    scraper: boolean;
    discord: boolean;
    cache: boolean;
  }> {
    const results = {
      scraper: false,
      discord: false,
      cache: false
    };

    try {
      // Test scraper
      const testData = await enhancedPdufaScraper.getUpcomingPDUFAs(1);
      results.scraper = true;
      console.log('Scraper validation: PASSED');
    } catch (error) {
      console.error('Scraper validation: FAILED', error);
    }

    try {
      // Test Discord webhook
      results.discord = await discordAlerts.validateWebhook();
      console.log('Discord validation:', results.discord ? 'PASSED' : 'FAILED');
    } catch (error) {
      console.error('Discord validation: FAILED', error);
    }

    try {
      // Test cache
      this.cache.set('test_key', { data: 'test_value', timestamp: Date.now() });
      const testValue = this.cache.get('test_key');
      results.cache = testValue?.data === 'test_value';
      this.cache.delete('test_key');
      console.log('Cache validation:', results.cache ? 'PASSED' : 'FAILED');
    } catch (error) {
      console.error('Cache validation: FAILED', error);
    }

    return results;
  }
}

export const pdufaScheduler = new PDUFAScheduler();
