import { supabase } from '@/integrations/supabase/client';

// Core ETL Pipeline Infrastructure
// This replaces mock data with real property data from multiple sources

export interface PropertyDataSource {
  name: 'attom' | 'corelogic' | 'county_assessor' | 'mls' | 'retsly' | 'realtymole' | 'rentspree' | 'rentdata' | 'mlsgrid' | 'mock';
  priority: number;
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  coverage: string[]; // states/counties covered
  apiKey?: string;
  baseUrl?: string;
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface RawPropertyData {
  id?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  owner_name?: string;
  owner_type?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  assessed_value?: number;
  estimated_value?: number;
  equity_percent?: number;
  mortgage_status?: string;
  lien_status?: string;
  tags?: string[];
  status?: string;
  source: string;
  raw_data: any; // Original data from source
}

export interface NormalizedProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  owner_name: string;
  owner_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
  assessed_value: number;
  estimated_value: number;
  equity_percent: number;
  mortgage_status: string;
  lien_status: string;
  tags: string[];
  status: string;
  data_source: string;
  data_confidence: number;
  last_data_update: Date;
  // Enhanced fields
  market_value?: number;
  property_condition?: string;
  investment_score?: number;
  arv_estimate?: number;
  rehab_cost_estimate?: number;
  cash_on_cash_return?: number;
  cap_rate?: number;
  rental_estimate?: number;
  price_per_sqft?: number;
  days_on_market?: number;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  errors: string[];
  warnings: string[];
  source: string;
}

export interface ETLResult {
  success: boolean;
  propertiesProcessed: number;
  propertiesAdded: number;
  propertiesUpdated: number;
  propertiesSkipped: number;
  errors: string[];
  processingTime: number;
  source: string;
}

// Abstract base classes for ETL components
abstract class DataExtractor {
  abstract extract(source: PropertyDataSource): Promise<RawPropertyData[]>;
  abstract getSourceName(): string;
}

abstract class DataTransformer {
  abstract transform(rawData: RawPropertyData[]): Promise<NormalizedProperty[]>;
  abstract getSourceName(): string;
}

abstract class DataLoader {
  abstract load(properties: NormalizedProperty[]): Promise<{ added: number; updated: number; skipped: number }>;
  abstract getSourceName(): string;
}

abstract class DataValidator {
  abstract validate(property: NormalizedProperty): Promise<ValidationResult>;
  abstract getSourceName(): string;
}

// Main ETL Pipeline Class
export class ETLPipeline {
  private extractor: DataExtractor;
  private transformer: DataTransformer;
  private loader: DataLoader;
  private validator: DataValidator;
  private source: PropertyDataSource;
  private cache = new Map<string, any>();

  constructor(
    source: PropertyDataSource,
    extractor: DataExtractor,
    transformer: DataTransformer,
    loader: DataLoader,
    validator: DataValidator
  ) {
    this.source = source;
    this.extractor = extractor;
    this.transformer = transformer;
    this.loader = loader;
    this.validator = validator;
  }

  async run(): Promise<ETLResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      console.log(`🚀 Starting ETL pipeline for ${this.source.name}`);

      // Step 1: Extract
      console.log(`📥 Extracting data from ${this.source.name}...`);
      const rawData = await this.extractor.extract(this.source);
      console.log(`✅ Extracted ${rawData.length} raw records from ${this.source.name}`);

      if (rawData.length === 0) {
        return {
          success: true,
          propertiesProcessed: 0,
          propertiesAdded: 0,
          propertiesUpdated: 0,
          propertiesSkipped: 0,
          errors: ['No data extracted from source'],
          processingTime: Date.now() - startTime,
          source: this.source.name
        };
      }

      // Step 2: Transform
      console.log(`🔄 Transforming data...`);
      const normalizedData = await this.transformer.transform(rawData);
      console.log(`✅ Transformed ${normalizedData.length} properties`);

      // Step 3: Validate
      console.log(`🔍 Validating data...`);
      const validationResults = await Promise.all(
        normalizedData.map(property => this.validator.validate(property))
      );

      // Filter out invalid properties
      const validProperties = normalizedData.filter((property, index) => {
        const validation = validationResults[index];
        if (!validation.isValid) {
          errors.push(`Property ${property.address}: ${validation.errors.join(', ')}`);
        }
        return validation.isValid;
      });

      console.log(`✅ Validated ${validProperties.length} properties (${normalizedData.length - validProperties.length} invalid)`);

      // Step 4: Load
      console.log(`💾 Loading data to database...`);
      const loadResult = await this.loader.load(validProperties);
      console.log(`✅ Loaded ${loadResult.added} new, ${loadResult.updated} updated properties`);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        propertiesProcessed: rawData.length,
        propertiesAdded: loadResult.added,
        propertiesUpdated: loadResult.updated,
        propertiesSkipped: loadResult.skipped,
        errors,
        processingTime,
        source: this.source.name
      };

    } catch (error) {
      console.error(`❌ ETL pipeline failed for ${this.source.name}:`, error);
      return {
        success: false,
        propertiesProcessed: 0,
        propertiesAdded: 0,
        propertiesUpdated: 0,
        propertiesSkipped: 0,
        errors: [error.message],
        processingTime: Date.now() - startTime,
        source: this.source.name
      };
    }
  }

  // Utility method for caching
  protected async getCachedData(key: string, ttl: number = 300000): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }

  protected setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

