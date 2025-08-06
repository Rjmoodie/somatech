// Intelligent Web Scraping Engine (Browser-Safe Version)
// Handles data validation and processing for 50-state coverage without Puppeteer

export interface ScrapingResult {
  success: boolean;
  data: ProcessedProperty[];
  source: string;
  timestamp: string;
  recordCount: number;
  errors: string[];
  metadata: {
    processingTime: number;
    selectorUsed: string;
    successRate: number;
  };
}

export interface ProcessedProperty {
  id: string;
  address: string;
  owner_name: string;
  assessed_value?: number;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  latitude?: number;
  longitude?: number;
  state: string;
  county: string;
  zip?: string;
  status: string;
  created_at: string;
  data_source: string;
  confidence_score: number;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  method: 'scraper' | 'api' | 'csv';
  dataType: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked: string;
  successRate: number;
  selectors?: {
    tableSelector?: string;
    rowSelector?: string;
    ownerSelector?: string;
    addressSelector?: string;
    valueSelector?: string;
    dateSelector?: string;
  };
}

export interface ScrapingConfig {
  maxRetries: number;
  timeout: number;
  delayBetweenRequests: number;
  userAgents: string[];
  proxyList?: string[];
}

export class IntelligentScraper {
  private config: ScrapingConfig;
  private userAgentIndex = 0;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = {
      maxRetries: 3,
      timeout: 30000,
      delayBetweenRequests: 2000,
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
      ],
      ...config
    };
  }

  /**
   * Scrape property data from a county data source (Browser-safe version)
   */
  async scrapeCountyData(source: DataSource): Promise<ScrapingResult> {
    const startTime = Date.now();
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`🔍 Attempt ${attempt}/${this.config.maxRetries} for ${source.url}`);
        
        // Use fetch API instead of Puppeteer
        const response = await fetch(source.url, {
          method: 'GET',
          headers: {
            'User-Agent': this.getNextUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          signal: AbortSignal.timeout(this.config.timeout)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Process the HTML content
        const data = await this.processHtmlContent(html, source);
        
        if (data.length > 0) {
          // Process and validate data
          const processedData = await this.processRawData(data, source);
          
          const processingTime = Date.now() - startTime;
          const successRate = (processedData.length / data.length) * 100;
          
          console.log(`✅ Scraping successful: ${processedData.length} properties from ${source.url}`);
          
          return {
            success: true,
            data: processedData,
            source: source.url,
            timestamp: new Date().toISOString(),
            recordCount: processedData.length,
            errors: [],
            metadata: {
              processingTime,
              selectorUsed: 'fetch-api',
              successRate
            }
          };
        }
        
        throw new Error('No data found in response');
        
      } catch (error) {
        lastError = error.message;
        console.log(`⚠️ Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.delayBetweenRequests);
        }
      }
    }
    
    console.error(`❌ All attempts failed for ${source.url}: ${lastError}`);
    
    return {
      success: false,
      data: [],
      source: source.url,
      timestamp: new Date().toISOString(),
      recordCount: 0,
      errors: [lastError],
      metadata: {
        processingTime: Date.now() - startTime,
        selectorUsed: 'fetch-api',
        successRate: 0
      }
    };
  }

  /**
   * Process HTML content to extract property data
   */
  private async processHtmlContent(html: string, source: DataSource): Promise<any[]> {
    // Create a simple DOM parser for basic HTML processing
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to find property data in common table structures
    const tables = doc.querySelectorAll('table');
    const data: any[] = [];
    
    for (const table of tables) {
      const rows = table.querySelectorAll('tr');
      
      for (const row of rows) {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 3) {
          const rowData: any = {};
          
          // Extract basic information from cells
          for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const text = cell.textContent?.trim() || '';
            
            // Try to identify data types based on content
            if (text.includes('$') || /^\d+$/.test(text)) {
              rowData.value = this.parseCurrency(text);
            } else if (text.includes('St') || text.includes('Ave') || text.includes('Rd')) {
              rowData.address = text;
            } else if (text.includes('LLC') || text.includes('Inc') || text.includes('Corp')) {
              rowData.owner = text;
            } else {
              rowData[`field${i}`] = text;
            }
          }
          
          if (rowData.address || rowData.owner || rowData.value) {
            data.push(rowData);
          }
        }
      }
    }
    
    // If no table data found, try to extract from other elements
    if (data.length === 0) {
      const propertyElements = doc.querySelectorAll('[class*="property"], [id*="property"], [class*="listing"], [id*="listing"]');
      
      for (const element of propertyElements) {
        const text = element.textContent?.trim() || '';
        if (text.length > 10) {
          data.push({
            rawText: text,
            source: source.url
          });
        }
      }
    }
    
    return data;
  }

  /**
   * Process raw data into structured property records
   */
  private async processRawData(rawData: any[], source: DataSource): Promise<ProcessedProperty[]> {
    const processed: ProcessedProperty[] = [];
    
    for (const raw of rawData) {
      const property = await this.normalizeProperty(raw, source);
      if (property && this.isValidProperty(property)) {
        processed.push(property);
      }
    }
    
    return processed;
  }

  /**
   * Normalize raw property data into structured format
   */
  private async normalizeProperty(raw: any, source: DataSource): Promise<ProcessedProperty | null> {
    try {
      const address = raw.address || raw.rawText || 'Unknown Address';
      const owner = raw.owner || 'Unknown Owner';
      const value = raw.value || 0;
      
      const location = this.extractLocation(address, source.url);
      
      return {
        id: `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        address: this.standardizeAddress(address),
        owner_name: this.standardizeName(owner),
        assessed_value: typeof value === 'number' ? value : this.parseCurrency(value.toString()) || 0,
        property_type: 'Single Family', // Default
        bedrooms: 0,
        bathrooms: 0,
        square_feet: 0,
        lot_size: 0,
        year_built: 0,
        latitude: 0,
        longitude: 0,
        state: location.state,
        county: location.county,
        zip: '',
        status: 'active',
        created_at: new Date().toISOString(),
        data_source: source.url,
        confidence_score: this.calculateConfidence(raw)
      };
    } catch (error) {
      console.error('Error normalizing property:', error);
      return null;
    }
  }

  /**
   * Validate property data
   */
  private isValidProperty(property: ProcessedProperty): boolean {
    return (
      property.address &&
      property.address !== 'Unknown Address' &&
      property.owner_name &&
      property.owner_name !== 'Unknown Owner' &&
      property.state &&
      property.county
    );
  }

  /**
   * Standardize address format
   */
  private standardizeAddress(address: string): string {
    return address
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  /**
   * Standardize owner name format
   */
  private standardizeName(name: string): string {
    return name
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  /**
   * Parse currency values
   */
  private parseCurrency(value: string): number | null {
    const cleaned = value.replace(/[$,]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Extract location information from address and URL
   */
  private extractLocation(address: string, url: string): { state: string; county: string } {
    // Try to extract from URL first
    const urlMatch = url.match(/([A-Z]{2})/);
    const state = urlMatch ? urlMatch[1] : 'Unknown';
    
    // Try to extract county from URL or address
    const countyMatch = url.match(/([A-Za-z]+)\s*County/i) || address.match(/([A-Za-z]+)\s*County/i);
    const county = countyMatch ? countyMatch[1] : 'Unknown';
    
    return { state, county };
  }

  /**
   * Calculate confidence score for data quality
   */
  private calculateConfidence(raw: any): number {
    let score = 0;
    
    if (raw.address) score += 30;
    if (raw.owner) score += 25;
    if (raw.value) score += 25;
    if (raw.state) score += 10;
    if (raw.county) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Get next user agent from rotation
   */
  private getNextUserAgent(): string {
    const userAgent = this.config.userAgents[this.userAgentIndex];
    this.userAgentIndex = (this.userAgentIndex + 1) % this.config.userAgents.length;
    return userAgent;
  }

  /**
   * Delay function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Intelligent Scraper cleanup completed');
  }
}

// Export singleton instance
export const intelligentScraper = new IntelligentScraper(); 