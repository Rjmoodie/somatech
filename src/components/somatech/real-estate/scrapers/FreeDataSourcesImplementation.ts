// Free Data Sources Implementation Strategy
// This file contains the implementation logic for free data sources

import { freeDataSources, FreeDataSource } from './FreeDataSources';

export interface ScrapingResult {
  success: boolean;
  data: any[];
  errors: string[];
  source: string;
  timestamp: string;
  recordCount: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export interface ErrorLog {
  source: string;
  error: string;
  timestamp: string;
  retryCount: number;
}

// Rate limiting configuration for free sources
export const rateLimitConfig: Record<string, RateLimitConfig> = {
  'tax-delinquent-los-angeles': { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 1000 },
  'code-violations-chicago': { requestsPerMinute: 30, requestsPerHour: 500, requestsPerDay: 5000 },
  'pre-foreclosure-broward': { requestsPerMinute: 5, requestsPerHour: 50, requestsPerDay: 500 },
  'probate-miami-dade': { requestsPerMinute: 5, requestsPerHour: 50, requestsPerDay: 500 },
  'vacant-usps': { requestsPerMinute: 20, requestsPerHour: 200, requestsPerDay: 2000 },
  'environmental-epa': { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 1000 }
};

// Implementation phases with priorities
export const implementationPhases = {
  IMMEDIATE: [
    'tax-delinquent-los-angeles',
    'tax-delinquent-harris', 
    'tax-delinquent-maricopa',
    'code-violations-chicago',
    'code-violations-newyork',
    'code-violations-los-angeles',
    'pre-foreclosure-broward',
    'pre-foreclosure-miami-dade',
    'pre-foreclosure-harris'
  ],
  PHASE_2: [
    'probate-miami-dade',
    'probate-broward',
    'vacant-usps',
    'absentee-los-angeles',
    'evictions-los-angeles',
    'divorce-los-angeles',
    'rental-registration-chicago',
    'environmental-epa',
    'demolition-chicago',
    'utility-shutoffs-chicago'
  ],
  PHASE_3: [
    'senior-owned-los-angeles',
    'reo-hud',
    'reo-fannie',
    'reo-freddie'
  ]
};

// Data validation schemas
export const dataValidationSchemas = {
  'tax-delinquent': {
    required: ['ownerName', 'propertyAddress', 'taxAmount', 'delinquentYear'],
    optional: ['mailingAddress', 'propertyValue', 'lastPaymentDate']
  },
  'code-violations': {
    required: ['ownerName', 'propertyAddress', 'violationType', 'violationDate'],
    optional: ['fineAmount', 'status', 'caseNumber', 'description']
  },
  'pre-foreclosures': {
    required: ['ownerName', 'propertyAddress', 'lenderName', 'filingDate'],
    optional: ['loanAmount', 'caseNumber', 'status', 'auctionDate']
  },
  'probate-properties': {
    required: ['deceasedName', 'propertyAddress', 'filingDate', 'caseNumber'],
    optional: ['executorName', 'estimatedValue', 'status', 'hearingDate']
  },
  'vacant-properties': {
    required: ['propertyAddress', 'vacancyDate', 'status'],
    optional: ['ownerName', 'lastOccupied', 'inspectionDate']
  },
  'absentee-owners': {
    required: ['ownerName', 'propertyAddress', 'mailingAddress'],
    optional: ['mailingState', 'mailingZip', 'propertyValue']
  }
};

// Rate limiter class
export class RateLimiter {
  private requestCounts = new Map<string, { minute: number[], hour: number[], day: number[] }>();

  async checkLimit(source: string): Promise<boolean> {
    const config = rateLimitConfig[source];
    if (!config) return true; // No limit configured

    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const hour = Math.floor(now / 3600000);
    const day = Math.floor(now / 86400000);

    if (!this.requestCounts.has(source)) {
      this.requestCounts.set(source, { minute: [], hour: [], day: [] });
    }

    const counts = this.requestCounts.get(source)!;

    // Clean old timestamps
    counts.minute = counts.minute.filter(t => t >= minute - 1);
    counts.hour = counts.hour.filter(t => t >= hour - 1);
    counts.day = counts.day.filter(t => t >= day - 1);

    // Check limits
    if (counts.minute.length >= config.requestsPerMinute) return false;
    if (counts.hour.length >= config.requestsPerHour) return false;
    if (counts.day.length >= config.requestsPerDay) return false;

    // Add current request
    counts.minute.push(minute);
    counts.hour.push(hour);
    counts.day.push(day);

    return true;
  }

  async waitForNextRequest(source: string): Promise<void> {
    while (!(await this.checkLimit(source))) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
  }

  getRemainingRequests(source: string): { minute: number; hour: number; day: number } {
    const config = rateLimitConfig[source];
    if (!config) return { minute: Infinity, hour: Infinity, day: Infinity };

    const counts = this.requestCounts.get(source);
    if (!counts) return { minute: config.requestsPerMinute, hour: config.requestsPerHour, day: config.requestsPerDay };

    return {
      minute: Math.max(0, config.requestsPerMinute - counts.minute.length),
      hour: Math.max(0, config.requestsPerHour - counts.hour.length),
      day: Math.max(0, config.requestsPerDay - counts.day.length)
    };
  }
}

// Error handler class
export class ErrorHandler {
  private errorLogs: ErrorLog[] = [];
  private retryCounts = new Map<string, number>();