// Concrete implementations

// Mock Data Extractor (for testing)
export class MockDataExtractor extends DataExtractor {
  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    // Generate realistic mock data for testing
    const mockProperties: RawPropertyData[] = [
      {
        address: '1234 Main Street',
        city: 'Philadelphia',
        state: 'PA',
        zip: '19102',
        latitude: 39.9526,
        longitude: -75.1652,
        owner_name: 'John Smith',
        owner_type: 'Individual',
        property_type: 'Single Family',
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 1800,
        lot_size: 5000,
        year_built: 1985,
        assessed_value: 250000,
        estimated_value: 275000,
        equity_percent: 65,
        mortgage_status: 'Active',
        lien_status: 'Clear',
        tags: ['pre-foreclosure', 'tax-delinquent'],
        status: 'active',
        source: 'mock',
        raw_data: {}
      },
      {
        address: '5678 Oak Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        owner_name: 'Sarah Johnson',
        owner_type: 'Individual',
        property_type: 'Condo',
        bedrooms: 2,
        bathrooms: 1,
        square_feet: 1200,
        lot_size: 0,
        year_built: 1995,
        assessed_value: 450000,
        estimated_value: 485000,
        equity_percent: 45,
        mortgage_status: 'Active',
        lien_status: 'Clear',
        tags: ['investment', 'cash-flow-positive'],
        status: 'active',
        source: 'mock',
        raw_data: {}
      },
      {
        address: '9012 Pine Street',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        owner_name: 'Michael Davis',
        owner_type: 'LLC',
        property_type: 'Multi-Family',
        bedrooms: 8,
        bathrooms: 4,
        square_feet: 3200,
        lot_size: 8000,
        year_built: 1975,
        assessed_value: 850000,
        estimated_value: 920000,
        equity_percent: 30,
        mortgage_status: 'Active',
        lien_status: 'Clear',
        tags: ['multi-unit', 'cash-flow-positive'],
        status: 'active',
        source: 'mock',
        raw_data: {}
      }
    ];

    return mockProperties;
  }

  getSourceName(): string {
    return 'mock';
  }
}

