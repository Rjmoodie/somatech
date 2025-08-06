// Real Data Integration Service
// This service handles integration with real data sources

import { REAL_DATA_SOURCES, DataSourceConfig, getDataSourceById } from '@/config/data-sources';
import { redisCache, CacheKeys, Cached } from '@/services/redis-cache-service';
import { supabase } from '@/integrations/supabase/client';

export interface RealDataRequest {
  sourceId: string;
  endpoint: string;
  params: Record<string, any>;
  headers?: Record<string, string>;
}

export interface RealDataResponse {
  success: boolean;
  data?: any;
  error?: string;
  sourceId: string;
  timestamp: Date;
  requestTime: number;
}

export interface DataSourceStatus {
  sourceId: string;
  status: 'online' | 'offline' | 'error';
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  successCount: number;
}

export class RealDataIntegrationService {
  private static instance: RealDataIntegrationService;
  private rateLimiters: Map<string, { requests: number; resetTime: number }> = new Map();
  private apiKeys: Map<string, string> = new Map();

  private constructor() {
    this.initializeApiKeys();
  }

  static getInstance(): RealDataIntegrationService {
    if (!RealDataIntegrationService.instance) {
      RealDataIntegrationService.instance = new RealDataIntegrationService();
    }
    return RealDataIntegrationService.instance;
  }

  private initializeApiKeys(): void {
    // Initialize API keys from environment variables
    const apiKeys = {
      attom: import.meta.env.VITE_ATTOM_API_KEY,
      corelogic: import.meta.env.VITE_CORELOGIC_API_KEY,
      rentspree: import.meta.env.VITE_RENTSPREE_API_KEY,
      realtymole: import.meta.env.VITE_REALTYMOLE_API_KEY,
      mlsgrid: import.meta.env.VITE_MLSGRID_API_KEY,
      census: import.meta.env.VITE_CENSUS_API_KEY,
      fema: import.meta.env.VITE_FEMA_API_KEY
    };

    Object.entries(apiKeys).forEach(([sourceId, key]) => {
      if (key) {
        this.apiKeys.set(sourceId, key);
      }
    });
  }

  // Check if API key is available for a data source
  hasApiKey(sourceId: string): boolean {
    const source = getDataSourceById(sourceId);
    if (!source) return false;
    
    if (!source.apiKeyRequired) return true;
    return this.apiKeys.has(sourceId);
  }

  // Get API key for a data source
  getApiKey(sourceId: string): string | null {
    return this.apiKeys.get(sourceId) || null;
  }

  // Check rate limits for a data source
  private checkRateLimit(sourceId: string): boolean {
    const source = getDataSourceById(sourceId);
    if (!source) return false;

    const now = Date.now();
    const limiter = this.rateLimiters.get(sourceId);
    
    if (!limiter || now > limiter.resetTime) {
      // Reset rate limiter
      this.rateLimiters.set(sourceId, {
        requests: 1,
        resetTime: now + 60000 // 1 minute
      });
      return true;
    }

    if (limiter.requests >= source.rateLimit.requestsPerMinute) {
      return false;
    }

    limiter.requests++;
    return true;
  }

  // Make a request to a real data source
  async makeRequest(request: RealDataRequest): Promise<RealDataResponse> {
    const startTime = Date.now();
    const source = getDataSourceById(request.sourceId);

    if (!source) {
      return {
        success: false,
        error: `Data source ${request.sourceId} not found`,
        sourceId: request.sourceId,
        timestamp: new Date(),
        requestTime: Date.now() - startTime
      };
    }

    // Check rate limits
    if (!this.checkRateLimit(request.sourceId)) {
      return {
        success: false,
        error: `Rate limit exceeded for ${request.sourceId}`,
        sourceId: request.sourceId,
        timestamp: new Date(),
        requestTime: Date.now() - startTime
      };
    }

    // Check API key if required
    if (source.apiKeyRequired && !this.hasApiKey(request.sourceId)) {
      return {
        success: false,
        error: `API key required for ${request.sourceId}`,
        sourceId: request.sourceId,
        timestamp: new Date(),
        requestTime: Date.now() - startTime
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'SomaTech-RealData/1.0',
        ...request.headers
      };

      // Add API key if required
      if (source.apiKeyRequired) {
        const apiKey = this.getApiKey(request.sourceId);
        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
      }

      const response = await fetch(request.endpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const requestTime = Date.now() - startTime;

      return {
        success: true,
        data,
        sourceId: request.sourceId,
        timestamp: new Date(),
        requestTime
      };

    } catch (error) {
      const requestTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sourceId: request.sourceId,
        timestamp: new Date(),
        requestTime
      };
    }
  }

