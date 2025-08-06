// State Revenue/Treasury Office Data Sources
// Based on Hitech BPO research on wealth patterns and taxation trends

export interface StateRevenueSource {
  state: string;
  stateCode: string;
  url: string;
  dataTypes: string[];
  wealthPatterns: boolean;
  incomeTaxRecords: boolean;
  propertyTaxRecords: boolean;
  estimatedProperties: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const stateRevenueSources: StateRevenueSource[] = [
  {
    state: 'California',
    stateCode: 'CA',
    url: 'https://treasurer.ca.gov/tax-records',
    dataTypes: ['property-tax-records', 'income-tax-records', 'wealth-patterns'],
    wealthPatterns: true,
    incomeTaxRecords: true,
    propertyTaxRecords: true,
    estimatedProperties: 25000,
    priority: 'HIGH'
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    url: 'https://comptroller.texas.gov/taxes/property-tax',
    dataTypes: ['property-tax-records', 'wealth-patterns'],
    wealthPatterns: true,
    incomeTaxRecords: false,
    propertyTaxRecords: true,
    estimatedProperties: 20000,
    priority: 'HIGH'
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    url: 'https://floridarevenue.com/property',
    dataTypes: ['property-tax-records', 'wealth-patterns'],
    wealthPatterns: true,
    incomeTaxRecords: false,
    propertyTaxRecords: true,
    estimatedProperties: 18000,
    priority: 'HIGH'
  },
  {
    state: 'New York',
    stateCode: 'NY',
    url: 'https://www.tax.ny.gov/property',
    dataTypes: ['property-tax-records', 'income-tax-records', 'wealth-patterns'],
    wealthPatterns: true,
    incomeTaxRecords: true,
    propertyTaxRecords: true,
    estimatedProperties: 22000,
    priority: 'HIGH'
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    url: 'https://www2.illinois.gov/rev/programs/realproperty',
    dataTypes: ['property-tax-records', 'wealth-patterns'],
    wealthPatterns: true,
    incomeTaxRecords: false,
    propertyTaxRecords: true,
    estimatedProperties: 15000,
    priority: 'HIGH'
  }
];

// IRS Tax Records Database (Mentioned in Hitech BPO article)
export const irsTaxRecordsSource = {
  name: 'IRS Tax Records Database',
  url: 'https://www.irs.gov/tax-records',
  description: 'Federal tax records for wealth pattern analysis',
  dataTypes: ['income-tax-records', 'wealth-patterns', 'demographics'],
  accessMethod: 'RESTRICTED_API',
  priority: 'HIGH',
  estimatedProperties: 50000
};

// Wealth Pattern Analysis Data
export const wealthPatternDataTypes = {
  PROPERTY_TAX_RECORDS: {
    description: 'Residential and commercial property tax records',
    databaseField: 'assessed_value',
    priority: 'HIGH'
  },
  INCOME_TAX_RECORDS: {
    description: 'Income tax records of individuals and companies',
    databaseField: 'owner_income_estimate',
    priority: 'MEDIUM'
  },
  WEALTH_PATTERNS: {
    description: 'Wealth patterns across US states and regions',
    databaseField: 'area_wealth_index',
    priority: 'HIGH'
  },
  BUDGET_DOCUMENTS: {
    description: 'Budget documents outlined for individual scope',
    databaseField: 'property_tax_rate',
    priority: 'MEDIUM'
  },
  HOME_BASED_INVESTMENTS: {
    description: 'Home-based investments among different classes of society',
    databaseField: 'investment_potential',
    priority: 'MEDIUM'
  }
}; 