// ATTOM Data API Extractor
export class ATTOMDataExtractor extends DataExtractor {
  private apiKey: string;
  private baseUrl = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0';

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_ATTOM_API_KEY || '';
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('ATTOM API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    try {
      console.log('Extracting data from ATTOM Data API...');
      
      // For now, we'll extract data for a sample area (can be expanded)
      const properties: RawPropertyData[] = [];
      
      // Sample search areas (major cities)
      const searchAreas = [
        { city: 'Phoenix', state: 'AZ', zip: '85001' },
        { city: 'Dallas', state: 'TX', zip: '75201' },
        { city: 'Miami', state: 'FL', zip: '33101' },
        { city: 'Atlanta', state: 'GA', zip: '30301' },
        { city: 'Las Vegas', state: 'NV', zip: '89101' }
      ];

      for (const area of searchAreas) {
        try {
          const areaProperties = await this.searchPropertiesByArea(area);
          properties.push(...areaProperties);
          
          // Rate limiting - ATTOM allows 1000 requests per hour
          await this.delay(1000); // 1 second delay between requests
        } catch (error) {
          console.error(`Error extracting data for ${area.city}, ${area.state}:`, error);
        }
      }

      console.log(`Extracted ${properties.length} properties from ATTOM Data API`);
      return properties;
    } catch (error) {
      console.error('Error extracting data from ATTOM Data API:', error);
      throw error;
    }
  }

  private async searchPropertiesByArea(area: { city: string; state: string; zip: string }): Promise<RawPropertyData[]> {
    const endpoint = `${this.baseUrl}/property/search`;
    const params = new URLSearchParams({
      apikey: this.apiKey,
      postalcode: area.zip,
      propertytype: 'SFR', // Single Family Residential
      orderby: 'assessedvalue',
      maxrecords: '50' // Limit for demo
    });

    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SomaTech-ETL/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`ATTOM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.property || !Array.isArray(data.property)) {
        console.warn(`No properties found for ${area.city}, ${area.state}`);
        return [];
      }

      return data.property.map((prop: any) => this.transformATTOMProperty(prop, area));
    } catch (error) {
      console.error(`Error searching properties in ${area.city}, ${area.state}:`, error);
      return [];
    }
  }

  private transformATTOMProperty(attomProp: any, area: { city: string; state: string; zip: string }): RawPropertyData {
    const address = attomProp.address?.oneLine || '';
    const [street, city, stateZip] = address.split(',').map(s => s.trim());
    const [state, zip] = (stateZip || '').split(' ');

    return {
      address: street || address,
      city: city || area.city,
      state: state || area.state,
      zip: zip || area.zip,
      latitude: attomProp.latitude ? parseFloat(attomProp.latitude) : undefined,
      longitude: attomProp.longitude ? parseFloat(attomProp.longitude) : undefined,
      owner_name: attomProp.owner?.name || '',
      owner_type: this.mapOwnerType(attomProp.owner?.type),
      property_type: 'residential',
      bedrooms: attomProp.building?.rooms?.beds || 0,
      bathrooms: attomProp.building?.rooms?.baths || 0,
      square_feet: attomProp.building?.size?.livingsize || 0,
      lot_size: attomProp.lot?.lotsize || 0,
      year_built: attomProp.building?.construction?.yearbuilt || 0,
      assessed_value: attomProp.assessment?.assessed?.assdttlvalue || 0,
      estimated_value: attomProp.assessment?.market?.tav || 0,
      equity_percent: 0, // ATTOM doesn't provide this directly
      mortgage_status: attomProp.financial?.loan?.type || 'unknown',
      lien_status: attomProp.financial?.lien?.type || 'none',
      tags: [],
      status: 'active',
      source: 'attom',
      raw_data: attomProp
    };
  }

  private mapOwnerType(attomOwnerType: string): string {
    const typeMap: { [key: string]: string } = {
      'Individual': 'individual',
      'LLC': 'llc',
      'Corporation': 'corporation',
      'Trust': 'trust',
      'Partnership': 'corporation'
    };
    return typeMap[attomOwnerType] || 'individual';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'attom_extractor';
  }
}

// CoreLogic Data API Extractor
export class CoreLogicDataExtractor extends DataExtractor {
  private apiKey: string;
  private baseUrl = 'https://api.corelogic.com/v1';

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_CORELOGIC_API_KEY || '';
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('CoreLogic API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    try {
      console.log('Extracting data from CoreLogic Data API...');
      
      const properties: RawPropertyData[] = [];
      
      // Sample search areas for CoreLogic
      const searchAreas = [
        { city: 'Phoenix', state: 'AZ', zip: '85001' },
        { city: 'Dallas', state: 'TX', zip: '75201' },
        { city: 'Miami', state: 'FL', zip: '33101' }
      ];

      for (const area of searchAreas) {
        try {
          const areaProperties = await this.searchPropertiesByArea(area);
          properties.push(...areaProperties);
          
          // Rate limiting
          await this.delay(1500); // 1.5 second delay between requests
        } catch (error) {
          console.error(`Error extracting data for ${area.city}, ${area.state}:`, error);
        }
      }

      console.log(`Extracted ${properties.length} properties from CoreLogic Data API`);
      return properties;
    } catch (error) {
      console.error('Error extracting data from CoreLogic Data API:', error);
      throw error;
    }
  }

  private async searchPropertiesByArea(area: { city: string; state: string; zip: string }): Promise<RawPropertyData[]> {
    const endpoint = `${this.baseUrl}/properties/search`;
    const params = new URLSearchParams({
      zipCode: area.zip,
      propertyType: 'SFR',
      limit: '50'
    });

    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'SomaTech-ETL/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`CoreLogic API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.properties || !Array.isArray(data.properties)) {
        console.warn(`No properties found for ${area.city}, ${area.state}`);
        return [];
      }

      return data.properties.map((prop: any) => this.transformCoreLogicProperty(prop, area));
    } catch (error) {
      console.error(`Error searching properties in ${area.city}, ${area.state}:`, error);
      return [];
    }
  }

  private transformCoreLogicProperty(coreLogicProp: any, area: { city: string; state: string; zip: string }): RawPropertyData {
    return {
      address: coreLogicProp.address?.streetAddress || '',
      city: coreLogicProp.address?.city || area.city,
      state: coreLogicProp.address?.state || area.state,
      zip: coreLogicProp.address?.zipCode || area.zip,
      latitude: coreLogicProp.location?.latitude ? parseFloat(coreLogicProp.location.latitude) : undefined,
      longitude: coreLogicProp.location?.longitude ? parseFloat(coreLogicProp.location.longitude) : undefined,
      owner_name: coreLogicProp.owner?.name || '',
      owner_type: this.mapOwnerType(coreLogicProp.owner?.type),
      property_type: 'residential',
      bedrooms: coreLogicProp.propertyDetails?.bedrooms || 0,
      bathrooms: coreLogicProp.propertyDetails?.bathrooms || 0,
      square_feet: coreLogicProp.propertyDetails?.squareFootage || 0,
      lot_size: coreLogicProp.propertyDetails?.lotSize || 0,
      year_built: coreLogicProp.propertyDetails?.yearBuilt || 0,
      assessed_value: coreLogicProp.valuation?.assessedValue || 0,
      estimated_value: coreLogicProp.valuation?.estimatedValue || 0,
      equity_percent: coreLogicProp.financial?.equityPercentage || 0,
      mortgage_status: coreLogicProp.financial?.mortgageStatus || 'unknown',
      lien_status: coreLogicProp.financial?.lienStatus || 'none',
      tags: [],
      status: 'active',
      source: 'corelogic',
      raw_data: coreLogicProp
    };
  }

  private mapOwnerType(coreLogicOwnerType: string): string {
    const typeMap: { [key: string]: string } = {
      'Individual': 'individual',
      'LLC': 'llc',
      'Corporation': 'corporation',
      'Trust': 'trust',
      'Partnership': 'corporation'
    };
    return typeMap[coreLogicOwnerType] || 'individual';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'corelogic_extractor';
  }
}

