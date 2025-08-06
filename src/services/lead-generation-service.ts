import { FiftyStateDataIntegration } from './50-state-data-integration';

export interface LeadGenerationFilters {
  state?: string;
  county?: string;
  city?: string;
  zipCode?: string;
  propertyType?: string;
  equityRange?: { min: number; max: number };
  valueRange?: { min: number; max: number };
  status?: string[]; // 'tax-delinquent', 'pre-foreclosure', 'code-violation', etc.
  ownerType?: string;
}

export interface LeadGenerationResult {
  properties: any[];
  totalCount: number;
  coverage: {
    states: number;
    counties: number;
    properties: number;
  };
  lastUpdated: string;
}

class LeadGenerationService {
  private dataIntegration: FiftyStateDataIntegration;
  private isInitialized = false;

  constructor() {
    this.dataIntegration = new FiftyStateDataIntegration();
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.dataIntegration.initialize();
      this.isInitialized = true;
      console.log('Lead Generation Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Lead Generation Service:', error);
      throw error;
    }
  }

  async searchProperties(filters: LeadGenerationFilters): Promise<LeadGenerationResult> {
    await this.initialize();

    // Convert user-friendly filters to data integration filters
    const integrationFilters = this.convertFilters(filters);
    
    // Search for properties using the 50-state integration
    const results = await this.dataIntegration.searchProperties(integrationFilters);
    
    return {
      properties: results.properties,
      totalCount: results.totalCount,
      coverage: {
        states: results.coverage.states,
        counties: results.coverage.counties,
        properties: results.coverage.properties
      },
      lastUpdated: new Date().toISOString()
    };
  }

  async getPropertyDetails(propertyId: string) {
    await this.initialize();
    return await this.dataIntegration.getPropertyDetails(propertyId);
  }

  async getAreaAnalytics(area: { type: 'circle' | 'polygon'; coordinates: any }) {
    await this.initialize();
    return await this.dataIntegration.getAreaAnalytics(area);
  }

  async exportData(filters: LeadGenerationFilters, format: 'csv' | 'json' | 'geojson') {
    await this.initialize();
    return await this.dataIntegration.exportData(filters, format);
  }

  private convertFilters(filters: LeadGenerationFilters) {
    const integrationFilters: any = {};

    if (filters.state) {
      integrationFilters.state = filters.state;
    }

    if (filters.county) {
      integrationFilters.county = filters.county;
    }

    if (filters.city) {
      integrationFilters.city = filters.city;
    }

    if (filters.zipCode) {
      integrationFilters.zipCode = filters.zipCode;
    }

    if (filters.propertyType) {
      integrationFilters.propertyType = filters.propertyType;
    }

    if (filters.equityRange) {
      integrationFilters.equityPercent = {
        min: filters.equityRange.min,
        max: filters.equityRange.max
      };
    }

    if (filters.valueRange) {
      integrationFilters.assessedValue = {
        min: filters.valueRange.min,
        max: filters.valueRange.max
      };
    }

    if (filters.status && filters.status.length > 0) {
      integrationFilters.status = filters.status;
    }

    if (filters.ownerType) {
      integrationFilters.ownerType = filters.ownerType;
    }

    return integrationFilters;
  }

  // Get system status for the dashboard
  async getSystemStatus() {
    await this.initialize();
    return await this.dataIntegration.getStatus();
  }

  // Get data coverage statistics
  async getCoverageStats() {
    await this.initialize();
    return await this.dataIntegration.getCoverageStats();
  }
}

// Export singleton instance
export const leadGenerationService = new LeadGenerationService(); 