  async handleAPIError(error: any, source: string): Promise<void> {
    const errorLog: ErrorLog = {
      source,
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      retryCount: this.retryCounts.get(source) || 0
    };

    this.errorLogs.push(errorLog);
    console.error(`Error scraping ${source}:`, error);

    // Increment retry count
    this.retryCounts.set(source, (this.retryCounts.get(source) || 0) + 1);
  }

  async retryRequest<T>(
    requestFn: () => Promise<T>, 
    source: string, 
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        await this.handleAPIError(error, source);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  getErrorLogs(source?: string): ErrorLog[] {
    if (source) {
      return this.errorLogs.filter(log => log.source === source);
    }
    return this.errorLogs;
  }

  clearErrorLogs(): void {
    this.errorLogs = [];
    this.retryCounts.clear();
  }
}

// Data validator class
export class DataValidator {
  validatePropertyData(data: any, dataType: string): { isValid: boolean; errors: string[] } {
    const schema = dataValidationSchemas[dataType];
    if (!schema) {
      return { isValid: true, errors: [] }; // No schema defined
    }

    const errors: string[] = [];

    // Check required fields
    for (const field of schema.required) {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate data types and formats
    if (data.propertyAddress && typeof data.propertyAddress !== 'string') {
      errors.push('Property address must be a string');
    }

    if (data.taxAmount && isNaN(Number(data.taxAmount))) {
      errors.push('Tax amount must be a number');
    }

    if (data.violationDate && !this.isValidDate(data.violationDate)) {
      errors.push('Invalid violation date format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  validateAddress(address: string): boolean {
    // Basic address validation
    const addressRegex = /^\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl|Way|Terrace|Ter)/i;
    return addressRegex.test(address);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

// Main scraper class
export class FreeDataScraper {
  private rateLimiter = new RateLimiter();
  private errorHandler = new ErrorHandler();
  private dataValidator = new DataValidator();

  async scrapeSource(sourceId: string): Promise<ScrapingResult> {
    const source = freeDataSources.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    // Check rate limits
    await this.rateLimiter.waitForNextRequest(sourceId);

    try {
      let data: any[] = [];

      if (source.method === 'api') {
        data = await this.scrapeAPI(source);
      } else if (source.method === 'scraper') {
        data = await this.scrapeWeb(source);
      } else if (source.method === 'csv') {
        data = await this.scrapeCSV(source);
      }

      // Validate data
      const validationResults = data.map(item => 
        this.dataValidator.validatePropertyData(item, source.dataType)
      );

      const validData = data.filter((_, index) => validationResults[index].isValid);
      const errors = validationResults
        .flatMap(result => result.errors)
        .concat(data.filter((_, index) => !validationResults[index].isValid)
          .map(() => `Invalid data format for ${sourceId}`));

      return {
        success: validData.length > 0,
        data: validData,
        errors,
        source: sourceId,
        timestamp: new Date().toISOString(),
        recordCount: validData.length
      };

    } catch (error) {
      await this.errorHandler.handleAPIError(error, sourceId);
      return {
        success: false,
        data: [],
        errors: [error.message || 'Unknown error'],
        source: sourceId,
        timestamp: new Date().toISOString(),
        recordCount: 0
      };
    }
  }

  private async scrapeAPI(source: FreeDataSource): Promise<any[]> {
    if (!source.apiConfig) {
      throw new Error(`No API config for source: ${source.id}`);
    }

    const response = await fetch(source.apiConfig.endpoint, {
      headers: source.apiConfig.headers || {},
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  private async scrapeWeb(source: FreeDataSource): Promise<any[]> {
    // This would use Puppeteer or similar for web scraping
    // For now, return mock data
    return [
      {
        ownerName: 'John Doe',
        propertyAddress: '123 Main St, Los Angeles, CA 90210',
        taxAmount: 5000,
        delinquentYear: 2023
      }
    ];
  }

  private async scrapeCSV(source: FreeDataSource): Promise<any[]> {
    // This would parse CSV files
    // For now, return mock data
    return [
      {
        ownerName: 'Jane Smith',
        propertyAddress: '456 Oak Ave, Chicago, IL 60601',
        violationType: 'Building Code Violation',
        violationDate: '2023-01-15'
      }
    ];
  }

  async scrapeAllImmediateSources(): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    for (const sourceId of implementationPhases.IMMEDIATE) {
      try {
        const result = await this.scrapeSource(sourceId);
        results.push(result);
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to scrape ${sourceId}:`, error);
      }
    }

    return results;
  }

  getRateLimitStatus(sourceId: string): { remaining: { minute: number; hour: number; day: number } } {
    return {
      remaining: this.rateLimiter.getRemainingRequests(sourceId)
    };
  }

  getErrorLogs(sourceId?: string): ErrorLog[] {
    return this.errorHandler.getErrorLogs(sourceId);
  }
}

// Usage example
export const createFreeDataScraper = (): FreeDataScraper => {
  return new FreeDataScraper();
}; 