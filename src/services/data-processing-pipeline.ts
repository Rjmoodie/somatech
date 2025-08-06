// Data Processing Pipeline
// Handles address standardization, geocoding, deduplication, and data enrichment

export interface ProcessingResult {
  success: boolean;
  processedRecords: number;
  validRecords: number;
  geocodedRecords: number;
  deduplicatedRecords: number;
  enrichedRecords: number;
  errors: string[];
  processingTime: number;
}

export interface EnrichedProperty extends ProcessedProperty {
  latitude?: number;
  longitude?: number;
  zip_code?: string;
  census_tract?: string;
  block_group?: string;
  federal_data?: {
    census?: CensusData;
    flood_zone?: FloodZoneData;
    environmental?: EnvironmentalData;
  };
  confidence_score: number;
  data_sources: string[];
  last_updated: string;
}

import { env } from '@/lib/env';

export class DataProcessingPipeline {
  private readonly geocodingApiKey: string;
  private readonly geocodingBaseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(geocodingApiKey?: string) {
    this.geocodingApiKey = geocodingApiKey || env.MAPBOX_API_KEY || '';
  }

  /**
   * Process a batch of raw property data
   */
  async processPropertyBatch(
    rawProperties: ProcessedProperty[]
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    try {
      console.log(`🔄 Processing ${rawProperties.length} properties...`);
      
      // Step 1: Address Standardization
      const standardizedProperties = await this.standardizeAddresses(rawProperties);
      console.log(`✅ Standardized ${standardizedProperties.length} addresses`);
      
      // Step 2: Geocoding
      const geocodedProperties = await this.geocodeAddresses(standardizedProperties);
      console.log(`✅ Geocoded ${geocodedProperties.filter(p => p.latitude && p.longitude).length} properties`);
      
      // Step 3: Deduplication
      const deduplicatedProperties = await this.deduplicateProperties(geocodedProperties);
      console.log(`✅ Deduplicated to ${deduplicatedProperties.length} unique properties`);
      
      // Step 4: Data Enrichment
      const enrichedProperties = await this.enrichProperties(deduplicatedProperties);
      console.log(`✅ Enriched ${enrichedProperties.length} properties`);
      
      // Step 5: Validation
      const validProperties = enrichedProperties.filter(p => this.isValidProperty(p));
      console.log(`✅ Validated ${validProperties.length} properties`);
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        processedRecords: rawProperties.length,
        validRecords: validProperties.length,
        geocodedRecords: geocodedProperties.filter(p => p.latitude && p.longitude).length,
        deduplicatedRecords: deduplicatedProperties.length,
        enrichedRecords: enrichedProperties.length,
        errors,
        processingTime
      };
      
    } catch (error) {
      console.error('❌ Error in data processing pipeline:', error);
      return {
        success: false,
        processedRecords: rawProperties.length,
        validRecords: 0,
        geocodedRecords: 0,
        deduplicatedRecords: 0,
        enrichedRecords: 0,
        errors: [error.message],
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Standardize addresses using USPS format
   */
  private async standardizeAddresses(properties: ProcessedProperty[]): Promise<ProcessedProperty[]> {
    const standardized: ProcessedProperty[] = [];
    
    for (const property of properties) {
      try {
        const standardizedAddress = await this.standardizeAddress(property.address);
        if (standardizedAddress) {
          standardized.push({
            ...property,
            address: standardizedAddress
          });
        }
      } catch (error) {
        console.log(`⚠️ Failed to standardize address: ${property.address}`);
      }
    }
    
    return standardized;
  }

  /**
   * Standardize a single address
   */
  private async standardizeAddress(address: string): Promise<string | null> {
    if (!address) return null;
    
    try {
      // Basic standardization
      let standardized = address
        .replace(/\s+/g, ' ')
        .replace(/\./g, '')
        .toUpperCase()
        .trim();
      
      // Common abbreviations
      const abbreviations: Record<string, string> = {
        'STREET': 'ST',
        'AVENUE': 'AVE',
        'BOULEVARD': 'BLVD',
        'DRIVE': 'DR',
        'ROAD': 'RD',
        'LANE': 'LN',
        'COURT': 'CT',
        'PLACE': 'PL',
        'CIRCLE': 'CIR',
        'WAY': 'WAY',
        'TERRACE': 'TER',
        'PARKWAY': 'PKWY',
        'HIGHWAY': 'HWY',
        'NORTH': 'N',
        'SOUTH': 'S',
        'EAST': 'E',
        'WEST': 'W',
        'NORTHEAST': 'NE',
        'NORTHWEST': 'NW',
        'SOUTHEAST': 'SE',
        'SOUTHWEST': 'SW'
      };
      
      // Apply abbreviations
      for (const [full, abbrev] of Object.entries(abbreviations)) {
        const regex = new RegExp(`\\b${full}\\b`, 'gi');
        standardized = standardized.replace(regex, abbrev);
      }
      
      return standardized;
      
    } catch (error) {
      console.log(`⚠️ Address standardization failed: ${error.message}`);
      return address; // Return original if standardization fails
    }
  }

  /**
   * Geocode addresses using Mapbox API
   */
  private async geocodeAddresses(properties: ProcessedProperty[]): Promise<ProcessedProperty[]> {
    const geocoded: ProcessedProperty[] = [];
    
    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (property) => {
        try {
          const geocodedProperty = await this.geocodeAddress(property);
          return geocodedProperty;
        } catch (error) {
          console.log(`⚠️ Geocoding failed for ${property.address}: ${error.message}`);
          return property; // Return original if geocoding fails
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      geocoded.push(...batchResults);
      
      // Rate limiting
      if (i + batchSize < properties.length) {
        await this.delay(1000); // 1 second delay between batches
      }
    }
    
    return geocoded;
  }

  /**
   * Geocode a single address
   */
  private async geocodeAddress(property: ProcessedProperty): Promise<ProcessedProperty> {
    if (!this.geocodingApiKey) {
      console.log('⚠️ No geocoding API key provided, skipping geocoding');
      return property;
    }
    
    try {
      const encodedAddress = encodeURIComponent(property.address);
      const url = `${this.geocodingBaseUrl}/${encodedAddress}.json?access_token=${this.geocodingApiKey}&country=US&types=address`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        // Extract additional information
        const context = feature.context || [];
        const zipCode = context.find((c: any) => c.id.startsWith('postcode'))?.text;
        const state = context.find((c: any) => c.id.startsWith('region'))?.text;
        const county = context.find((c: any) => c.id.startsWith('place'))?.text;
        
        return {
          ...property,
          latitude: lat,
          longitude: lng,
          zip: zipCode || property.zip,
          state: state || property.state,
          county: county || property.county
        };
      }
      
      return property;
      
    } catch (error) {
      console.log(`⚠️ Geocoding failed for ${property.address}: ${error.message}`);
      return property;
    }
  }

  /**
   * Deduplicate properties based on address and owner
   */
  private async deduplicateProperties(properties: ProcessedProperty[]): Promise<ProcessedProperty[]> {
    const uniqueProperties = new Map<string, ProcessedProperty>();
    
    for (const property of properties) {
      // Create a unique key based on address and owner
      const key = this.createDeduplicationKey(property);
      
      if (uniqueProperties.has(key)) {
        // Merge with existing property (keep the one with higher confidence)
        const existing = uniqueProperties.get(key)!;
        if (property.confidence_score > existing.confidence_score) {
          uniqueProperties.set(key, property);
        }
      } else {
        uniqueProperties.set(key, property);
      }
    }
    
    return Array.from(uniqueProperties.values());
  }

  /**
   * Create a deduplication key for a property
   */
  private createDeduplicationKey(property: ProcessedProperty): string {
    const normalizedAddress = property.address
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    
    const normalizedOwner = property.owner_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    
    return `${normalizedAddress}_${normalizedOwner}`;
  }

  /**
   * Enrich properties with federal data
   */
  private async enrichProperties(properties: ProcessedProperty[]): Promise<EnrichedProperty[]> {
    const enriched: EnrichedProperty[] = [];
    
    // Import federal data integrator
    const { federalDataIntegrator } = await import('./federal-data-integration');
    
    for (const property of properties) {
      try {
        const enrichedProperty = await this.enrichProperty(property, federalDataIntegrator);
        enriched.push(enrichedProperty);
      } catch (error) {
        console.log(`⚠️ Failed to enrich property ${property.id}: ${error.message}`);
        // Add property without enrichment
        enriched.push({
          ...property,
          federal_data: {},
          data_sources: [property.data_source],
          last_updated: new Date().toISOString()
        });
      }
    }
    
    return enriched;
  }

  /**
   * Enrich a single property with federal data
   */
  private async enrichProperty(
    property: ProcessedProperty,
    federalIntegrator: any
  ): Promise<EnrichedProperty> {
    const federalData = await federalIntegrator.getFederalDataForProperty(
      property.address,
      property.latitude || 0,
      property.longitude || 0
    );
    
    return {
      ...property,
      federal_data: federalData,
      data_sources: [property.data_source],
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Validate if a property record is complete and accurate
   */
  private isValidProperty(property: EnrichedProperty): boolean {
    // Basic validation
    if (!property.address || property.address.length < 5) return false;
    if (!property.owner_name || property.owner_name.length < 2) return false;
    if (!property.state || property.state === 'Unknown') return false;
    
    // Address format validation
    const addressRegex = /^\d+\s+[A-Z\s]+(?:ST|AVE|BLVD|DR|RD|LN|CT|PL|CIR|WAY|TER|PKWY|HWY)\s*[A-Z\s]*$/i;
    if (!addressRegex.test(property.address)) return false;
    
    // Confidence score validation
    if (property.confidence_score < 50) return false;
    
    return true;
  }

  /**
   * Calculate overall data quality metrics
   */
  calculateDataQuality(properties: EnrichedProperty[]): {
    totalRecords: number;
    validRecords: number;
    geocodedRecords: number;
    enrichedRecords: number;
    averageConfidence: number;
    qualityScore: number;
  } {
    const totalRecords = properties.length;
    const validRecords = properties.filter(p => this.isValidProperty(p)).length;
    const geocodedRecords = properties.filter(p => p.latitude && p.longitude).length;
    const enrichedRecords = properties.filter(p => p.federal_data && Object.keys(p.federal_data).length > 0).length;
    
    const averageConfidence = properties.reduce((sum, p) => sum + p.confidence_score, 0) / totalRecords;
    const qualityScore = (validRecords / totalRecords) * 100;
    
    return {
      totalRecords,
      validRecords,
      geocodedRecords,
      enrichedRecords,
      averageConfidence,
      qualityScore
    };
  }

  /**
   * Export processed data to various formats
   */
  async exportData(
    properties: EnrichedProperty[],
    format: 'csv' | 'json' | 'geojson'
  ): Promise<string> {
    switch (format) {
      case 'csv':
        return this.exportToCSV(properties);
      case 'json':
        return this.exportToJSON(properties);
      case 'geojson':
        return this.exportToGeoJSON(properties);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(properties: EnrichedProperty[]): string {
    const headers = [
      'id', 'address', 'owner_name', 'assessed_value', 'property_type',
      'state', 'county', 'zip', 'latitude', 'longitude', 'confidence_score',
      'data_source', 'created_at'
    ];
    
    const csvRows = [headers.join(',')];
    
    for (const property of properties) {
      const row = headers.map(header => {
        const value = property[header as keyof EnrichedProperty];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(row.join(','));
    }
    
    return csvRows.join('\n');
  }

  /**
   * Export to JSON format
   */
  private exportToJSON(properties: EnrichedProperty[]): string {
    return JSON.stringify(properties, null, 2);
  }

  /**
   * Export to GeoJSON format
   */
  private exportToGeoJSON(properties: EnrichedProperty[]): string {
    const geojson = {
      type: 'FeatureCollection',
      features: properties
        .filter(p => p.latitude && p.longitude)
        .map(property => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [property.longitude, property.latitude]
          },
          properties: {
            id: property.id,
            address: property.address,
            owner_name: property.owner_name,
            assessed_value: property.assessed_value,
            state: property.state,
            county: property.county,
            confidence_score: property.confidence_score
          }
        }))
    };
    
    return JSON.stringify(geojson, null, 2);
  }

  /**
   * Delay function for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const dataProcessingPipeline = new DataProcessingPipeline(); 