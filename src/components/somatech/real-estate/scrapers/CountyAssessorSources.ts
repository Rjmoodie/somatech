// County Assessor Data Sources - Based on Hitech BPO Research
// These are the most critical sources for real estate data collection

export interface CountyAssessorSource {
  county: string;
  state: string;
  stateCode: string;
  url: string;
  dataTypes: string[];
  updateFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  accessMethod: 'API' | 'SCRAPER' | 'CSV_DOWNLOAD';
  estimatedProperties: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const countyAssessorSources: CountyAssessorSource[] = [
  // California Counties (HIGHEST PRIORITY)
  {
    county: 'Los Angeles',
    state: 'California',
    stateCode: 'CA',
    url: 'https://assessor.lacounty.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment', 'ownership-records'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 15000,
    priority: 'HIGH'
  },
  {
    county: 'Orange',
    state: 'California',
    stateCode: 'CA',
    url: 'https://assessor.orangecounty.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 8000,
    priority: 'HIGH'
  },
  {
    county: 'San Diego',
    state: 'California',
    stateCode: 'CA',
    url: 'https://assessor.sandiego.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 7000,
    priority: 'HIGH'
  },

  // Texas Counties
  {
    county: 'Harris',
    state: 'Texas',
    stateCode: 'TX',
    url: 'https://www.hcad.org/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 12000,
    priority: 'HIGH'
  },
  {
    county: 'Dallas',
    state: 'Texas',
    stateCode: 'TX',
    url: 'https://assessor.dallascounty.org/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 9000,
    priority: 'HIGH'
  },

  // Florida Counties
  {
    county: 'Miami-Dade',
    state: 'Florida',
    stateCode: 'FL',
    url: 'https://assessor.miamidade.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 10000,
    priority: 'HIGH'
  },
  {
    county: 'Broward',
    state: 'Florida',
    stateCode: 'FL',
    url: 'https://assessor.broward.org/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 8000,
    priority: 'HIGH'
  },

  // New York Counties
  {
    county: 'New York City',
    state: 'New York',
    stateCode: 'NY',
    url: 'https://assessor.nyc.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 20000,
    priority: 'HIGH'
  },
  {
    county: 'Nassau',
    state: 'New York',
    stateCode: 'NY',
    url: 'https://assessor.nassaucounty.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 6000,
    priority: 'HIGH'
  },

  // Illinois Counties
  {
    county: 'Cook',
    state: 'Illinois',
    stateCode: 'IL',
    url: 'https://assessor.cookcounty.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 18000,
    priority: 'HIGH'
  },
  {
    county: 'DuPage',
    state: 'Illinois',
    stateCode: 'IL',
    url: 'https://assessor.dupagecounty.gov/tax-delinquent',
    dataTypes: ['tax-delinquent', 'property-assessment'],
    updateFrequency: 'WEEKLY',
    accessMethod: 'SCRAPER',
    estimatedProperties: 4000,
    priority: 'MEDIUM'
  }
];

// Data Types Available from County Assessors
export const countyAssessorDataTypes = {
  TAX_DELINQUENT: {
    description: 'Properties with unpaid taxes',
    databaseField: 'lien_status',
    value: 'Tax Lien',
    priority: 'HIGH'
  },
  PROPERTY_ASSESSMENT: {
    description: 'Current property valuations',
    databaseField: 'assessed_value',
    priority: 'HIGH'
  },
  OWNERSHIP_RECORDS: {
    description: 'Property owner information',
    databaseField: 'owner_name',
    priority: 'HIGH'
  },
  PROPERTY_DETAILS: {
    description: 'Property characteristics',
    databaseFields: ['bedrooms', 'bathrooms', 'square_feet', 'year_built'],
    priority: 'MEDIUM'
  },
  LAND_USE: {
    description: 'Zoning and land use information',
    databaseField: 'property_type',
    priority: 'MEDIUM'
  }
};

// Challenges Identified by Hitech BPO
export const countyAssessorChallenges = {
  SECURITY_RESTRICTIONS: {
    description: 'Captcha codes and access limitations',
    solution: 'Implement rotating IP addresses and user agents',
    priority: 'HIGH'
  },
  GEOGRAPHICAL_RESTRICTIONS: {
    description: 'VPN access required for foreign IPs',
    solution: 'Use US-based proxy servers',
    priority: 'HIGH'
  },
  TIME_ZONE_RESTRICTIONS: {
    description: 'Access limited to specific time zones',
    solution: 'Schedule scraping during allowed hours',
    priority: 'MEDIUM'
  },
  UNTIMELY_UPDATES: {
    description: 'Inconsistent update schedules',
    solution: 'Implement adaptive update detection',
    priority: 'MEDIUM'
  },
  CONTENT_MINING_COMPLICATIONS: {
    description: 'Watermarks and copyright protection',
    solution: 'Advanced OCR and text extraction',
    priority: 'LOW'
  }
}; 