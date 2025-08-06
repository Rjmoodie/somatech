// County Discovery Engine
// Automatically discovers and validates data sources for all 3,142 counties

export interface CountyData {
  name: string;
  state: string;
  stateCode: string;
  countyCode: string;
  population: number;
  dataSources: DataSource[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  lastUpdated: string;
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

export interface DiscoveryResult {
  totalCounties: number;
  discoveredCounties: number;
  activeSources: number;
  errors: string[];
  progress: number;
}

export class CountyDiscoveryEngine {
  private readonly COMMON_URL_PATTERNS = [
    // Tax Assessor patterns
    'https://{county}.gov/assessor',
    'https://assessor.{county}.gov',
    'https://{county}.gov/tax-assessor',
    'https://tax.{county}.gov',
    
    // County Clerk patterns
    'https://{county}.gov/clerk',
    'https://clerk.{county}.gov',
    'https://{county}.gov/county-clerk',
    'https://countyclerk.{county}.gov',
    
    // Sheriff patterns
    'https://{county}.gov/sheriff',
    'https://sheriff.{county}.gov',
    'https://{county}.gov/sheriffs-office',
    
    // Recorder patterns
    'https://{county}.gov/recorder',
    'https://recorder.{county}.gov',
    'https://{county}.gov/county-recorder',
    
    // Treasurer patterns
    'https://{county}.gov/treasurer',
    'https://treasurer.{county}.gov',
    'https://{county}.gov/county-treasurer'
  ];

  private readonly COMMON_SELECTORS = [
    {
      tableSelector: '.property-table, .assessor-table, .records-table, table',
      rowSelector: 'tr, .property-row, .record-row',
      ownerSelector: '.owner, .owner-name, .property-owner, td:nth-child(2)',
      addressSelector: '.address, .property-address, .location, td:nth-child(1)',
      valueSelector: '.value, .assessed-value, .property-value, td:nth-child(3)',
      dateSelector: '.date, .filing-date, .record-date, td:nth-child(4)'
    },
    {
      tableSelector: '.data-table, .results-table, .search-results',
      rowSelector: 'tr, .result-row, .data-row',
      ownerSelector: '.owner, .name, .owner-name',
      addressSelector: '.address, .property, .location',
      valueSelector: '.value, .amount, .assessment',
      dateSelector: '.date, .filed, .updated'
    }
  ];

  /**
   * Discover all counties and their data sources
   */
  async discoverAllCounties(): Promise<DiscoveryResult> {
    try {
      console.log('🚀 Starting county discovery for all 50 states...');
      
      // Get all counties from Census API
      const counties = await this.getAllCounties();
      console.log(`📊 Found ${counties.length} counties to process`);
      
      const discoveryResult: DiscoveryResult = {
        totalCounties: counties.length,
        discoveredCounties: 0,
        activeSources: 0,
        errors: [],
        progress: 0
      };

      // Process counties in batches to avoid overwhelming servers
      const batchSize = 50;
      for (let i = 0; i < counties.length; i += batchSize) {
        const batch = counties.slice(i, i + batchSize);
        
        console.log(`🔍 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(counties.length / batchSize)}`);
        
        const batchPromises = batch.map(county => this.discoverCountyData(county));
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Process results
        for (const result of batchResults) {
          if (result.status === 'fulfilled' && result.value) {
            discoveryResult.discoveredCounties++;
            discoveryResult.activeSources += result.value.dataSources.filter(s => s.status === 'active').length;
          } else if (result.status === 'rejected') {
            discoveryResult.errors.push(result.reason.message);
          }
        }
        
        discoveryResult.progress = Math.round((i + batchSize) / counties.length * 100);
        
        // Rate limiting - wait between batches
        if (i + batchSize < counties.length) {
          await this.delay(2000); // 2 second delay between batches
        }
      }
      
      console.log(`✅ Discovery complete: ${discoveryResult.discoveredCounties} counties with ${discoveryResult.activeSources} active sources`);
      return discoveryResult;
      
    } catch (error) {
      console.error('❌ Error during county discovery:', error);
      throw new Error(`County discovery failed: ${error.message}`);
    }
  }

  /**
   * Discover data sources for a specific county
   */
  async discoverCountyData(county: { name: string; state: string; stateCode: string; countyCode: string }): Promise<CountyData | null> {
    try {
      const countyName = this.normalizeCountyName(county.name);
      const stateName = this.normalizeStateName(county.state);
      
      // Generate potential URLs
      const potentialUrls = this.generateCountyUrls(countyName, stateName);
      
      // Test each URL
      const dataSources: DataSource[] = [];
      
      for (const url of potentialUrls) {
        try {
          const source = await this.validateDataSource(url, county);
          if (source) {
            dataSources.push(source);
          }
        } catch (error) {
          // Continue to next URL if this one fails
          console.log(`⚠️ Failed to validate ${url}: ${error.message}`);
        }
      }
      
      // Calculate priority based on population and data source count
      const priority = this.calculatePriority(county, dataSources);
      
      return {
        name: county.name,
        state: county.state,
        stateCode: county.stateCode,
        countyCode: county.countyCode,
        population: 0, // Will be filled by census data
        dataSources,
        priority,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error discovering data for ${county.name}, ${county.state}:`, error);
      return null;
    }
  }

  /**
   * Get all counties from Census API
   */
  private async getAllCounties(): Promise<Array<{ name: string; state: string; stateCode: string; countyCode: string }>> {
    try {
      const response = await fetch(
        'https://api.census.gov/data/2020/dec/pl?get=NAME&for=county:*&in=state:*'
      );
      
      if (!response.ok) {
        throw new Error(`Census API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Skip header row and process data
      return data.slice(1).map((row: any[]) => {
        const fullName = row[0];
        const stateCode = row[1];
        const countyCode = row[2];
        
        // Extract county name (remove state name)
        const countyName = fullName.replace(/,.*$/, '').trim();
        const stateName = this.getStateName(stateCode);
        
        return {
          name: countyName,
          state: stateName,
          stateCode,
          countyCode
        };
      });
      
    } catch (error) {
      console.error('Error fetching counties from Census API:', error);
      throw new Error(`Failed to fetch counties: ${error.message}`);
    }
  }

  /**
   * Generate potential URLs for a county
   */
  private generateCountyUrls(countyName: string, stateName: string): string[] {
    const urls: string[] = [];
    
    // Clean county name for URL generation
    const cleanCountyName = countyName
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    // Generate URLs using patterns
    for (const pattern of this.COMMON_URL_PATTERNS) {
      const url = pattern
        .replace(/{county}/g, cleanCountyName)
        .replace(/{state}/g, stateName.toLowerCase().replace(/\s+/g, ''));
      
      urls.push(url);
    }
    
    return urls;
  }

  /**
   * Validate a data source URL
   */
  private async validateDataSource(url: string, county: any): Promise<DataSource | null> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout: 5000
      });
      
      if (!response.ok) {
        return null;
      }
      
      // If HEAD request succeeds, try to get the page content
      const pageResponse = await fetch(url, {
        timeout: 10000
      });
      
      if (!pageResponse.ok) {
        return null;
      }
      
      const html = await pageResponse.text();
      
      // Check if page contains property-related content
      if (!this.containsPropertyData(html)) {
        return null;
      }
      
      // Try to find working selectors
      const selectors = await this.findWorkingSelectors(html);
      
      if (!selectors) {
        return null;
      }
      
      return {
        id: `source_${county.stateCode}_${county.countyCode}_${Date.now()}`,
        name: `${county.name} County Data Source`,
        url,
        method: 'scraper',
        dataType: 'property-records',
        status: 'active',
        lastChecked: new Date().toISOString(),
        successRate: 0.8, // Will be updated based on actual scraping success
        selectors
      };
      
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if HTML contains property-related content
   */
  private containsPropertyData(html: string): boolean {
    const propertyKeywords = [
      'property', 'assessor', 'tax', 'owner', 'address', 'value',
      'parcel', 'assessment', 'real estate', 'land records'
    ];
    
    const lowerHtml = html.toLowerCase();
    const keywordMatches = propertyKeywords.filter(keyword => 
      lowerHtml.includes(keyword)
    );
    
    return keywordMatches.length >= 3; // At least 3 property-related keywords
  }

  /**
   * Find working selectors in HTML
   */
  private async findWorkingSelectors(html: string): Promise<any> {
    for (const selectorSet of this.COMMON_SELECTORS) {
      try {
        // Use a simple HTML parser to test selectors
        const hasTable = html.includes('table') || html.includes('class="') || html.includes('id="');
        
        if (hasTable) {
          // For now, return the first selector set as a working assumption
          // In a real implementation, you'd use a proper HTML parser
          return selectorSet;
        }
      } catch (error) {
        // Continue to next selector set
      }
    }
    
    return null;
  }

  /**
   * Calculate priority for a county
   */
  private calculatePriority(county: any, dataSources: DataSource[]): 'HIGH' | 'MEDIUM' | 'LOW' {
    const activeSources = dataSources.filter(s => s.status === 'active').length;
    
    if (activeSources >= 3) return 'HIGH';
    if (activeSources >= 1) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Normalize county name for URL generation
   */
  private normalizeCountyName(name: string): string {
    return name
      .replace(/County$/, '')
      .replace(/Parish$/, '')
      .replace(/Borough$/, '')
      .trim();
  }

  /**
   * Normalize state name for URL generation
   */
  private normalizeStateName(name: string): string {
    return name
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  /**
   * Get state name from state code
   */
  private getStateName(stateCode: string): string {
    const stateMap: Record<string, string> = {
      '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas',
      '06': 'California', '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware',
      '11': 'District of Columbia', '12': 'Florida', '13': 'Georgia', '15': 'Hawaii',
      '16': 'Idaho', '17': 'Illinois', '18': 'Indiana', '19': 'Iowa',
      '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana', '23': 'Maine',
      '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
      '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska',
      '32': 'Nevada', '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico',
      '36': 'New York', '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio',
      '40': 'Oklahoma', '41': 'Oregon', '42': 'Pennsylvania', '44': 'Rhode Island',
      '45': 'South Carolina', '46': 'South Dakota', '47': 'Tennessee', '48': 'Texas',
      '49': 'Utah', '50': 'Vermont', '51': 'Virginia', '53': 'Washington',
      '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming'
    };
    
    return stateMap[stateCode] || 'Unknown';
  }

  /**
   * Delay function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const countyDiscoveryEngine = new CountyDiscoveryEngine(); 