// RentSpree MLS Data Extractor
export class RentSpreeDataExtractor extends DataExtractor {
  private apiKey: string;
  private baseUrl = 'https://api.rentspree.com/v1';

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_RENTSPREE_API_KEY || '';
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('RentSpree API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    const properties: RawPropertyData[] = [];
    
    try {
      // Search for properties in the specified area
      const areas = ['Phoenix, AZ', 'Dallas, TX', 'Miami, FL'];
      
      for (const area of areas) {
        const areaProperties = await this.searchPropertiesByArea(area);
        properties.push(...areaProperties);
        
        // Rate limiting
        await this.delay(1000);
      }
    } catch (error) {
      console.error('Error extracting data from RentSpree:', error);
      return new MockDataExtractor().extract(source);
    }

    return properties;
  }

  private async searchPropertiesByArea(area: string): Promise<RawPropertyData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: area,
          property_type: 'single_family',
          limit: 50
        })
      });

      if (!response.ok) {
        throw new Error(`RentSpree API error: ${response.status}`);
      }

      const data = await response.json();
      return data.properties?.map((prop: any) => this.transformRentSpreeProperty(prop, area)) || [];
    } catch (error) {
      console.error(`Error searching RentSpree properties in ${area}:`, error);
      return [];
    }
  }

  private transformRentSpreeProperty(rentSpreeProp: any, area: string): RawPropertyData {
    const [city, state] = area.split(', ');
    
    return {
      address: rentSpreeProp.address || 'Unknown Address',
      city: rentSpreeProp.city || city,
      state: rentSpreeProp.state || state,
      zip: rentSpreeProp.zip_code,
      latitude: rentSpreeProp.latitude,
      longitude: rentSpreeProp.longitude,
      owner_name: rentSpreeProp.owner_name,
      owner_type: this.mapOwnerType(rentSpreeProp.owner_type),
      property_type: rentSpreeProp.property_type || 'residential',
      bedrooms: rentSpreeProp.bedrooms,
      bathrooms: rentSpreeProp.bathrooms,
      square_feet: rentSpreeProp.square_feet,
      lot_size: rentSpreeProp.lot_size,
      year_built: rentSpreeProp.year_built,
      assessed_value: rentSpreeProp.assessed_value,
      estimated_value: rentSpreeProp.estimated_value,
      equity_percent: rentSpreeProp.equity_percent,
      mortgage_status: rentSpreeProp.mortgage_status || 'unknown',
      lien_status: rentSpreeProp.lien_status || 'none',
      tags: rentSpreeProp.tags || [],
      status: rentSpreeProp.status || 'active',
      source: 'rentspree',
      raw_data: rentSpreeProp
    };
  }

  private mapOwnerType(rentSpreeOwnerType: string): string {
    const mapping: { [key: string]: string } = {
      'individual': 'individual',
      'llc': 'llc',
      'corporation': 'corporation',
      'trust': 'trust',
      'partnership': 'corporation'
    };
    return mapping[rentSpreeOwnerType?.toLowerCase()] || 'unknown';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'rentspree_extractor';
  }
}

// RealtyMole MLS Data Extractor
export class RealtyMoleDataExtractor extends DataExtractor {
  private apiKey: string;
  private baseUrl = 'https://realty-mole-property-api.p.rapidapi.com';

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_REALTYMOLE_API_KEY || '';
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('RealtyMole API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    const properties: RawPropertyData[] = [];
    
    try {
      // Search for properties in the specified area
      const areas = ['Phoenix, AZ', 'Dallas, TX', 'Miami, FL', 'Atlanta, GA', 'Las Vegas, NV'];
      
      for (const area of areas) {
        const areaProperties = await this.searchPropertiesByArea(area);
        properties.push(...areaProperties);
        
        // Rate limiting
        await this.delay(1200);
      }
    } catch (error) {
      console.error('Error extracting data from RealtyMole:', error);
      return new MockDataExtractor().extract(source);
    }

    return properties;
  }

  private async searchPropertiesByArea(area: string): Promise<RawPropertyData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`RealtyMole API error: ${response.status}`);
      }

      const data = await response.json();
      return data.map((prop: any) => this.transformRealtyMoleProperty(prop, area)) || [];
    } catch (error) {
      console.error(`Error searching RealtyMole properties in ${area}:`, error);
      return [];
    }
  }

  private transformRealtyMoleProperty(realtyMoleProp: any, area: string): RawPropertyData {
    const [city, state] = area.split(', ');
    
    return {
      address: realtyMoleProp.formattedAddress || 'Unknown Address',
      city: realtyMoleProp.city || city,
      state: realtyMoleProp.state || state,
      zip: realtyMoleProp.zipCode,
      latitude: realtyMoleProp.latitude,
      longitude: realtyMoleProp.longitude,
      owner_name: realtyMoleProp.ownerName,
      owner_type: this.mapOwnerType(realtyMoleProp.ownerType),
      property_type: realtyMoleProp.propertyType || 'residential',
      bedrooms: realtyMoleProp.bedrooms,
      bathrooms: realtyMoleProp.bathrooms,
      square_feet: realtyMoleProp.squareFootage,
      lot_size: realtyMoleProp.lotSize,
      year_built: realtyMoleProp.yearBuilt,
      assessed_value: realtyMoleProp.assessedValue,
      estimated_value: realtyMoleProp.price,
      equity_percent: realtyMoleProp.equityPercent,
      mortgage_status: realtyMoleProp.mortgageStatus || 'unknown',
      lien_status: realtyMoleProp.lienStatus || 'none',
      tags: realtyMoleProp.tags || [],
      status: realtyMoleProp.status || 'active',
      source: 'realtymole',
      raw_data: realtyMoleProp
    };
  }

  private mapOwnerType(realtyMoleOwnerType: string): string {
    const mapping: { [key: string]: string } = {
      'individual': 'individual',
      'llc': 'llc',
      'corporation': 'corporation',
      'trust': 'trust',
      'partnership': 'corporation'
    };
    return mapping[realtyMoleOwnerType?.toLowerCase()] || 'unknown';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'realtymole_extractor';
  }
}

