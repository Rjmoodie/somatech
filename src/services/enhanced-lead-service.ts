import { supabase } from '@/integrations/supabase/client';
import { Property, SearchFilters, SearchResult, GeospatialSearch, FullTextSearch } from '@/types/property';
import { redisCache, CacheKeys, Cached } from '@/services/redis-cache-service';
import { ETLPipelineManager, ETLResult } from '@/services/etl-pipeline';

export class EnhancedLeadService {
  private static instance: EnhancedLeadService;
  private etlPipelineManager: ETLPipelineManager;

  private constructor() {
    this.etlPipelineManager = new ETLPipelineManager();
    // Register all available data sources
    this.etlPipelineManager.registerPipeline({ name: 'attom', priority: 1, updateFrequency: 'daily', coverage: ['all'] });
    this.etlPipelineManager.registerPipeline({ name: 'corelogic', priority: 2, updateFrequency: 'daily', coverage: ['all'] });
    this.etlPipelineManager.registerPipeline({ name: 'rentspree', priority: 3, updateFrequency: 'daily', coverage: ['all'] });
    this.etlPipelineManager.registerPipeline({ name: 'realtymole', priority: 4, updateFrequency: 'daily', coverage: ['all'] });
    this.etlPipelineManager.registerPipeline({ name: 'mlsgrid', priority: 5, updateFrequency: 'daily', coverage: ['all'] });
    this.etlPipelineManager.registerPipeline({ name: 'county_assessor', priority: 6, updateFrequency: 'weekly', coverage: ['all'] });
  }

  static getInstance(): EnhancedLeadService {
    if (!EnhancedLeadService.instance) {
      EnhancedLeadService.instance = new EnhancedLeadService();
    }
    return EnhancedLeadService.instance;
  }

  // Cache property by ID with 10 minute TTL
  @Cached(600000, (propertyId: string) => CacheKeys.property(propertyId))
  async getPropertyById(propertyId: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return data;
  }

