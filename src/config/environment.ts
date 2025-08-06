// Environment Configuration
// This file provides environment variables with fallbacks for development

export const environment = {
  // Mapbox Configuration
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1Ijoicm9kenJqIiwiYSI6ImNtZGZibGtvdjBjMHIybG85aTlyYWExNncifQ.EUrooIX34z2SPRrR1WvnAQ',
  
  // Supabase Configuration (already configured in client.ts)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://dkxqmiamrnphjoaznpuo.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreHFtaWFtcm5waGpvYXpucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDQyNTksImV4cCI6MjA2NzA4MDI1OX0.wEGR3XgRlkwt_OKuOm-WS67t-KXreylDQoB3VZmoj-8',
  
  // Development Configuration
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Feature Flags
  ENABLE_MAPBOX: import.meta.env.VITE_ENABLE_MAPBOX !== 'false',
  ENABLE_SUPABASE: import.meta.env.VITE_ENABLE_SUPABASE !== 'false',
  
  // API Endpoints
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // Performance Configuration
  CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION || '60000'), // 1 minute
  MAX_RESULTS: parseInt(import.meta.env.VITE_MAX_RESULTS || '1000'),
  
  // Map Configuration
  DEFAULT_MAP_CENTER: {
    lng: parseFloat(import.meta.env.VITE_DEFAULT_MAP_LNG || '-98.5795'),
    lat: parseFloat(import.meta.env.VITE_DEFAULT_MAP_LAT || '39.8283')
  },
  DEFAULT_MAP_ZOOM: parseInt(import.meta.env.VITE_DEFAULT_MAP_ZOOM || '4'),
  
  // Search Configuration
  MIN_SEARCH_LENGTH: parseInt(import.meta.env.VITE_MIN_SEARCH_LENGTH || '2'),
  MAX_SUGGESTIONS: parseInt(import.meta.env.VITE_MAX_SUGGESTIONS || '8'),
  
  // UI Configuration
  ANIMATION_DURATION: parseInt(import.meta.env.VITE_ANIMATION_DURATION || '200'),
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY || '300'),
  
  // Error Handling
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  RETRY_DELAY: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000'),
};

// Helper functions
export const isDevelopment = environment.APP_ENV === 'development';
export const isProduction = environment.APP_ENV === 'production';

export const hasValidMapboxToken = () => {
  const token = environment.MAPBOX_TOKEN;
  console.log('Token validation check:', { token, length: token?.length });
  return token && token.length > 0;
};

export const getMapboxToken = () => {
  if (!hasValidMapboxToken()) {
    console.warn('Mapbox token not configured. Please set VITE_MAPBOX_TOKEN in your environment variables.');
    return null;
  }
  return environment.MAPBOX_TOKEN;
};

export const logEnvironment = () => {
  if (isDevelopment) {
    console.log('Environment Configuration:', {
      APP_ENV: environment.APP_ENV,
      DEBUG_MODE: environment.DEBUG_MODE,
      ENABLE_MAPBOX: environment.ENABLE_MAPBOX,
      ENABLE_SUPABASE: environment.ENABLE_SUPABASE,
      HAS_MAPBOX_TOKEN: hasValidMapboxToken(),
      API_BASE_URL: environment.API_BASE_URL,
    });
  }
};

// Initialize logging in development
if (isDevelopment) {
  logEnvironment();
}

// 50-State Data Integration Configuration
export interface EnvironmentConfig {
  // Mapbox API for geocoding
  MAPBOX_API_KEY: string;
  
  // Supabase configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
          // Optional: Additional API keys for enhanced data sources
        CENSUS_API_KEY?: string;
        FEMA_API_KEY?: string;
        ATTOM_API_KEY?: string;
        CORELOGIC_API_KEY?: string;
        COUNTY_ASSESSOR_API_KEY?: string;
        // MLS API keys for Phase 2C
        RENTSPREE_API_KEY?: string;
        RENTDATA_API_KEY?: string;
        MLSGRID_API_KEY?: string;
        RETSLY_API_KEY?: string;
        REALTYMOLE_API_KEY?: string;
  
