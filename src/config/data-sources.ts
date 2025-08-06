// Real Data Source Configuration
// This file defines all the real data sources we integrate with

export interface DataSourceConfig {
  id: string;
  name: string;
  category: 'property' | 'mls' | 'county' | 'federal' | 'commercial';
  apiEndpoint: string;
  apiKeyRequired: boolean;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  coverage: {
    states: string[];
    counties?: string[];
    propertyTypes: string[];
  };
  dataQuality: {
    accuracy: number; // 0-1
    completeness: number; // 0-1
    freshness: number; // 0-1 (how recent the data is)
  };
  cost: {
    setupFee: number;
    monthlyFee: number;
    perRequestFee: number;
  };
  features: string[];
  status: 'active' | 'inactive' | 'testing';
}

// Real Data Sources Configuration
export const REAL_DATA_SOURCES: DataSourceConfig[] = [
  // ATTOM Data API - High Quality Property Data
  {
    id: 'attom',
    name: 'ATTOM Data API',
    category: 'property',
    apiEndpoint: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0',
    apiKeyRequired: true,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerHour: 500,
      requestsPerDay: 5000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['residential', 'commercial', 'land']
    },
    dataQuality: {
      accuracy: 0.95,
      completeness: 0.90,
      freshness: 0.85
    },
    cost: {
      setupFee: 0,
      monthlyFee: 500,
      perRequestFee: 0.01
    },
    features: [
      'property_details',
      'owner_information',
      'sales_history',
      'tax_assessments',
      'mortgage_data',
      'property_characteristics'
    ],
    status: 'active'
  },

  // CoreLogic Data API - Investment Property Data
  {
    id: 'corelogic',
    name: 'CoreLogic Data API',
    category: 'property',
    apiEndpoint: 'https://api.corelogic.com/v1',
    apiKeyRequired: true,
    rateLimit: {
      requestsPerMinute: 15,
      requestsPerHour: 800,
      requestsPerDay: 10000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['residential', 'commercial']
    },
    dataQuality: {
      accuracy: 0.92,
      completeness: 0.88,
      freshness: 0.90
    },
    cost: {
      setupFee: 1000,
      monthlyFee: 750,
      perRequestFee: 0.015
    },
    features: [
      'property_details',
      'investment_analytics',
      'market_trends',
      'risk_assessment',
      'comparable_sales',
      'rental_data'
    ],
    status: 'active'
  },

  // RentSpree API - Rental Property Data
  {
    id: 'rentspree',
    name: 'RentSpree API',
    category: 'mls',
    apiEndpoint: 'https://api.rentspree.com/v1',
    apiKeyRequired: true,
    rateLimit: {
      requestsPerMinute: 20,
      requestsPerHour: 1000,
      requestsPerDay: 15000
    },
    coverage: {
      states: ['AZ', 'TX', 'FL', 'CA', 'NY', 'GA', 'NC', 'SC'],
      propertyTypes: ['residential']
    },
    dataQuality: {
      accuracy: 0.88,
      completeness: 0.85,
      freshness: 0.92
    },
    cost: {
      setupFee: 0,
      monthlyFee: 300,
      perRequestFee: 0.005
    },
    features: [
      'rental_listings',
      'tenant_screening',
      'rental_analytics',
      'market_rents',
      'vacancy_rates'
    ],
    status: 'active'
  },

  // RealtyMole API - Market Property Data
  {
    id: 'realtymole',
    name: 'RealtyMole Property API',
    category: 'property',
    apiEndpoint: 'https://realty-mole-property-api.p.rapidapi.com',
    apiKeyRequired: true,
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerHour: 1500,
      requestsPerDay: 20000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['residential', 'commercial']
    },
    dataQuality: {
      accuracy: 0.90,
      completeness: 0.82,
      freshness: 0.88
    },
    cost: {
      setupFee: 0,
      monthlyFee: 200,
      perRequestFee: 0.008
    },
    features: [
      'property_details',
      'rental_estimates',
      'market_analysis',
      'property_photos',
      'neighborhood_data'
    ],
    status: 'active'
  },

  // MLS Grid API - MLS Listings
  {
    id: 'mlsgrid',
    name: 'MLS Grid API',
    category: 'mls',
    apiEndpoint: 'https://api.mlsgrid.com/v2',
    apiKeyRequired: true,
    rateLimit: {
      requestsPerMinute: 25,
      requestsPerHour: 1200,
      requestsPerDay: 18000
    },
    coverage: {
      states: ['AZ', 'TX', 'FL', 'CA', 'NY', 'GA', 'NV', 'CO'],
      propertyTypes: ['residential', 'commercial']
    },
    dataQuality: {
      accuracy: 0.95,
      completeness: 0.92,
      freshness: 0.95
    },
    cost: {
      setupFee: 500,
      monthlyFee: 400,
      perRequestFee: 0.012
    },
    features: [
      'mls_listings',
      'listing_history',
      'agent_data',
      'open_houses',
      'property_photos',
      'virtual_tours'
    ],
    status: 'active'
  },

  // County Assessor APIs - Tax Data
  {
    id: 'county_assessor',
    name: 'County Assessor APIs',
    category: 'county',
    apiEndpoint: 'https://api.countyassessor.com/v1',
    apiKeyRequired: false,
    rateLimit: {
      requestsPerMinute: 5,
      requestsPerHour: 200,
      requestsPerDay: 3000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['residential', 'commercial', 'land']
    },
    dataQuality: {
      accuracy: 0.98,
      completeness: 0.95,
      freshness: 0.70
    },
    cost: {
      setupFee: 0,
      monthlyFee: 0,
      perRequestFee: 0
    },
    features: [
      'tax_assessments',
      'tax_delinquent_properties',
      'exemptions',
      'property_characteristics',
      'ownership_history'
    ],
    status: 'active'
  },

  // US Census Bureau API - Demographic Data
  {
    id: 'census',
    name: 'US Census Bureau API',
    category: 'federal',
    apiEndpoint: 'https://api.census.gov/data',
    apiKeyRequired: false,
    rateLimit: {
      requestsPerMinute: 50,
      requestsPerHour: 5000,
      requestsPerDay: 100000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['all']
    },
    dataQuality: {
      accuracy: 0.99,
      completeness: 0.98,
      freshness: 0.60
    },
    cost: {
      setupFee: 0,
      monthlyFee: 0,
      perRequestFee: 0
    },
    features: [
      'demographics',
      'population_data',
      'housing_data',
      'income_data',
      'education_data'
    ],
    status: 'active'
  },

  // FEMA API - Flood Zone Data
  {
    id: 'fema',
    name: 'FEMA API',
    category: 'federal',
    apiEndpoint: 'https://hazards.fema.gov/gis/nfhl/rest/services/public',
    apiKeyRequired: false,
    rateLimit: {
      requestsPerMinute: 20,
      requestsPerHour: 1000,
      requestsPerDay: 15000
    },
    coverage: {
      states: ['all'],
      propertyTypes: ['all']
    },
    dataQuality: {
      accuracy: 0.95,
      completeness: 0.90,
      freshness: 0.80
    },
    cost: {
      setupFee: 0,
      monthlyFee: 0,
      perRequestFee: 0
    },
    features: [
      'flood_zones',
      'risk_assessment',
      'flood_insurance_data',
      'historical_flood_data'
    ],
    status: 'active'
  }
];

