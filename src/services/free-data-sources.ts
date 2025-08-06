// Free Data Sources Service
// Implements Census Bureau and FEMA APIs for live, free data

import { redisCache, CacheKeys, Cached } from '@/services/redis-cache-service';

export interface CensusData {
  state: string;
  county?: string;
  population: number;
  medianIncome: number;
  medianHomeValue: number;
  unemploymentRate: number;
  educationLevel: string;
  housingUnits: number;
  ownerOccupied: number;
  renterOccupied: number;
}

export interface FEMAData {
  latitude: number;
  longitude: number;
  floodZone: string;
  riskLevel: 'low' | 'medium' | 'high';
  floodInsuranceRequired: boolean;
  lastUpdated: Date;
  historicalFloods: number;
}

export interface FreeDataResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: 'census' | 'fema';
  timestamp: Date;
  requestTime: number;
}

export class FreeDataSourcesService {
  private static instance: FreeDataSourcesService;

  private constructor() {}

  static getInstance(): FreeDataSourcesService {
    if (!FreeDataSourcesService.instance) {
      FreeDataSourcesService.instance = new FreeDataSourcesService();
    }
    return FreeDataSourcesService.instance;
  }

  // US Census Bureau API - FREE
  @Cached(3600000, (params: any) => `census:${JSON.stringify(params)}`) // 1 hour cache
  async getCensusData(params: {
    state: string;
    county?: string;
    variables?: string[];
  }): Promise<FreeDataResponse> {
    const startTime = Date.now();
    
    try {
      const variables = params.variables || [
        'NAME',
        'B01003_001E', // Total population
        'B19013_001E', // Median household income
        'B25077_001E', // Median home value
        'B23025_005E', // Unemployment
        'B15003_022E', // Bachelor's degree
        'B25024_001E', // Housing units
        'B25003_002E', // Owner occupied
        'B25003_003E'  // Renter occupied
      ];

      const queryParams = new URLSearchParams();
      queryParams.append('get', variables.join(','));
      queryParams.append('for', `state:${params.state}`);
      if (params.county) {
        queryParams.append('in', `county:${params.county}`);
      }

      const endpoint = `https://api.census.gov/data/2020/acs/acs5?${queryParams.toString()}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'User-Agent': 'SomaTech-Census-API/1.0'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Census API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const requestTime = Date.now() - startTime;

      // Parse Census data
      const parsedData = this.parseCensusData(data, params.state, params.county);

      return {
        success: true,
        data: parsedData,
        source: 'census',
        timestamp: new Date(),
        requestTime
      };

    } catch (error) {
      const requestTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'census',
        timestamp: new Date(),
        requestTime
      };
    }
  }

  private parseCensusData(rawData: any[], state: string, county?: string): CensusData {
    if (!rawData || rawData.length < 2) {
      throw new Error('Invalid Census data format');
    }

    const headers = rawData[0];
    const values = rawData[1];
    
    const data: any = {};
    headers.forEach((header: string, index: number) => {
      data[header] = values[index];
    });

    return {
      state,
      county: county || undefined,
      population: parseInt(data.B01003_001E) || 0,
      medianIncome: parseInt(data.B19013_001E) || 0,
      medianHomeValue: parseInt(data.B25077_001E) || 0,
      unemploymentRate: this.calculateUnemploymentRate(data),
      educationLevel: this.calculateEducationLevel(data),
      housingUnits: parseInt(data.B25024_001E) || 0,
      ownerOccupied: parseInt(data.B25003_002E) || 0,
      renterOccupied: parseInt(data.B25003_003E) || 0
    };
  }

  private calculateUnemploymentRate(data: any): number {
    // Simplified unemployment calculation
    const unemployed = parseInt(data.B23025_005E) || 0;
    const total = parseInt(data.B23025_002E) || 1;
    return (unemployed / total) * 100;
  }

  private calculateEducationLevel(data: any): string {
    const bachelors = parseInt(data.B15003_022E) || 0;
    const total = parseInt(data.B15003_001E) || 1;
    const percentage = (bachelors / total) * 100;
    
    if (percentage >= 30) return 'high';
    if (percentage >= 20) return 'medium';
    return 'low';
  }

  // FEMA National Flood Hazard Layer API - FREE
  @Cached(3600000, (params: any) => `fema:${JSON.stringify(params)}`) // 1 hour cache
  async getFEMAData(params: {
    latitude: number;
    longitude: number;
  }): Promise<FreeDataResponse> {
    const startTime = Date.now();
    
    try {
      const endpoint = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/identify?geometry=${params.longitude},${params.latitude}&geometryType=esriGeometryPoint&sr=4326&layers=0&tolerance=0&mapExtent=-180,-90,180,90&imageDisplay=600,550,96&f=json`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'User-Agent': 'SomaTech-FEMA-API/1.0'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`FEMA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const requestTime = Date.now() - startTime;

      // Parse FEMA data
      const parsedData = this.parseFEMAData(data, params.latitude, params.longitude);

      return {
        success: true,
        data: parsedData,
        source: 'fema',
        timestamp: new Date(),
        requestTime
      };

    } catch (error) {
      const requestTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'fema',
        timestamp: new Date(),
        requestTime
      };
    }
  }

  private parseFEMAData(rawData: any, latitude: number, longitude: number): FEMAData {
    // Default values if no flood data found
    let floodZone = 'X'; // No flood risk
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let floodInsuranceRequired = false;

    if (rawData.results && rawData.results.length > 0) {
      const result = rawData.results[0];
      floodZone = result.attributes?.FLD_ZONE || 'X';
      
      // Determine risk level based on flood zone
      if (['A', 'AE', 'AH', 'AO', 'A1-A30'].includes(floodZone)) {
        riskLevel = 'high';
        floodInsuranceRequired = true;
      } else if (['B', 'BE', 'B1-B30', 'C', 'CE', 'C1-C30'].includes(floodZone)) {
        riskLevel = 'medium';
        floodInsuranceRequired = false;
      } else {
        riskLevel = 'low';
        floodInsuranceRequired = false;
      }
    }

    return {
      latitude,
      longitude,
      floodZone,
      riskLevel,
      floodInsuranceRequired,
      lastUpdated: new Date(),
      historicalFloods: 0 // Would need additional API calls for historical data
    };
  }

  // Get comprehensive free data for a location
  async getLocationFreeData(params: {
    latitude: number;
    longitude: number;
    state: string;
    county?: string;
  }): Promise<{
    census: FreeDataResponse;
    fema: FreeDataResponse;
  }> {
    const [census, fema] = await Promise.allSettled([
      this.getCensusData({ state: params.state, county: params.county }),
      this.getFEMAData({ latitude: params.latitude, longitude: params.longitude })
    ]);

    return {
      census: census.status === 'fulfilled' ? census.value : {
        success: false,
        error: 'Census data request failed',
        source: 'census',
        timestamp: new Date(),
        requestTime: 0
      },
      fema: fema.status === 'fulfilled' ? fema.value : {
        success: false,
        error: 'FEMA data request failed',
        source: 'fema',
        timestamp: new Date(),
        requestTime: 0
      }
    };
  }

  // Get state-level demographic summary
  async getStateDemographics(state: string): Promise<CensusData | null> {
    try {
      const response = await this.getCensusData({ state });
      if (response.success && response.data) {
        return response.data as CensusData;
      }
      return null;
    } catch (error) {
      console.error('Error getting state demographics:', error);
      return null;
    }
  }

  // Get flood risk for multiple properties
  async getBatchFloodData(coordinates: Array<{ latitude: number; longitude: number }>): Promise<FEMAData[]> {
    const results: FEMAData[] = [];
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < coordinates.length; i += batchSize) {
      const batch = coordinates.slice(i, i + batchSize);
      const batchPromises = batch.map(coord => this.getFEMAData(coord));
      
      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success && result.value.data) {
          results.push(result.value.data as FEMAData);
        }
      });

      // Add delay between batches to be respectful to the API
      if (i + batchSize < coordinates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Get market insights from free data
  async getMarketInsights(params: {
    state: string;
    county?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<{
    demographics: CensusData | null;
    floodRisk: FEMAData | null;
    marketHealth: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
  }> {
    const [demographics, floodRisk] = await Promise.allSettled([
      this.getStateDemographics(params.state),
      params.latitude && params.longitude ? 
        this.getFEMAData({ latitude: params.latitude, longitude: params.longitude }) : 
        Promise.resolve(null)
    ]);

    const demographicsData = demographics.status === 'fulfilled' ? demographics.value : null;
    const floodRiskData = floodRisk.status === 'fulfilled' && floodRisk.value?.success ? 
      floodRisk.value.data as FEMAData : null;

    // Calculate market health score
    const marketHealth = this.calculateMarketHealth(demographicsData, floodRiskData);

    return {
      demographics: demographicsData,
      floodRisk: floodRiskData,
      marketHealth
    };
  }

  private calculateMarketHealth(demographics: CensusData | null, floodRisk: FEMAData | null): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 50; // Base score
    const factors: string[] = [];
    const recommendations: string[] = [];

    if (demographics) {
      // Income factor
      if (demographics.medianIncome > 75000) {
        score += 15;
        factors.push('High median income');
      } else if (demographics.medianIncome < 50000) {
        score -= 10;
        factors.push('Low median income');
        recommendations.push('Consider lower-priced properties');
      }

      // Population growth factor
      if (demographics.population > 1000000) {
        score += 10;
        factors.push('Large population base');
      }

      // Education factor
      if (demographics.educationLevel === 'high') {
        score += 10;
        factors.push('High education level');
      }

      // Housing market factor
      const homeValueToIncomeRatio = demographics.medianHomeValue / demographics.medianIncome;
      if (homeValueToIncomeRatio < 3) {
        score += 15;
        factors.push('Affordable housing market');
      } else if (homeValueToIncomeRatio > 5) {
        score -= 10;
        factors.push('Expensive housing market');
        recommendations.push('Consider rental properties');
      }
    }

    if (floodRisk) {
      if (floodRisk.riskLevel === 'high') {
        score -= 20;
        factors.push('High flood risk');
        recommendations.push('Consider flood insurance costs');
      } else if (floodRisk.riskLevel === 'low') {
        score += 5;
        factors.push('Low flood risk');
      }
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      factors,
      recommendations
    };
  }
}

export default FreeDataSourcesService; 