// MLS Grid Data Extractor
export class MLSGridDataExtractor extends DataExtractor {
  private apiKey: string;
  private baseUrl = 'https://api.mlsgrid.com/v2';

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_MLSGRID_API_KEY || '';
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('MLS Grid API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    try {
      const areas = source.coverage || ['CA', 'TX', 'FL'];
      const allProperties: RawPropertyData[] = [];

      for (const area of areas) {
        const properties = await this.searchPropertiesByArea(area);
        allProperties.push(...properties);
        
        // Rate limiting
        await this.delay(1000);
      }

      return allProperties;
    } catch (error) {
      console.error('MLS Grid extraction failed:', error);
      return new MockDataExtractor().extract(source);
    }
  }

  private async searchPropertiesByArea(area: string): Promise<RawPropertyData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: area,
          propertyType: 'residential',
          limit: 100
        })
      });

      if (!response.ok) {
        throw new Error(`MLS Grid API error: ${response.status}`);
      }

      const data = await response.json();
      return data.properties?.map((prop: any) => this.transformMLSGridProperty(prop, area)) || [];
    } catch (error) {
      console.error(`MLS Grid search failed for ${area}:`, error);
      return [];
    }
  }

  private transformMLSGridProperty(mlsGridProp: any, area: string): RawPropertyData {
    return {
      address: mlsGridProp.address || 'Unknown Address',
      city: mlsGridProp.city || area,
      state: mlsGridProp.state || area,
      zip: mlsGridProp.postalCode || '',
      latitude: mlsGridProp.latitude,
      longitude: mlsGridProp.longitude,
      owner_name: mlsGridProp.ownerName || 'Unknown Owner',
      owner_type: this.mapOwnerType(mlsGridProp.ownerType),
      property_type: mlsGridProp.propertyType || 'residential',
      bedrooms: mlsGridProp.bedrooms,
      bathrooms: mlsGridProp.bathrooms,
      square_feet: mlsGridProp.squareFootage,
      lot_size: mlsGridProp.lotSize,
      year_built: mlsGridProp.yearBuilt,
      assessed_value: mlsGridProp.assessedValue,
      estimated_value: mlsGridProp.estimatedValue,
      equity_percent: mlsGridProp.equityPercent,
      mortgage_status: mlsGridProp.mortgageStatus || 'unknown',
      lien_status: mlsGridProp.lienStatus || 'none',
      tags: mlsGridProp.tags || [],
      status: mlsGridProp.status || 'active',
      source: 'mlsgrid',
      raw_data: mlsGridProp
    };
  }

  private mapOwnerType(mlsGridOwnerType: string): string {
    const typeMap: { [key: string]: string } = {
      'individual': 'individual',
      'llc': 'llc',
      'corporation': 'corporation',
      'trust': 'trust',
      'partnership': 'corporation'
    };
    return typeMap[mlsGridOwnerType?.toLowerCase()] || 'individual';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'mlsgrid_extractor';
  }
}

