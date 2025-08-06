// Census Bureau & American Housing Survey (AHS) Data Sources
// Based on Hitech BPO research on comprehensive housing information

export interface CensusDataSource {
  name: string;
  url: string;
  dataTypes: string[];
  updateFrequency: 'YEARLY' | 'BIENNIAL' | 'QUARTERLY';
  accessMethod: 'API' | 'CSV_DOWNLOAD' | 'WEB_SCRAPER';
  estimatedProperties: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const censusDataSources: CensusDataSource[] = [
  {
    name: 'American Housing Survey (AHS)',
    url: 'https://www.census.gov/programs-surveys/ahs.html',
    dataTypes: [
      'housing-facilities',
      'physical-condition',
      'home-improvement-trends',
      'pest-infestation',
      'pandemic-resilience',
      'fuel-usage-comparison'
    ],
    updateFrequency: 'BIENNIAL',
    accessMethod: 'API',
    estimatedProperties: 100000,
    priority: 'HIGH'
  },
  {
    name: 'US Census Bureau - Housing Data',
    url: 'https://www.census.gov/topics/housing.html',
    dataTypes: [
      'population-specs-per-location',
      'comprehensive-housing-information',
      'demographics',
      'economic-outlook'
    ],
    updateFrequency: 'YEARLY',
    accessMethod: 'API',
    estimatedProperties: 150000,
    priority: 'HIGH'
  },
  {
    name: 'Census Bureau - Population Data',
    url: 'https://www.census.gov/data.html',
    dataTypes: [
      'population-density',
      'age-distribution',
      'income-levels',
      'education-levels',
      'employment-data'
    ],
    updateFrequency: 'YEARLY',
    accessMethod: 'API',
    estimatedProperties: 200000,
    priority: 'HIGH'
  }
];

// Office for National Statistics (UK) - Mentioned in Hitech BPO article
export const ukStatisticsSource = {
  name: 'Office for National Statistics',
  url: 'https://www.ons.gov.uk',
  description: 'UK economy, society, population, living standards, property, planning',
  dataTypes: [
    'uk-economy-data',
    'society-statistics',
    'population-data',
    'living-standards',
    'property-data',
    'planning-data'
  ],
  accessMethod: 'API',
  priority: 'MEDIUM',
  estimatedProperties: 50000
};

// Census Data Types for Real Estate Analysis
export const censusDataTypes = {
  HOUSING_FACILITIES: {
    description: 'Housing facilities and amenities',
    databaseField: 'amenities',
    priority: 'HIGH'
  },
  PHYSICAL_CONDITION: {
    description: 'Physical condition of apartments and homes',
    databaseField: 'property_condition',
    priority: 'HIGH'
  },
  HOME_IMPROVEMENT_TRENDS: {
    description: 'Home improvement and renovation trends',
    databaseField: 'renovation_potential',
    priority: 'MEDIUM'
  },
  PEST_INFESTATION: {
    description: 'Properties with pest issues in a location',
    databaseField: 'pest_issues',
    priority: 'MEDIUM'
  },
  PANDEMIC_RESILIENCE: {
    description: 'Resilience during pandemics',
    databaseField: 'pandemic_resilience',
    priority: 'LOW'
  },
  FUEL_USAGE_COMPARISON: {
    description: 'Differences in fuel usage for comparison',
    databaseField: 'energy_efficiency',
    priority: 'MEDIUM'
  },
  POPULATION_DENSITY: {
    description: 'Population density per location',
    databaseField: 'area_population_density',
    priority: 'HIGH'
  },
  AGE_DISTRIBUTION: {
    description: 'Age distribution in areas',
    databaseField: 'area_age_distribution',
    priority: 'MEDIUM'
  },
  INCOME_LEVELS: {
    description: 'Income levels by area',
    databaseField: 'area_income_level',
    priority: 'HIGH'
  },
  EDUCATION_LEVELS: {
    description: 'Education levels by area',
    databaseField: 'area_education_level',
    priority: 'MEDIUM'
  },
  EMPLOYMENT_DATA: {
    description: 'Employment data by area',
    databaseField: 'area_employment_rate',
    priority: 'MEDIUM'
  }
};

// Census API Configuration
export const censusAPIConfig = {
  baseUrl: 'https://api.census.gov/data',
  datasets: {
    housing: 'ahs',
    population: 'dec/pl',
    economic: 'acs/acs5',
    demographic: 'acs/acs5/profile'
  },
  apiKey: process.env.CENSUS_API_KEY || 'your-census-api-key',
  rateLimit: 500, // requests per hour
  timeout: 30000
}; 