  // ATTOM Data API Integration
  @Cached(300000, (params: any) => `attom:${JSON.stringify(params)}`)
  async getATTOMPropertyData(params: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('attom');
    if (!source) {
      return {
        success: false,
        error: 'ATTOM data source not configured',
        sourceId: 'attom',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const queryParams = new URLSearchParams();
    if (params.address) queryParams.append('address', params.address);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.zip) queryParams.append('zip', params.zip);
    if (params.latitude) queryParams.append('latitude', params.latitude.toString());
    if (params.longitude) queryParams.append('longitude', params.longitude.toString());

    const endpoint = `${source.apiEndpoint}/property/detail?${queryParams.toString()}`;

    return this.makeRequest({
      sourceId: 'attom',
      endpoint,
      params
    });
  }

  // CoreLogic Data API Integration
  @Cached(300000, (params: any) => `corelogic:${JSON.stringify(params)}`)
  async getCoreLogicPropertyData(params: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('corelogic');
    if (!source) {
      return {
        success: false,
        error: 'CoreLogic data source not configured',
        sourceId: 'corelogic',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const endpoint = `${source.apiEndpoint}/properties/search`;

    return this.makeRequest({
      sourceId: 'corelogic',
      endpoint,
      params
    });
  }

  // RentSpree API Integration
  @Cached(180000, (params: any) => `rentspree:${JSON.stringify(params)}`)
  async getRentSpreeData(params: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('rentspree');
    if (!source) {
      return {
        success: false,
        error: 'RentSpree data source not configured',
        sourceId: 'rentspree',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const endpoint = `${source.apiEndpoint}/properties`;

    return this.makeRequest({
      sourceId: 'rentspree',
      endpoint,
      params
    });
  }

  // RealtyMole API Integration
  @Cached(300000, (params: any) => `realtymole:${JSON.stringify(params)}`)
  async getRealtyMoleData(params: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('realtymole');
    if (!source) {
      return {
        success: false,
        error: 'RealtyMole data source not configured',
        sourceId: 'realtymole',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const endpoint = `${source.apiEndpoint}/properties`;

    return this.makeRequest({
      sourceId: 'realtymole',
      endpoint,
      params,
      headers: {
        'X-RapidAPI-Key': this.getApiKey('realtymole') || '',
        'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
      }
    });
  }

  // MLS Grid API Integration
  @Cached(180000, (params: any) => `mlsgrid:${JSON.stringify(params)}`)
  async getMLSGridData(params: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('mlsgrid');
    if (!source) {
      return {
        success: false,
        error: 'MLS Grid data source not configured',
        sourceId: 'mlsgrid',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const endpoint = `${source.apiEndpoint}/properties`;

    return this.makeRequest({
      sourceId: 'mlsgrid',
      endpoint,
      params
    });
  }

  // US Census Bureau API Integration
  @Cached(3600000, (params: any) => `census:${JSON.stringify(params)}`) // 1 hour cache
  async getCensusData(params: {
    state?: string;
    county?: string;
    variables?: string[];
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('census');
    if (!source) {
      return {
        success: false,
        error: 'Census data source not configured',
        sourceId: 'census',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('get', params.variables?.join(',') || 'NAME,POPULATION');
    queryParams.append('for', `state:${params.state}`);
    if (params.county) {
      queryParams.append('in', `county:${params.county}`);
    }

    const endpoint = `${source.apiEndpoint}/2020/dec/pl?${queryParams.toString()}`;

    return this.makeRequest({
      sourceId: 'census',
      endpoint,
      params
    });
  }

  // FEMA API Integration
  @Cached(3600000, (params: any) => `fema:${JSON.stringify(params)}`) // 1 hour cache
  async getFEMAData(params: {
    latitude?: number;
    longitude?: number;
  }): Promise<RealDataResponse> {
    const source = getDataSourceById('fema');
    if (!source) {
      return {
        success: false,
        error: 'FEMA data source not configured',
        sourceId: 'fema',
        timestamp: new Date(),
        requestTime: 0
      };
    }

    const endpoint = `${source.apiEndpoint}/NFHL/MapServer/identify?geometry=${params.longitude},${params.latitude}&geometryType=esriGeometryPoint&sr=4326&layers=0&tolerance=0&mapExtent=-180,-90,180,90&imageDisplay=600,550,96&f=json`;

    return this.makeRequest({
      sourceId: 'fema',
      endpoint,
      params
    });
  }

  // Bulk data retrieval from multiple sources
  async getMultiSourceData(address: string, city: string, state: string, zip: string): Promise<{
    [sourceId: string]: RealDataResponse;
  }> {
    const sources = ['attom', 'corelogic', 'rentspree', 'realtymole', 'mlsgrid'];
    const results: { [sourceId: string]: RealDataResponse } = {};

    const promises = sources.map(async (sourceId) => {
      const params = { address, city, state, zip };
      
      switch (sourceId) {
        case 'attom':
          results[sourceId] = await this.getATTOMPropertyData(params);
          break;
        case 'corelogic':
          results[sourceId] = await this.getCoreLogicPropertyData(params);
          break;
        case 'rentspree':
          results[sourceId] = await this.getRentSpreeData(params);
          break;
        case 'realtymole':
          results[sourceId] = await this.getRealtyMoleData(params);
          break;
        case 'mlsgrid':
          results[sourceId] = await this.getMLSGridData(params);
          break;
      }
    });

    await Promise.allSettled(promises);
    return results;
  }

  // Get data source status
  async getDataSourceStatus(): Promise<DataSourceStatus[]> {
    const sources = getActiveDataSources();
    const statuses: DataSourceStatus[] = [];

    for (const source of sources) {
      const startTime = Date.now();
      let status: 'online' | 'offline' | 'error' = 'offline';
      let responseTime = 0;

      try {
        // Simple health check endpoint
        const response = await fetch(`${source.apiEndpoint}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });

        responseTime = Date.now() - startTime;
        status = response.ok ? 'online' : 'error';
      } catch (error) {
        responseTime = Date.now() - startTime;
        status = 'error';
      }

      statuses.push({
        sourceId: source.id,
        status,
        lastCheck: new Date(),
        responseTime,
        errorCount: status === 'error' ? 1 : 0,
        successCount: status === 'online' ? 1 : 0
      });
    }

    return statuses;
  }

  // Get available data sources for a location
  getAvailableSources(state: string): DataSourceConfig[] {
    return REAL_DATA_SOURCES.filter(source => 
      source.status === 'active' && 
      (source.coverage.states.includes('all') || source.coverage.states.includes(state))
    );
  }

  // Get data source costs
  getDataSourceCosts(): { [sourceId: string]: number } {
    const costs: { [sourceId: string]: number } = {};
    
    REAL_DATA_SOURCES.forEach(source => {
      if (source.status === 'active') {
        costs[source.id] = source.cost.monthlyFee + (source.cost.perRequestFee * 1000);
      }
    });

    return costs;
  }
}

export default RealDataIntegrationService; 