export class CountyAssessorDataExtractor extends DataExtractor {
  private baseUrl = 'https://api.countyassessor.com/v1';
  private apiKey: string;
  private countyEndpoints: Map<string, string> = new Map();

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_COUNTY_ASSESSOR_API_KEY || '';
    this.initializeCountyEndpoints();
  }

  private initializeCountyEndpoints(): void {
    // Map of major counties to their assessor API endpoints
    this.countyEndpoints.set('LA', 'https://assessor.lacounty.gov/api');
    this.countyEndpoints.set('ORANGE', 'https://assessor.ocgov.com/api');
    this.countyEndpoints.set('SAN_DIEGO', 'https://arcc.co.san-diego.ca.us/api');
    this.countyEndpoints.set('MIAMI_DADE', 'https://www.miamidade.gov/pa/api');
    this.countyEndpoints.set('HARRIS', 'https://www.hcad.org/api');
    this.countyEndpoints.set('MARICOPA', 'https://assessor.maricopa.gov/api');
    this.countyEndpoints.set('CLARK', 'https://assessor.lacounty.gov/api');
    this.countyEndpoints.set('KING', 'https://info.kingcounty.gov/assessor/api');
    this.countyEndpoints.set('COOK', 'https://www.cookcountyassessor.com/api');
    this.countyEndpoints.set('PHILADELPHIA', 'https://www.phila.gov/api');
  }

  async extract(source: PropertyDataSource): Promise<RawPropertyData[]> {
    if (!this.apiKey) {
      console.warn('County Assessor API key not configured. Using mock data as fallback.');
      return new MockDataExtractor().extract(source);
    }

    try {
      const counties = source.coverage || ['LA', 'ORANGE', 'SAN_DIEGO'];
      const allProperties: RawPropertyData[] = [];

      for (const county of counties) {
        const properties = await this.searchPropertiesByCounty(county);
        allProperties.push(...properties);
        
        // Rate limiting for county APIs
        await this.delay(2000);
      }

      return allProperties;
    } catch (error) {
      console.error('County Assessor extraction failed:', error);
      return new MockDataExtractor().extract(source);
    }
  }

  private async searchPropertiesByCounty(county: string): Promise<RawPropertyData[]> {
    try {
      const endpoint = this.countyEndpoints.get(county);
      if (!endpoint) {
        console.warn(`No endpoint configured for county: ${county}`);
        return [];
      }

      const response = await fetch(`${endpoint}/properties/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-County': county
        },
        body: JSON.stringify({
          county: county,
          propertyType: 'residential',
          limit: 100,
          includeAssessorData: true
        })
      });

      if (!response.ok) {
        throw new Error(`County Assessor API error: ${response.status}`);
      }

      const data = await response.json();
      return data.properties?.map((prop: any) => this.transformCountyProperty(prop, county)) || [];
    } catch (error) {
      console.error(`County Assessor search failed for ${county}:`, error);
      return [];
    }
  }

  private transformCountyProperty(countyProp: any, county: string): RawPropertyData {
    return {
      address: countyProp.address || 'Unknown Address',
      city: countyProp.city || county,
      state: countyProp.state || 'CA',
      zip: countyProp.zipCode || '',
      latitude: countyProp.latitude,
      longitude: countyProp.longitude,
      owner_name: countyProp.ownerName || 'Unknown Owner',
      owner_type: this.mapOwnerType(countyProp.ownerType),
      property_type: countyProp.propertyType || 'residential',
      bedrooms: countyProp.bedrooms,
      bathrooms: countyProp.bathrooms,
      square_feet: countyProp.squareFootage,
      lot_size: countyProp.lotSize,
      year_built: countyProp.yearBuilt,
      assessed_value: countyProp.assessedValue,
      estimated_value: countyProp.estimatedValue,
      equity_percent: countyProp.equityPercent,
      mortgage_status: countyProp.mortgageStatus || 'unknown',
      lien_status: countyProp.lienStatus || 'none',
      tags: countyProp.tags || [],
      status: countyProp.status || 'active',
      source: 'county_assessor',
      raw_data: {
        ...countyProp,
        county: county,
        assessorData: countyProp.assessorData || {}
      }
    };
  }

  private mapOwnerType(countyOwnerType: string): string {
    const typeMap: { [key: string]: string } = {
      'individual': 'individual',
      'llc': 'llc',
      'corporation': 'corporation',
      'trust': 'trust',
      'partnership': 'corporation',
      'absentee': 'absentee'
    };
    return typeMap[countyOwnerType?.toLowerCase()] || 'individual';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSourceName(): string {
    return 'county_assessor_extractor';
  }
}

// Data Transformer
export class PropertyDataTransformer extends DataTransformer {
  async transform(rawData: RawPropertyData[]): Promise<NormalizedProperty[]> {
    return rawData.map(raw => this.transformProperty(raw));
  }

  private transformProperty(raw: RawPropertyData): NormalizedProperty {
    // Generate a unique ID if not provided
    const id = raw.id || this.generatePropertyId(raw);

    // Calculate investment score based on available data
    const investmentScore = this.calculateInvestmentScore(raw);

    // Calculate ARV estimate
    const arvEstimate = this.calculateARVEstimate(raw);

    // Calculate rehab cost estimate
    const rehabCostEstimate = this.calculateRehabCostEstimate(raw);

    return {
      id,
      address: raw.address,
      city: raw.city || '',
      state: raw.state || '',
      zip: raw.zip || '',
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
      owner_name: raw.owner_name || '',
      owner_type: raw.owner_type || 'unknown',
      property_type: raw.property_type || 'residential',
      bedrooms: raw.bedrooms || 0,
      bathrooms: raw.bathrooms || 0,
      square_feet: raw.square_feet || 0,
      lot_size: raw.lot_size || 0,
      year_built: raw.year_built || 0,
      assessed_value: raw.assessed_value || 0,
      estimated_value: raw.estimated_value || 0,
      equity_percent: raw.equity_percent || 0,
      mortgage_status: raw.mortgage_status || 'unknown',
      lien_status: raw.lien_status || 'unknown',
      tags: raw.tags || [],
      status: raw.status || 'active',
      data_source: raw.source,
      data_confidence: this.calculateDataConfidence(raw),
      last_data_update: new Date(),
      // Enhanced fields
      investment_score: investmentScore,
      arv_estimate: arvEstimate,
      rehab_cost_estimate: rehabCostEstimate,
      market_value: raw.estimated_value || raw.assessed_value,
      property_condition: this.assessPropertyCondition(raw),
      price_per_sqft: raw.square_feet ? (raw.estimated_value || 0) / raw.square_feet : 0
    };
  }

  private generatePropertyId(raw: RawPropertyData): string {
    // Create a deterministic ID based on address and coordinates
    const addressHash = this.hashString(raw.address);
    const coordHash = raw.latitude && raw.longitude 
      ? this.hashString(`${raw.latitude},${raw.longitude}`)
      : '0';
    return `${addressHash}-${coordHash}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private calculateInvestmentScore(raw: RawPropertyData): number {
    let score = 5.0; // Base score

    // Equity bonus
    if (raw.equity_percent) {
      if (raw.equity_percent >= 80) score += 2.0;
      else if (raw.equity_percent >= 60) score += 1.5;
      else if (raw.equity_percent >= 40) score += 1.0;
    }

    // Property type bonus
    if (raw.property_type === 'Multi-Family') score += 0.5;
    if (raw.property_type === 'Commercial') score += 0.3;

    // Distressed property bonus
    if (raw.tags?.includes('pre-foreclosure')) score += 1.0;
    if (raw.tags?.includes('tax-delinquent')) score += 0.8;
    if (raw.tags?.includes('distressed')) score += 0.5;

    // Owner type bonus
    if (raw.owner_type === 'LLC') score += 0.3;
    if (raw.owner_type === 'Corporation') score += 0.2;

    return Math.min(10.0, Math.max(1.0, score));
  }

  private calculateARVEstimate(raw: RawPropertyData): number {
    const baseValue = raw.estimated_value || raw.assessed_value || 0;
    
    // Apply ARV multiplier based on property condition
    const condition = this.assessPropertyCondition(raw);
    let multiplier = 1.0;
    
    switch (condition) {
      case 'poor': multiplier = 1.4; break;
      case 'fair': multiplier = 1.2; break;
      case 'good': multiplier = 1.1; break;
      case 'excellent': multiplier = 1.05; break;
    }
    
    return Math.round(baseValue * multiplier);
  }

  private calculateRehabCostEstimate(raw: RawPropertyData): number {
    const squareFeet = raw.square_feet || 1500;
    const condition = this.assessPropertyCondition(raw);
    
    let costPerSqFt = 0;
    switch (condition) {
      case 'poor': costPerSqFt = 50; break;
      case 'fair': costPerSqFt = 30; break;
      case 'good': costPerSqFt = 15; break;
      case 'excellent': costPerSqFt = 5; break;
    }
    
    return Math.round(squareFeet * costPerSqFt);
  }

  private assessPropertyCondition(raw: RawPropertyData): string {
    // Assess condition based on available data
    if (raw.tags?.includes('distressed')) return 'poor';
    if (raw.year_built && raw.year_built < 1970) return 'fair';
    if (raw.year_built && raw.year_built < 1990) return 'good';
    return 'excellent';
  }

  private calculateDataConfidence(raw: RawPropertyData): number {
    let confidence = 0.5; // Base confidence

    // Address completeness
    if (raw.address && raw.city && raw.state && raw.zip) confidence += 0.2;
    
    // Coordinates
    if (raw.latitude && raw.longitude) confidence += 0.1;
    
    // Financial data
    if (raw.assessed_value || raw.estimated_value) confidence += 0.1;
    
    // Owner information
    if (raw.owner_name) confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }

  getSourceName(): string {
    return 'property_transformer';
  }
}

// Data Loader
export class SupabaseDataLoader extends DataLoader {
  async load(properties: NormalizedProperty[]): Promise<{ added: number; updated: number; skipped: number }> {
    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const property of properties) {
      try {
        // Check if property already exists
        const { data: existing } = await supabase
          .from('properties')
          .select('id')
          .eq('id', property.id)
          .single();

        if (existing) {
          // Update existing property
          const { error } = await supabase
            .from('properties')
            .update({
              ...property,
              updated_at: new Date().toISOString()
            })
            .eq('id', property.id);

          if (error) {
            console.error(`Failed to update property ${property.id}:`, error);
            skipped++;
          } else {
            updated++;
          }
        } else {
          // Insert new property
          const { error } = await supabase
            .from('properties')
            .insert({
              ...property,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error(`Failed to insert property ${property.id}:`, error);
            skipped++;
          } else {
            added++;
          }
        }
      } catch (error) {
        console.error(`Error processing property ${property.id}:`, error);
        skipped++;
      }
    }

    return { added, updated, skipped };
  }

  getSourceName(): string {
    return 'supabase';
  }
}

// Data Validator
export class PropertyDataValidator extends DataValidator {
  async validate(property: NormalizedProperty): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 1.0;

    // Required field validation
    if (!property.address) {
      errors.push('Address is required');
      confidence -= 0.3;
    }

    if (!property.city || !property.state) {
      errors.push('City and state are required');
      confidence -= 0.2;
    }

    if (!property.latitude || !property.longitude) {
      warnings.push('Missing coordinates');
      confidence -= 0.1;
    }

    // Data quality checks
    if (property.equity_percent > 100) {
      errors.push('Equity percentage cannot exceed 100%');
      confidence -= 0.2;
    }

    if (property.assessed_value < 0 || property.estimated_value < 0) {
      errors.push('Property values cannot be negative');
      confidence -= 0.2;
    }

    if (property.bedrooms < 0 || property.bathrooms < 0) {
      errors.push('Bedroom/bathroom counts cannot be negative');
      confidence -= 0.1;
    }

    // Address format validation
    if (property.address && property.address.length < 5) {
      warnings.push('Address seems too short');
      confidence -= 0.05;
    }

    return {
      isValid: errors.length === 0,
      confidence: Math.max(0, confidence),
      errors,
      warnings,
      source: property.data_source
    };
  }

  getSourceName(): string {
    return 'property_validator';
  }
}

// ETL Pipeline Manager
export class ETLPipelineManager {
  private pipelines: Map<string, ETLPipeline> = new Map();

  registerPipeline(source: PropertyDataSource): void {
    const extractor = this.createExtractor(source);
    const transformer = new PropertyDataTransformer();
    const loader = new SupabaseDataLoader();
    const validator = new PropertyDataValidator();

    const pipeline = new ETLPipeline(source, extractor, transformer, loader, validator);
    this.pipelines.set(source.name, pipeline);
  }

  private createExtractor(source: PropertyDataSource): DataExtractor {
    switch (source.name) {
      case 'mock':
        return new MockDataExtractor();
      case 'attom':
        return new ATTOMDataExtractor();
      case 'corelogic':
        return new CoreLogicDataExtractor();
      case 'rentspree':
        return new RentSpreeDataExtractor();
      case 'realtymole':
        return new RealtyMoleDataExtractor();
      case 'mlsgrid':
        return new MLSGridDataExtractor();
      case 'county_assessor':
        return new CountyAssessorDataExtractor();
      default:
        return new MockDataExtractor();
    }
  }

  async runPipeline(sourceName: string): Promise<ETLResult> {
    const pipeline = this.pipelines.get(sourceName);
    if (!pipeline) {
      throw new Error(`Pipeline not found for source: ${sourceName}`);
    }

    return await pipeline.run();
  }

  async runAllPipelines(): Promise<ETLResult[]> {
    const results: ETLResult[] = [];
    
    for (const [sourceName, pipeline] of this.pipelines) {
      console.log(`Running pipeline for ${sourceName}...`);
      const result = await pipeline.run();
      results.push(result);
    }

    return results;
  }

  getPipelineStatus(): { source: string; lastRun?: Date; status: string }[] {
    // TODO: Implement pipeline status tracking
    return Array.from(this.pipelines.keys()).map(source => ({
      source,
      status: 'registered'
    }));
  }
}

// Export singleton instance
export const etlPipelineManager = new ETLPipelineManager();

// Register default pipelines
etlPipelineManager.registerPipeline({
  name: 'mock',
  priority: 1,
  updateFrequency: 'daily',
  coverage: ['all']
});

// Register ATTOM Data API pipeline
etlPipelineManager.registerPipeline({
  name: 'attom',
  priority: 2,
  updateFrequency: 'daily',
  coverage: ['AZ', 'TX', 'FL', 'GA', 'NV'],
  apiKey: import.meta.env.VITE_ATTOM_API_KEY,
  baseUrl: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0',
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  }
});

