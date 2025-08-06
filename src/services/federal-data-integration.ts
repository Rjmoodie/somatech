// Federal Data Integration Service
// Handles all 50 states with comprehensive federal data sources

export interface CensusData {
  name: string;
  state: string;
  countyCode: string;
  population: number;
  households: number;
  housingUnits: number;
}

export interface FloodZoneData {
  floodZone: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  coordinates: { lat: number; lng: number };
  lastUpdated: string;
}

export interface HUDProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  listingPrice: number;
  status: string;
  latitude: number;
  longitude: number;
}

export interface EnvironmentalData {
  propertyId: string;
  address: string;
  environmentalHazards: string[];
  riskScore: number;
  lastAssessment: string;
}

export class FederalDataIntegrator {
  private readonly CENSUS_API_BASE = 'https://api.census.gov/data/2020/dec/pl';
  private readonly FEMA_API_BASE = 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer';
  private readonly HUD_API_BASE = 'https://www.hud.gov/program_offices/housing/sfh/reo/reolist';
  private readonly EPA_API_BASE = 'https://www.epa.gov/enviro';

  /**
   * Get comprehensive census data for all 3,142 counties across 50 states
   */
  async getAllCensusData(): Promise<CensusData[]> {
    try {
      const response = await fetch(
        `${this.CENSUS_API_BASE}?get=NAME,P0010001,P0030001,P0040001&for=county:*&in=state:*`
      );
      
      if (!response.ok) {
        throw new Error(`Census API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Skip header row and process data
      return data.slice(1).map((row: any[]) => ({
        name: row[0],
        state: row[1],
        countyCode: row[2],
        population: parseInt(row[3]) || 0,
        households: parseInt(row[4]) || 0,
        housingUnits: parseInt(row[5]) || 0
      }));
    } catch (error) {
      console.error('Error fetching census data:', error);
      throw new Error(`Failed to fetch census data: ${error.message}`);
    }
  }

  /**
   * Get census data for specific state and county
   */
  async getCensusData(stateCode: string, countyCode: string): Promise<CensusData | null> {
    try {
      const response = await fetch(
        `${this.CENSUS_API_BASE}?get=NAME,P0010001,P0030001,P0040001&for=county:${countyCode}&in=state:${stateCode}`
      );
      
      if (!response.ok) {
        throw new Error(`Census API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length < 2) {
        return null;
      }
      
      const row = data[1];
      return {
        name: row[0],
        state: row[1],
        countyCode: row[2],
        population: parseInt(row[3]) || 0,
        households: parseInt(row[4]) || 0,
        housingUnits: parseInt(row[5]) || 0
      };
    } catch (error) {
      console.error(`Error fetching census data for ${stateCode}-${countyCode}:`, error);
      return null;
    }
  }

  /**
   * Get FEMA flood zone data for specific coordinates
   */
  async getFloodZoneData(lat: number, lng: number): Promise<FloodZoneData | null> {
    try {
      const url = `${this.FEMA_API_BASE}/identify?geometry=${lng},${lat}&geometryType=esriGeometryPoint&layers=0&tolerance=0&mapExtent=-180,-90,180,90&imageDisplay=1024,768,96&f=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`FEMA API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return null;
      }
      
      const floodData = data.results[0];
      
      return {
        floodZone: floodData.attributes?.FLD_ZONE || 'X',
        riskLevel: this.mapFloodZoneToRisk(floodData.attributes?.FLD_ZONE),
        coordinates: { lat, lng },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching flood zone data for ${lat},${lng}:`, error);
      return null;
    }
  }

  /**
   * Get HUD REO properties for specific state
   */
  async getHUDProperties(stateCode: string): Promise<HUDProperty[]> {
    try {
      // Note: HUD doesn't provide a direct API, so we'll scrape their website
      // This is a placeholder for the actual implementation
      const response = await fetch(`${this.HUD_API_BASE}?state=${stateCode}`);
      
      if (!response.ok) {
        throw new Error(`HUD API error: ${response.status}`);
      }
      
      // Parse the HTML response to extract property data
      const html = await response.text();
      return this.parseHUDProperties(html, stateCode);
    } catch (error) {
      console.error(`Error fetching HUD properties for ${stateCode}:`, error);
      return [];
    }
  }

  /**
   * Get EPA environmental data for specific coordinates
   */
  async getEnvironmentalData(lat: number, lng: number): Promise<EnvironmentalData | null> {
    try {
      // EPA provides data through their Envirofacts API
      const response = await fetch(
        `${this.EPA_API_BASE}/ef_metadata.html?output=json&pgeometry=POINT(${lng} ${lat})&pGeometry=POINT(${lng} ${lat})&pGeometry=POINT(${lng} ${lat})`
      );
      
      if (!response.ok) {
        throw new Error(`EPA API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        propertyId: `epa_${lat}_${lng}`,
        address: '', // Will be filled by calling function
        environmentalHazards: this.parseEnvironmentalHazards(data),
        riskScore: this.calculateEnvironmentalRisk(data),
        lastAssessment: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching environmental data for ${lat},${lng}:`, error);
      return null;
    }
  }

  /**
   * Get comprehensive federal data for a specific property
   */
  async getFederalDataForProperty(
    address: string,
    lat: number,
    lng: number
  ): Promise<{
    census: CensusData | null;
    flood: FloodZoneData | null;
    environmental: EnvironmentalData | null;
  }> {
    try {
      // Get state and county from coordinates
      const stateCounty = await this.getStateCountyFromCoordinates(lat, lng);
      
      const [census, flood, environmental] = await Promise.allSettled([
        stateCounty ? this.getCensusData(stateCounty.state, stateCounty.county) : null,
        this.getFloodZoneData(lat, lng),
        this.getEnvironmentalData(lat, lng)
      ]);
      
      return {
        census: census.status === 'fulfilled' ? census.value : null,
        flood: flood.status === 'fulfilled' ? flood.value : null,
        environmental: environmental.status === 'fulfilled' ? environmental.value : null
      };
    } catch (error) {
      console.error('Error fetching federal data for property:', error);
      return {
        census: null,
        flood: null,
        environmental: null
      };
    }
  }

  // Helper methods
  private mapFloodZoneToRisk(zone: string): 'LOW' | 'MODERATE' | 'HIGH' {
    if (!zone) return 'LOW';
    
    const highRiskZones = ['A', 'AE', 'AH', 'AO', 'AR', 'A99'];
    const moderateRiskZones = ['B', 'BE', 'BH', 'BO', 'BS'];
    
    if (highRiskZones.includes(zone)) return 'HIGH';
    if (moderateRiskZones.includes(zone)) return 'MODERATE';
    return 'LOW';
  }

  private parseHUDProperties(html: string, stateCode: string): HUDProperty[] {
    // This would parse the HUD HTML to extract property data
    // Implementation depends on HUD's actual HTML structure
    return [];
  }

  private parseEnvironmentalHazards(data: any): string[] {
    const hazards: string[] = [];
    
    // Parse EPA data for environmental hazards
    if (data.superfund) hazards.push('Superfund Site');
    if (data.brownfields) hazards.push('Brownfield Site');
    if (data.airQuality) hazards.push('Air Quality Issues');
    if (data.waterQuality) hazards.push('Water Quality Issues');
    
    return hazards;
  }

  private calculateEnvironmentalRisk(data: any): number {
    let riskScore = 0;
    
    // Calculate risk based on environmental factors
    if (data.superfund) riskScore += 50;
    if (data.brownfields) riskScore += 30;
    if (data.airQuality) riskScore += 20;
    if (data.waterQuality) riskScore += 20;
    
    return Math.min(riskScore, 100);
  }

  private async getStateCountyFromCoordinates(lat: number, lng: number): Promise<{ state: string; county: string } | null> {
    try {
      // Use reverse geocoding to get state and county
      const response = await fetch(
        `https://api.census.gov/geocoder/geographies/coordinates?x=${lng}&y=${lat}&benchmark=2020&vintage=2020&format=json`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.result && data.result.addressMatches && data.result.addressMatches.length > 0) {
        const match = data.result.addressMatches[0];
        return {
          state: match.geographies['States'][0].STATE,
          county: match.geographies['Counties'][0].COUNTY
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting state/county from coordinates:', error);
      return null;
    }
  }
}

// Export singleton instance
export const federalDataIntegrator = new FederalDataIntegrator(); 