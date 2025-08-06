import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fiftyStateDataIntegration } from '@/services/50-state-data-integration';

// Define the property type (adjust fields as needed)
export interface PropertyLead {
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
  last_updated: string;
}

// Mock data for immediate testing
const mockProperties: PropertyLead[] = [
  {
    id: "1",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    latitude: 40.7128,
    longitude: -74.0060,
    owner_name: "John Doe",
    owner_type: "individual",
    property_type: "residential",
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    lot_size: 5000,
    year_built: 1985,
    assessed_value: 350000,
    estimated_value: 400000,
    equity_percent: 75,
    mortgage_status: "active",
    lien_status: "none",
    tags: ["distressed", "vacant"],
    status: "active",
    last_updated: "2024-01-15"
  },
  {
    id: "2",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    latitude: 34.0522,
    longitude: -118.2437,
    owner_name: "Jane Smith",
    owner_type: "absentee",
    property_type: "residential",
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 2200,
    lot_size: 8000,
    year_built: 1990,
    assessed_value: 550000,
    estimated_value: 650000,
    equity_percent: 60,
    mortgage_status: "active",
    lien_status: "none",
    tags: ["high_equity"],
    status: "active",
    last_updated: "2024-01-10"
  },
  {
    id: "3",
    address: "789 Elm St",
    city: "Houston",
    state: "TX",
    zip: "77001",
    latitude: 29.7604,
    longitude: -95.3698,
    owner_name: "ABC Properties LLC",
    owner_type: "llc",
    property_type: "residential",
    bedrooms: 2,
    bathrooms: 1.5,
    square_feet: 1200,
    lot_size: 4000,
    year_built: 1975,
    assessed_value: 250000,
    estimated_value: 300000,
    equity_percent: 80,
    mortgage_status: "paid_off",
    lien_status: "none",
    tags: ["llc_owned"],
    status: "active",
    last_updated: "2024-01-12"
  },
  {
    id: "4",
    address: "321 Beach Blvd",
    city: "Miami",
    state: "FL",
    zip: "33139",
    latitude: 25.7617,
    longitude: -80.1918,
    owner_name: "Maria Rodriguez",
    owner_type: "absentee",
    property_type: "residential",
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 1800,
    lot_size: 6000,
    year_built: 1988,
    assessed_value: 450000,
    estimated_value: 550000,
    equity_percent: 70,
    mortgage_status: "active",
    lien_status: "none",
    tags: ["absentee"],
    status: "active",
    last_updated: "2024-01-13"
  },
  {
    id: "5",
    address: "654 Palm Dr",
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    latitude: 33.4484,
    longitude: -112.0740,
    owner_name: "Trust Properties Inc",
    owner_type: "corporation",
    property_type: "residential",
    bedrooms: 5,
    bathrooms: 3.5,
    square_feet: 2800,
    lot_size: 10000,
    year_built: 2000,
    assessed_value: 600000,
    estimated_value: 750000,
    equity_percent: 65,
    mortgage_status: "active",
    lien_status: "none",
    tags: ["high_value"],
    status: "active",
    last_updated: "2024-01-14"
  },
  {
    id: "5",
    address: "555 Tech Way",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    latitude: 37.7749,
    longitude: -122.4194,
    owner_name: "Tech Ventures LLC",
    owner_type: "llc",
    property_type: "residential",
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 1200,
    lot_size: 3000,
    year_built: 1920,
    assessed_value: 800000,
    estimated_value: 950000,
    equity_percent: 85,
    mortgage_status: "paid_off",
    lien_status: "none",
    tags: ["tech_area", "high_value"],
    status: "active",
    last_updated: "2024-01-08"
  },
  {
    id: "6",
    address: "777 Downtown Ave",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    latitude: 41.8781,
    longitude: -87.6298,
    owner_name: "Downtown Properties Inc",
    owner_type: "corporate",
    property_type: "residential",
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 800,
    lot_size: 2000,
    year_built: 1965,
    assessed_value: 200000,
    estimated_value: 250000,
    equity_percent: 60,
    mortgage_status: "active",
    lien_status: "none",
    tags: ["downtown", "small_unit"],
    status: "active",
    last_updated: "2024-01-05"
  }
];

// Test function to check Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Supabase Key length:', supabase.supabaseKey?.length || 0);
    
    const { data, error } = await supabase.from('properties').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// Enhanced hook: supports optional filters for dynamic queries
