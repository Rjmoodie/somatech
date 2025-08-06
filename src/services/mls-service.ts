import { supabase } from '@/integrations/supabase/client';
import { redisCache, CacheKeys, Cached } from '@/services/redis-cache-service';

export interface MLSListing {
  id: string;
  property_id: string;
  mls_id: string;
  mls_source: string;
  listing_status: 'active' | 'pending' | 'sold' | 'withdrawn' | 'expired' | 'unknown';
  listing_date: string;
  listing_price: number;
  listing_agent?: string;
  listing_office?: string;
  showing_instructions?: string;
  virtual_tour_url?: string;
  property_description?: string;
  features?: string[];
  appliances?: string[];
  parking_type?: string;
  garage_spaces?: number;
  pool?: boolean;
  fireplace?: boolean;
  central_air?: boolean;
  heating_type?: string;
  cooling_type?: string;
  roof_type?: string;
  exterior_material?: string;
  foundation_type?: string;
  lot_features?: string[];
  hoa_fee?: number;
  hoa_frequency?: 'monthly' | 'quarterly' | 'annually' | 'unknown';
  tax_year?: number;
  annual_taxes?: number;
  insurance_cost?: number;
  utilities_cost?: number;
  monthly_payment_estimate?: number;
  down_payment_estimate?: number;
  closing_cost_estimate?: number;
  created_at: string;
  updated_at: string;
}

export interface MLSPriceHistory {
  id: string;
  mls_listing_id: string;
  price_change_date: string;
  old_price?: number;
  new_price: number;
  price_change_reason?: string;
  created_at: string;
}

export interface MLSPhoto {
  id: string;
  mls_listing_id: string;
  photo_url: string;
  photo_type: 'exterior' | 'interior' | 'aerial' | 'street_view' | 'floor_plan' | 'virtual_tour';
  caption?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface MLSOpenHouse {
  id: string;
  mls_listing_id: string;
  open_house_date: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  refreshments: boolean;
  created_at: string;
}

export interface MLSDataSource {
  id: string;
  source_name: string;
  source_type: 'residential' | 'commercial' | 'land' | 'rental';
  coverage_areas: string[];
  api_endpoint?: string;
  api_key_required: boolean;
  rate_limit_requests_per_minute?: number;
  rate_limit_requests_per_hour?: number;
  last_sync_date?: string;
  sync_status: 'active' | 'inactive' | 'error' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface MLSSyncLog {
  id: string;
  mls_source_id: string;
  sync_start_time: string;
  sync_end_time?: string;
  sync_status: 'running' | 'completed' | 'failed' | 'partial';
  properties_found: number;
  properties_processed: number;
  properties_added: number;
  properties_updated: number;
  properties_skipped: number;
  errors: string[];
  warnings: string[];
  created_at: string;
}

export interface MLSFilters {
  mls_source?: string;
  listing_status?: string[];
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  bathrooms_min?: number;
  bathrooms_max?: number;
  square_feet_min?: number;
  square_feet_max?: number;
  year_built_min?: number;
  year_built_max?: number;
  days_on_market_min?: number;
  days_on_market_max?: number;
  features?: string[];
  pool?: boolean;
  fireplace?: boolean;
  central_air?: boolean;
  garage_spaces_min?: number;
  hoa_fee_max?: number;
  sort_by?: 'listing_price' | 'listing_date' | 'days_on_market' | 'square_feet';
  sort_order?: 'asc' | 'desc';
}

export class MLSService {
  private static instance: MLSService;

  private constructor() {}

  static getInstance(): MLSService {
    if (!MLSService.instance) {
      MLSService.instance = new MLSService();
    }
    return MLSService.instance;
  }