  // Cache search results with 5 minute TTL
  @Cached(300000, (filters: SearchFilters) => CacheKeys.propertySearch(JSON.stringify(filters)))
  async searchProperties(filters: SearchFilters = {}, page: number = 1, pageSize: number = 20): Promise<SearchResult> {
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.city) query = query.eq('city', filters.city);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.zip) query = query.eq('zip', filters.zip);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.ownerType) query = query.eq('owner_type', filters.ownerType);
    if (filters.minBedrooms) query = query.gte('bedrooms', filters.minBedrooms);
    if (filters.maxBedrooms) query = query.lte('bedrooms', filters.maxBedrooms);
    if (filters.minBathrooms) query = query.gte('bathrooms', filters.minBathrooms);
    if (filters.maxBathrooms) query = query.lte('bathrooms', filters.maxBathrooms);
    if (filters.minSquareFeet) query = query.gte('square_feet', filters.minSquareFeet);
    if (filters.maxSquareFeet) query = query.lte('square_feet', filters.maxSquareFeet);
    if (filters.minYearBuilt) query = query.gte('year_built', filters.minYearBuilt);
    if (filters.maxYearBuilt) query = query.lte('year_built', filters.maxYearBuilt);
    if (filters.minAssessedValue) query = query.gte('assessed_value', filters.minAssessedValue);
    if (filters.maxAssessedValue) query = query.lte('assessed_value', filters.maxAssessedValue);
    if (filters.minEstimatedValue) query = query.gte('estimated_value', filters.minEstimatedValue);
    if (filters.maxEstimatedValue) query = query.lte('estimated_value', filters.maxEstimatedValue);
    if (filters.minEquityPercent) query = query.gte('equity_percent', filters.minEquityPercent);
    if (filters.maxEquityPercent) query = query.lte('equity_percent', filters.maxEquityPercent);
    if (filters.mortgageStatus) query = query.eq('mortgage_status', filters.mortgageStatus);
    if (filters.lienStatus) query = query.eq('lien_status', filters.lienStatus);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Apply sorting
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      return { properties: [], total: 0, page, pageSize };
    }

    return {
      properties: data || [],
      total: count || 0,
      page,
      pageSize
    };
  }

  // Cache geospatial search results with 3 minute TTL
  @Cached(180000, (search: GeospatialSearch) => `geospatial:${JSON.stringify(search)}`)
  async searchByGeospatial(search: GeospatialSearch): Promise<Property[]> {
    let query: string;
    let params: any[] = [];

    switch (search.type) {
      case 'radius':
        query = `
          SELECT * FROM properties 
          WHERE ST_DWithin(
            location::geography, 
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
            $3
          )
          ORDER BY location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
        `;
        params = [search.longitude, search.latitude, search.radius];
        break;

      case 'polygon':
        const polygonCoords = search.coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(',');
        query = `
          SELECT * FROM properties 
          WHERE ST_Within(
            location, 
            ST_GeomFromText('POLYGON((${polygonCoords}))', 4326)
          )
        `;
        break;

      case 'nearest':
        query = `
          SELECT * FROM properties 
          ORDER BY location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
          LIMIT $3
        `;
        params = [search.longitude, search.latitude, search.limit || 10];
        break;

      default:
        throw new Error(`Unsupported geospatial search type: ${search.type}`);
    }

    const { data, error } = await supabase.rpc('execute_geospatial_search', {
      query_text: query,
      query_params: params
    });

    if (error) {
      console.error('Error in geospatial search:', error);
      return [];
    }

    return data || [];
  }

  // Cache full-text search results with 3 minute TTL
  @Cached(180000, (search: FullTextSearch) => `fulltext:${JSON.stringify(search)}`)
  async searchByFullText(search: FullTextSearch): Promise<Property[]> {
    const { data, error } = await supabase.rpc('search_properties_fulltext', {
      search_query: search.query,
      search_limit: search.limit || 50
    });

    if (error) {
      console.error('Error in full-text search:', error);
      return [];
    }

    return data || [];
  }

  // Cache property statistics with 15 minute TTL
  @Cached(900000, () => 'property_stats')
  async getPropertyStatistics(): Promise<{
    totalProperties: number;
    propertiesByState: Array<{ state: string; count: number }>;
    propertiesByType: Array<{ type: string; count: number }>;
    averageValues: {
      assessedValue: number;
      estimatedValue: number;
      equityPercent: number;
    };
  }> {
    const { data: totalData, error: totalError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    const { data: stateData, error: stateError } = await supabase
      .from('properties')
      .select('state, count')
      .select('state')
      .select('state');

    const { data: typeData, error: typeError } = await supabase
      .from('properties')
      .select('property_type')
      .select('property_type');

    const { data: avgData, error: avgError } = await supabase
      .from('properties')
      .select('assessed_value, estimated_value, equity_percent');

    if (totalError || stateError || typeError || avgError) {
      console.error('Error fetching property statistics:', { totalError, stateError, typeError, avgError });
      return {
        totalProperties: 0,
        propertiesByState: [],
        propertiesByType: [],
        averageValues: { assessedValue: 0, estimatedValue: 0, equityPercent: 0 }
      };
    }

    // Process state data
    const stateCounts = new Map<string, number>();
    stateData?.forEach(property => {
      const state = property.state;
      stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
    });

    // Process type data
    const typeCounts = new Map<string, number>();
    typeData?.forEach(property => {
      const type = property.property_type;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });

    // Calculate averages
    const totalProperties = totalData?.length || 0;
    const avgAssessedValue = avgData?.reduce((sum, p) => sum + (p.assessed_value || 0), 0) / totalProperties || 0;
    const avgEstimatedValue = avgData?.reduce((sum, p) => sum + (p.estimated_value || 0), 0) / totalProperties || 0;
    const avgEquityPercent = avgData?.reduce((sum, p) => sum + (p.equity_percent || 0), 0) / totalProperties || 0;

    return {
      totalProperties,
      propertiesByState: Array.from(stateCounts.entries()).map(([state, count]) => ({ state, count })),
      propertiesByType: Array.from(typeCounts.entries()).map(([type, count]) => ({ type, count })),
      averageValues: {
        assessedValue: avgAssessedValue,
        estimatedValue: avgEstimatedValue,
        equityPercent: avgEquityPercent
      }
    };
  }

  // Invalidate cache for a specific property
  async invalidatePropertyCache(propertyId: string): Promise<void> {
    redisCache.delete(CacheKeys.property(propertyId));
  }

  // Invalidate all property search caches
  async invalidateSearchCache(): Promise<void> {
    const searchKeys = redisCache.keys('property_search:*');
    searchKeys.forEach(key => redisCache.delete(key));
  }

  // Invalidate all property-related caches
  async invalidateAllPropertyCaches(): Promise<void> {
    const propertyKeys = redisCache.keys('property:*');
    const searchKeys = redisCache.keys('property_search:*');
    const geospatialKeys = redisCache.keys('geospatial:*');
    const fulltextKeys = redisCache.keys('fulltext:*');
    const statsKey = 'property_stats';

    [...propertyKeys, ...searchKeys, ...geospatialKeys, ...fulltextKeys, statsKey].forEach(key => {
      redisCache.delete(key);
    });
  }

  // Get cache statistics for monitoring
  getCacheStats() {
    return redisCache.getStats();
  }

  /**
   * Refresh property data from all available sources
   * This method triggers the ETL pipeline to fetch fresh data
   */
  async refreshPropertyData(source?: string): Promise<ETLResult[]> {
    try {
      console.log('Starting property data refresh...');
      
      if (source) {
        // Run specific pipeline
        const result = await this.etlPipelineManager.runPipeline(source);
        return [result];
      } else {
        // Run all pipelines
        const results = await this.etlPipelineManager.runAllPipelines();
        console.log(`Completed data refresh. Processed ${results.length} sources.`);
        return results;
      }
    } catch (error) {
      console.error('Error refreshing property data:', error);
      throw error;
    }
  }

  /**
   * Get the status of all ETL pipelines
   */
  getPipelineStatus(): { source: string; lastRun?: Date; status: string }[] {
    return this.etlPipelineManager.getPipelineStatus();
  }
}

export const enhancedLeadService = EnhancedLeadService.getInstance(); 