// Helper functions for data source management
export function getDataSourceById(id: string): DataSourceConfig | undefined {
  return REAL_DATA_SOURCES.find(source => source.id === id);
}

export function getActiveDataSources(): DataSourceConfig[] {
  return REAL_DATA_SOURCES.filter(source => source.status === 'active');
}

export function getDataSourcesByCategory(category: string): DataSourceConfig[] {
  return REAL_DATA_SOURCES.filter(source => source.category === category);
}

export function getDataSourcesByState(state: string): DataSourceConfig[] {
  return REAL_DATA_SOURCES.filter(source => 
    source.coverage.states.includes('all') || source.coverage.states.includes(state)
  );
}

export function calculateDataSourceScore(source: DataSourceConfig): number {
  const { accuracy, completeness, freshness } = source.dataQuality;
  return (accuracy + completeness + freshness) / 3;
}

export function getTopDataSources(limit: number = 5): DataSourceConfig[] {
  return REAL_DATA_SOURCES
    .filter(source => source.status === 'active')
    .sort((a, b) => calculateDataSourceScore(b) - calculateDataSourceScore(a))
    .slice(0, limit);
}

// Cost analysis functions
export function calculateMonthlyCost(source: DataSourceConfig): number {
  return source.cost.monthlyFee + (source.cost.perRequestFee * 1000); // Assuming 1000 requests/month
}

export function getTotalMonthlyCost(): number {
  return REAL_DATA_SOURCES
    .filter(source => source.status === 'active')
    .reduce((total, source) => total + calculateMonthlyCost(source), 0);
}

// Data quality analysis
export function getAverageDataQuality(): number {
  const activeSources = REAL_DATA_SOURCES.filter(source => source.status === 'active');
  const totalScore = activeSources.reduce((sum, source) => sum + calculateDataSourceScore(source), 0);
  return totalScore / activeSources.length;
}

// Export default configuration
export default REAL_DATA_SOURCES; 