  // MLS Listings Management
  @Cached(300000, (filters: MLSFilters) => CacheKeys.mlsSearch(filters))
  async getMLSListings(filters: MLSFilters = {}, page: number = 1, pageSize: number = 20): Promise<{ listings: MLSListing[]; total: number }> {
    try {
      let query = supabase
        .from('mls_listings')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.mls_source) {
        query = query.eq('mls_source', filters.mls_source);
      }

      if (filters.listing_status && filters.listing_status.length > 0) {
        query = query.in('listing_status', filters.listing_status);
      }

      if (filters.price_min !== undefined) {
        query = query.gte('listing_price', filters.price_min);
      }

      if (filters.price_max !== undefined) {
        query = query.lte('listing_price', filters.price_max);
      }

      if (filters.bedrooms_min !== undefined) {
        query = query.gte('bedrooms', filters.bedrooms_min);
      }

      if (filters.bedrooms_max !== undefined) {
        query = query.lte('bedrooms', filters.bedrooms_max);
      }

      if (filters.bathrooms_min !== undefined) {
        query = query.gte('bathrooms', filters.bathrooms_min);
      }

      if (filters.bathrooms_max !== undefined) {
        query = query.lte('bathrooms', filters.bathrooms_max);
      }

      if (filters.square_feet_min !== undefined) {
        query = query.gte('square_feet', filters.square_feet_min);
      }

      if (filters.square_feet_max !== undefined) {
        query = query.lte('square_feet', filters.square_feet_max);
      }

      if (filters.year_built_min !== undefined) {
        query = query.gte('year_built', filters.year_built_min);
      }

      if (filters.year_built_max !== undefined) {
        query = query.lte('year_built', filters.year_built_max);
      }

      if (filters.days_on_market_min !== undefined) {
        query = query.gte('days_on_market', filters.days_on_market_min);
      }

      if (filters.days_on_market_max !== undefined) {
        query = query.lte('days_on_market', filters.days_on_market_max);
      }

      if (filters.pool !== undefined) {
        query = query.eq('pool', filters.pool);
      }

      if (filters.fireplace !== undefined) {
        query = query.eq('fireplace', filters.fireplace);
      }

      if (filters.central_air !== undefined) {
        query = query.eq('central_air', filters.central_air);
      }

      if (filters.garage_spaces_min !== undefined) {
        query = query.gte('garage_spaces', filters.garage_spaces_min);
      }

      if (filters.hoa_fee_max !== undefined) {
        query = query.lte('hoa_fee', filters.hoa_fee_max);
      }

      // Apply sorting
      if (filters.sort_by) {
        const order = filters.sort_order || 'desc';
        query = query.order(filters.sort_by, { ascending: order === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: listings, count, error } = await query;

      if (error) {
        throw error;
      }

      return {
        listings: listings || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching MLS listings:', error);
      throw error;
    }
  }

  @Cached(600000, (id: string) => CacheKeys.mlsListing(id))
  async getMLSListingById(id: string): Promise<MLSListing | null> {
    try {
      const { data, error } = await supabase
        .from('mls_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching MLS listing by ID:', error);
      return null;
    }
  }

  async getMLSListingByMLSId(mlsId: string, mlsSource: string): Promise<MLSListing | null> {
    try {
      const { data, error } = await supabase
        .from('mls_listings')
        .select('*')
        .eq('mls_id', mlsId)
        .eq('mls_source', mlsSource)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching MLS listing by MLS ID:', error);
      return null;
    }
  }

  async createMLSListing(listing: Omit<MLSListing, 'id' | 'created_at' | 'updated_at'>): Promise<MLSListing> {
    try {
      const { data, error } = await supabase
        .from('mls_listings')
        .insert(listing)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating MLS listing:', error);
      throw error;
    }
  }

  async updateMLSListing(id: string, updates: Partial<MLSListing>): Promise<MLSListing> {
    try {
      const { data, error } = await supabase
        .from('mls_listings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating MLS listing:', error);
      throw error;
    }
  }

  // MLS Price History Management
  async getMLSPriceHistory(mlsListingId: string): Promise<MLSPriceHistory[]> {
    try {
      const { data, error } = await supabase
        .from('mls_price_history')
        .select('*')
        .eq('mls_listing_id', mlsListingId)
        .order('price_change_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching MLS price history:', error);
      throw error;
    }
  }

  async addPriceChange(priceChange: Omit<MLSPriceHistory, 'id' | 'created_at'>): Promise<MLSPriceHistory> {
    try {
      const { data, error } = await supabase
        .from('mls_price_history')
        .insert(priceChange)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding price change:', error);
      throw error;
    }
  }

  // MLS Photos Management
  async getMLSPhotos(mlsListingId: string): Promise<MLSPhoto[]> {
    try {
      const { data, error } = await supabase
        .from('mls_photos')
        .select('*')
        .eq('mls_listing_id', mlsListingId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching MLS photos:', error);
      throw error;
    }
  }

  async addMLSPhoto(photo: Omit<MLSPhoto, 'id' | 'created_at'>): Promise<MLSPhoto> {
    try {
      const { data, error } = await supabase
        .from('mls_photos')
        .insert(photo)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding MLS photo:', error);
      throw error;
    }
  }

  // MLS Open Houses Management
  async getMLSOpenHouses(mlsListingId: string): Promise<MLSOpenHouse[]> {
    try {
      const { data, error } = await supabase
        .from('mls_open_houses')
        .select('*')
        .eq('mls_listing_id', mlsListingId)
        .order('open_house_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching MLS open houses:', error);
      throw error;
    }
  }

  async addMLSOpenHouse(openHouse: Omit<MLSOpenHouse, 'id' | 'created_at'>): Promise<MLSOpenHouse> {
    try {
      const { data, error } = await supabase
        .from('mls_open_houses')
        .insert(openHouse)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding MLS open house:', error);
      throw error;
    }
  }

  // MLS Data Sources Management
  async getMLSDataSources(): Promise<MLSDataSource[]> {
    try {
      const { data, error } = await supabase
        .from('mls_data_sources')
        .select('*')
        .order('source_name', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching MLS data sources:', error);
      throw error;
    }
  }

  async updateMLSDataSourceSyncStatus(id: string, syncStatus: MLSDataSource['sync_status'], lastSyncDate?: string): Promise<void> {
    try {
      const updates: any = { sync_status: syncStatus };
      if (lastSyncDate) {
        updates.last_sync_date = lastSyncDate;
      }

      const { error } = await supabase
        .from('mls_data_sources')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating MLS data source sync status:', error);
      throw error;
    }
  }

  // MLS Sync Log Management
  async createSyncLog(syncLog: Omit<MLSSyncLog, 'id' | 'created_at'>): Promise<MLSSyncLog> {
    try {
      const { data, error } = await supabase
        .from('mls_sync_log')
        .insert(syncLog)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating sync log:', error);
      throw error;
    }
  }

  async updateSyncLog(id: string, updates: Partial<MLSSyncLog>): Promise<MLSSyncLog> {
    try {
      const { data, error } = await supabase
        .from('mls_sync_log')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating sync log:', error);
      throw error;
    }
  }

  async getRecentSyncLogs(limit: number = 10): Promise<MLSSyncLog[]> {
    try {
      const { data, error } = await supabase
        .from('mls_sync_log')
        .select('*')
        .order('sync_start_time', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent sync logs:', error);
      throw error;
    }
  }

  // MLS Analytics and Reporting
  @Cached(900000, () => 'mls_analytics')
  async getMLSAnalytics(): Promise<{
    totalListings: number;
    activeListings: number;
    averageDaysOnMarket: number;
    averageListingPrice: number;
    priceReductionRate: number;
    topMLSSources: Array<{ source: string; count: number }>;
    listingsByStatus: Array<{ status: string; count: number }>;
  }> {
    try {
      // Get total listings
      const { count: totalListings } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true });

      // Get active listings
      const { count: activeListings } = await supabase
        .from('mls_listings')
        .select('*', { count: 'exact', head: true })
        .eq('listing_status', 'active');

      // Get average days on market
      const { data: daysOnMarketData } = await supabase
        .from('mls_listings')
        .select('days_on_market')
        .not('days_on_market', 'is', null);

      const averageDaysOnMarket = daysOnMarketData?.length 
        ? daysOnMarketData.reduce((sum, item) => sum + (item.days_on_market || 0), 0) / daysOnMarketData.length
        : 0;

      // Get average listing price
      const { data: priceData } = await supabase
        .from('mls_listings')
        .select('listing_price')
        .not('listing_price', 'is', null);

      const averageListingPrice = priceData?.length
        ? priceData.reduce((sum, item) => sum + (item.listing_price || 0), 0) / priceData.length
        : 0;

      // Get price reduction rate
      const { count: priceReductions } = await supabase
        .from('mls_price_history')
        .select('*', { count: 'exact', head: true });

      const priceReductionRate = totalListings ? (priceReductions || 0) / totalListings : 0;

      // Get top MLS sources
      const { data: sourceData } = await supabase
        .from('mls_listings')
        .select('mls_source')
        .order('mls_source');

      const sourceCounts = sourceData?.reduce((acc, item) => {
        acc[item.mls_source] = (acc[item.mls_source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topMLSSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get listings by status
      const { data: statusData } = await supabase
        .from('mls_listings')
        .select('listing_status')
        .order('listing_status');

      const statusCounts = statusData?.reduce((acc, item) => {
        acc[item.listing_status] = (acc[item.listing_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const listingsByStatus = Object.entries(statusCounts)
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);

      return {
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        averageDaysOnMarket: Math.round(averageDaysOnMarket),
        averageListingPrice: Math.round(averageListingPrice),
        priceReductionRate: Math.round(priceReductionRate * 100),
        topMLSSources,
        listingsByStatus
      };
    } catch (error) {
      console.error('Error fetching MLS analytics:', error);
      throw error;
    }
  }

  // Cache invalidation methods
  async invalidateMLSListingCache(listingId: string): Promise<void> {
    redisCache.delete(CacheKeys.mlsListing(listingId));
  }

  async invalidateMLSSearchCache(): Promise<void> {
    const searchKeys = redisCache.keys('mls_search:*');
    searchKeys.forEach(key => redisCache.delete(key));
  }

  async invalidateMLSAnalyticsCache(): Promise<void> {
    redisCache.delete('mls_analytics');
  }

  async invalidateAllMLSCaches(): Promise<void> {
    const listingKeys = redisCache.keys('mls_listing:*');
    const searchKeys = redisCache.keys('mls_search:*');
    const analyticsKey = 'mls_analytics';

    [...listingKeys, ...searchKeys, analyticsKey].forEach(key => {
      redisCache.delete(key);
    });
  }

  // Get cache statistics for monitoring
  getCacheStats() {
    return redisCache.getStats();
  }
}

export const mlsService = MLSService.getInstance(); 