// Register CoreLogic Data API pipeline
        etlPipelineManager.registerPipeline({
          name: 'corelogic',
          priority: 3,
          updateFrequency: 'daily',
          coverage: ['AZ', 'TX', 'FL'],
          apiKey: import.meta.env.VITE_CORELOGIC_API_KEY,
          baseUrl: 'https://api.corelogic.com/v1',
          rateLimit: {
            requestsPerMinute: 40,
            requestsPerHour: 500
          }
        });

        // Register MLS pipelines for Phase 2C
        etlPipelineManager.registerPipeline({
          name: 'rentspree',
          priority: 4,
          updateFrequency: 'daily',
          coverage: ['AZ', 'TX', 'FL'],
          apiKey: import.meta.env.VITE_RENTSPREE_API_KEY,
          baseUrl: 'https://api.rentspree.com/v1',
          rateLimit: {
            requestsPerMinute: 60,
            requestsPerHour: 1000
          }
        });

        etlPipelineManager.registerPipeline({
          name: 'realtymole',
          priority: 5,
          updateFrequency: 'daily',
          coverage: ['AZ', 'TX', 'FL', 'GA', 'NV'],
          apiKey: import.meta.env.VITE_REALTYMOLE_API_KEY,
          baseUrl: 'https://realty-mole-property-api.p.rapidapi.com',
          rateLimit: {
            requestsPerMinute: 50,
            requestsPerHour: 800
          }
        });

        etlPipelineManager.registerPipeline({
          name: 'mlsgrid',
          priority: 6,
          updateFrequency: 'daily',
          coverage: ['AZ', 'TX', 'FL', 'GA', 'NV'],
          apiKey: import.meta.env.VITE_MLSGRID_API_KEY,
          baseUrl: 'https://api.mlsgrid.com/v2',
          rateLimit: {
            requestsPerMinute: 100,
            requestsPerHour: 2000
          }
        });

        // Register County Assessor pipeline for Phase 2D
        etlPipelineManager.registerPipeline({
          name: 'county_assessor',
          priority: 7,
          updateFrequency: 'weekly',
          coverage: ['LA', 'ORANGE', 'SAN_DIEGO', 'MIAMI_DADE', 'HARRIS', 'MARICOPA', 'CLARK', 'KING', 'COOK', 'PHILADELPHIA'],
          apiKey: import.meta.env.VITE_COUNTY_ASSESSOR_API_KEY,
          baseUrl: 'https://api.countyassessor.com/v1',
          rateLimit: {
            requestsPerMinute: 30,
            requestsPerHour: 500
          }
        });