export function usePropertyLeads(filters?: Partial<PropertyLead> & { _supabaseFilter?: string }) {
  console.log('usePropertyLeads: Hook called with filters:', filters);
  
  return useQuery<PropertyLead[], Error>({
    queryKey: ['property-leads', filters],
    queryFn: async () => {
      console.log('usePropertyLeads: Querying Supabase database');
      console.log('usePropertyLeads: Applied filters:', filters);
      
      // Test connection first
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest) {
        console.warn('usePropertyLeads: Connection test failed, returning mock data');
        return mockProperties;
      }
      
      try {
        // Try to get data from 50-state integration first
        console.log('usePropertyLeads: Attempting to get data from 50-state integration...');
        
        try {
          const integrationData = await fiftyStateDataIntegration.searchProperties(filters || {});
          
          if (integrationData && integrationData.properties && integrationData.properties.length > 0) {
            console.log(`usePropertyLeads: Retrieved ${integrationData.properties.length} properties from 50-state integration`);
            
            // Filter properties with coordinates
            const propertiesWithCoordinates = integrationData.properties.filter(prop => prop.latitude && prop.longitude);
            const propertiesWithoutCoordinates = integrationData.properties.filter(prop => !prop.latitude || !prop.longitude);
            
            if (propertiesWithoutCoordinates.length > 0) {
              console.warn('usePropertyLeads: 50-state integration returned properties without coordinates:', propertiesWithoutCoordinates);
            }
            
            if (propertiesWithCoordinates.length > 0) {
              console.log(`usePropertyLeads: Returning ${propertiesWithCoordinates.length} properties with coordinates from 50-state integration`);
              return propertiesWithCoordinates as PropertyLead[];
            } else {
              console.warn('usePropertyLeads: No properties with coordinates from 50-state integration, falling back to database');
            }
          }
        } catch (integrationError) {
          console.warn('usePropertyLeads: 50-state integration not available, falling back to database:', integrationError);
        }
        
        // Fallback to database query
        let query = supabase.from('properties').select('*').order('last_updated', { ascending: false });

        // Advanced filter: use _supabaseFilter string if present
        if (filters && typeof filters._supabaseFilter === 'string' && filters._supabaseFilter.length > 0) {
          console.log('usePropertyLeads: Using advanced filter:', filters._supabaseFilter);
          // Use .or() for top-level OR, .and() for AND, or raw filter string
          // Heuristic: if filter string starts with 'or(', use .or(), else .and()
          if (filters._supabaseFilter.startsWith('or(')) {
            query = query.or(filters._supabaseFilter.slice(3, -1)); // Remove 'or(' and trailing ')'
          } else if (filters._supabaseFilter.startsWith('and(')) {
            query = query.and(filters._supabaseFilter.slice(4, -1)); // Remove 'and(' and trailing ')'
          } else {
            // Fallback: try .or()
            query = query.or(filters._supabaseFilter);
          }
        } else if (filters) {
          // Enhanced: apply filters with flexible matching
          Object.entries(filters).forEach(([key, value]) => {
            if (key === '_supabaseFilter') return;
            if (value !== undefined && value !== null && value !== "") {
              console.log(`usePropertyLeads: Applying filter ${key} = ${value}`);
              
              // Handle searchText specially - search across multiple fields
              if (key === 'searchText') {
                console.log(`usePropertyLeads: Applying searchText filter "${value}" across multiple fields`);
                query = query.or(`address.ilike.%${value}%,city.ilike.%${value}%,state.ilike.%${value}%,owner_name.ilike.%${value}%`);
              }
              // Use case-insensitive partial matching for text fields
              else if (['city', 'state', 'address', 'owner_name'].includes(key)) {
                console.log(`usePropertyLeads: Using ILIKE for ${key} with value "${value}"`);
                query = query.ilike(key, `%${value}%`);
              } else {
                console.log(`usePropertyLeads: Using EQ for ${key} with value "${value}"`);
                // Use exact matching for other fields
                query = query.eq(key, value);
              }
            }
          });
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('usePropertyLeads: Database error:', error);
          console.warn('usePropertyLeads: Falling back to mock data due to database error');
          return mockProperties;
        }
        
        console.log(`usePropertyLeads: Retrieved ${data?.length || 0} properties from database`);
        
        // If no data from database, return mock data
        if (!data || data.length === 0) {
          console.warn('usePropertyLeads: No data from database, returning mock data');
          return mockProperties;
        }
        
        // Filter out properties without coordinates and log them
        const propertiesWithCoordinates = data.filter(prop => prop.latitude && prop.longitude);
        const propertiesWithoutCoordinates = data.filter(prop => !prop.latitude || !prop.longitude);
        
        if (propertiesWithoutCoordinates.length > 0) {
          console.warn('usePropertyLeads: Found properties without coordinates:', propertiesWithoutCoordinates);
        }
        
        if (propertiesWithCoordinates.length === 0) {
          console.warn('usePropertyLeads: No properties with coordinates, returning mock data');
          return mockProperties;
        }
        
        console.log(`usePropertyLeads: Returning ${propertiesWithCoordinates.length} properties with coordinates`);
        return propertiesWithCoordinates as PropertyLead[];
        
      } catch (error) {
        console.error('usePropertyLeads: Unexpected error:', error);
        console.warn('usePropertyLeads: Falling back to mock data due to unexpected error');
        return mockProperties;
      }
    },
    staleTime: 60000, // 1 minute
  });
} 