  // Scraping configuration
  MAX_CONCURRENT_BROWSERS: number;
  REQUEST_DELAY_MS: number;
  MAX_RETRIES: number;
  
  // Data processing configuration
  BATCH_SIZE: number;
  GEOCODING_RATE_LIMIT: number;
}

// Default configuration values for 50-state integration
const defaultConfig: EnvironmentConfig = {
  MAPBOX_API_KEY: import.meta.env.VITE_MAPBOX_API_KEY || environment.MAPBOX_TOKEN,
  SUPABASE_URL: environment.SUPABASE_URL,
  SUPABASE_ANON_KEY: environment.SUPABASE_ANON_KEY,
          CENSUS_API_KEY: import.meta.env.VITE_CENSUS_API_KEY || '',
        FEMA_API_KEY: import.meta.env.VITE_FEMA_API_KEY || '',
        ATTOM_API_KEY: import.meta.env.VITE_ATTOM_API_KEY || '',
        CORELOGIC_API_KEY: import.meta.env.VITE_CORELOGIC_API_KEY || '',
        COUNTY_ASSESSOR_API_KEY: import.meta.env.VITE_COUNTY_ASSESSOR_API_KEY || '',
        // MLS API keys for Phase 2C
        RENTSPREE_API_KEY: import.meta.env.VITE_RENTSPREE_API_KEY || '',
        RENTDATA_API_KEY: import.meta.env.VITE_RENTDATA_API_KEY || '',
        MLSGRID_API_KEY: import.meta.env.VITE_MLSGRID_API_KEY || '',
        RETSLY_API_KEY: import.meta.env.VITE_RETSLY_API_KEY || '',
        REALTYMOLE_API_KEY: import.meta.env.VITE_REALTYMOLE_API_KEY || '',
  MAX_CONCURRENT_BROWSERS: 5,
  REQUEST_DELAY_MS: 1000,
  MAX_RETRIES: 3,
  BATCH_SIZE: 100,
  GEOCODING_RATE_LIMIT: 600 // requests per minute
};

// Environment validation for 50-state integration
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!defaultConfig.MAPBOX_API_KEY) {
    errors.push('MAPBOX_API_KEY is required for geocoding functionality');
  }
  
  if (!defaultConfig.SUPABASE_URL || !defaultConfig.SUPABASE_ANON_KEY) {
    errors.push('Supabase configuration is required for data storage');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get configuration with validation for 50-state integration
export function getEnvironmentConfig(): EnvironmentConfig {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.warn('Environment configuration issues:', validation.errors);
  }
  
  return defaultConfig;
}

// Helper function to check if a specific feature is available
export function isFeatureAvailable(feature: keyof EnvironmentConfig): boolean {
  const config = getEnvironmentConfig();
  
  switch (feature) {
    case 'MAPBOX_API_KEY':
      return !!config.MAPBOX_API_KEY;
    case 'CENSUS_API_KEY':
      return !!config.CENSUS_API_KEY;
    case 'FEMA_API_KEY':
      return !!config.FEMA_API_KEY;
    case 'ATTOM_API_KEY':
      return !!config.ATTOM_API_KEY;
            case 'CORELOGIC_API_KEY':
          return !!config.CORELOGIC_API_KEY;
        case 'COUNTY_ASSESSOR_API_KEY':
          return !!config.COUNTY_ASSESSOR_API_KEY;
        // MLS API key checks for Phase 2C
        case 'RENTSPREE_API_KEY':
          return !!config.RENTSPREE_API_KEY;
        case 'RENTDATA_API_KEY':
          return !!config.RENTDATA_API_KEY;
        case 'MLSGRID_API_KEY':
          return !!config.MLSGRID_API_KEY;
        case 'RETSLY_API_KEY':
          return !!config.RETSLY_API_KEY;
        case 'REALTYMOLE_API_KEY':
          return !!config.REALTYMOLE_API_KEY;
    default:
      return true;
  }
}

export default getEnvironmentConfig; 