// Free Data Sources - High Value, No Cost
// These sources can be implemented immediately without any API costs

export interface FreeDataSource {
  id: string;
  name: string;
  category: string;
  url: string;
  method: 'scraper' | 'api' | 'csv';
  dataType: string;
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  implementation: 'IMMEDIATE' | 'PHASE_2' | 'PHASE_3';
  description: string;
  selectors?: {
    tableSelector?: string;
    rowSelector?: string;
    ownerSelector?: string;
    addressSelector?: string;
    amountSelector?: string;
    dateSelector?: string;
    statusSelector?: string;
  };
  apiConfig?: {
    endpoint: string;
    parameters?: Record<string, string>;
    headers?: Record<string, string>;
  };
}

export const freeDataSources: FreeDataSource[] = [
  // ===== TIER 1: TAX DELINQUENT PROPERTIES =====
  {
    id: "tax-delinquent-los-angeles",
    name: "Los Angeles County Tax Assessor",
    category: "Tax Delinquent",
    url: "https://assessor.lacounty.gov/tax-delinquent",
    method: "scraper",
    dataType: "tax-delinquent",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Los Angeles County tax delinquent properties",
    selectors: {
      tableSelector: ".tax-delinquent-table",
      rowSelector: "tr",
      ownerSelector: ".owner-name",
      addressSelector: ".property-address",
      amountSelector: ".tax-amount",
      dateSelector: ".delinquent-year"
    }
  },
  {
    id: "tax-delinquent-harris",
    name: "Harris County Tax Assessor",
    category: "Tax Delinquent", 
    url: "https://www.hcad.org/tax-delinquent",
    method: "scraper",
    dataType: "tax-delinquent",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Harris County tax delinquent properties",
    selectors: {
      tableSelector: ".delinquent-properties",
      rowSelector: ".property-row",
      ownerSelector: ".owner",
      addressSelector: ".address",
      amountSelector: ".amount",
      dateSelector: ".year"
    }
  },
  {
    id: "tax-delinquent-maricopa",
    name: "Maricopa County Assessor",
    category: "Tax Delinquent",
    url: "https://assessor.maricopa.gov/tax-delinquent",
    method: "scraper",
    dataType: "tax-delinquent",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Maricopa County tax delinquent properties",
    selectors: {
      tableSelector: ".tax-delinquent-list",
      rowSelector: ".property-item",
      ownerSelector: ".owner",
      addressSelector: ".address",
      amountSelector: ".amount",
      dateSelector: ".year"
    }
  },

  // ===== TIER 1: CODE VIOLATION PROPERTIES =====
  {
    id: "code-violations-chicago",
    name: "Chicago Data Portal",
    category: "Code Violations",
    url: "https://data.cityofchicago.org/code-violations",
    method: "api",
    dataType: "code-violations",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Chicago code violation properties via open data API",
    apiConfig: {
      endpoint: "https://data.cityofchicago.org/resource/code-violations.json",
      parameters: {
        "$limit": "1000",
        "$order": "violation_date DESC"
      }
    }
  },
  {
    id: "code-violations-newyork",
    name: "NYC Department of Buildings",
    category: "Code Violations",
    url: "https://data.cityofnewyork.us/code-violations",
    method: "api",
    dataType: "code-violations",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "NYC code violation properties via open data API",
    apiConfig: {
      endpoint: "https://data.cityofnewyork.us/resource/code-violations.json",
      parameters: {
        "$limit": "1000",
        "$order": "violation_date DESC"
      }
    }
  },
  {
    id: "code-violations-los-angeles",
    name: "Los Angeles Building & Safety",
    category: "Code Violations",
    url: "https://www.ladbsservices2.lacity.org/",
    method: "scraper",
    dataType: "code-violations",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Los Angeles code violation properties",
    selectors: {
      tableSelector: ".violations-table",
      rowSelector: "tr",
      ownerSelector: ".owner-name",
      addressSelector: ".property-address",
      violationSelector: ".violation-type",
      fineSelector: ".fine-amount",
      dateSelector: ".violation-date",
      statusSelector: ".status"
    }
  },

  // ===== TIER 1: PRE-FORECLOSURES =====
  {
    id: "pre-foreclosure-broward",
    name: "Broward County Clerk",
    category: "Pre-Foreclosures",
    url: "https://www.browardclerk.org/foreclosures",
    method: "scraper",
    dataType: "pre-foreclosures",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Broward County pre-foreclosure properties",
    selectors: {
      tableSelector: ".foreclosure-table",
      rowSelector: "tr",
      ownerSelector: ".owner-name",
      addressSelector: ".property-address",
      lenderSelector: ".lender-name",
      amountSelector: ".loan-amount",
      dateSelector: ".filing-date",
      caseSelector: ".case-number"
    }
  },
  {
    id: "pre-foreclosure-miami-dade",
    name: "Miami-Dade Clerk",
    category: "Pre-Foreclosures",
    url: "https://www.miami-dadeclerk.com/foreclosures",
    method: "scraper",
    dataType: "pre-foreclosures",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Miami-Dade pre-foreclosure properties",
    selectors: {
      tableSelector: ".foreclosure-cases",
      rowSelector: ".case-row",
      ownerSelector: ".defendant",
      addressSelector: ".property",
      lenderSelector: ".plaintiff",
      amountSelector: ".amount",
      dateSelector: ".date",
      caseSelector: ".case"
    }
  },
  {
    id: "pre-foreclosure-harris",
    name: "Harris County Clerk",
    category: "Pre-Foreclosures",
    url: "https://www.harriscountyclerk.org/foreclosures",
    method: "scraper",
    dataType: "pre-foreclosures",
    dataQuality: "HIGH",
    implementation: "IMMEDIATE",
    description: "Harris County pre-foreclosure properties",
    selectors: {
      tableSelector: ".foreclosure-list",
      rowSelector: ".foreclosure-item",
      ownerSelector: ".owner",
      addressSelector: ".address",
      lenderSelector: ".lender",
      amountSelector: ".amount",
      dateSelector: ".date",
      caseSelector: ".case"
    }
  },

  // ===== TIER 2: PROBATE PROPERTIES =====
  {
    id: "probate-miami-dade",
    name: "Miami-Dade Probate Court",
    category: "Probate Properties",
    url: "https://www.miami-dadeclerk.com/probate",
    method: "scraper",
    dataType: "probate-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Miami-Dade probate properties",
    selectors: {
      tableSelector: ".probate-cases",
      rowSelector: ".case-row",
      ownerSelector: ".deceased",
      addressSelector: ".property",
      executorSelector: ".executor",
      dateSelector: ".filing-date",
      caseSelector: ".case-number"
    }
  },
  {
    id: "probate-broward",
    name: "Broward Probate Court",
    category: "Probate Properties",
    url: "https://www.browardclerk.org/probate",
    method: "scraper",
    dataType: "probate-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Broward County probate properties",
    selectors: {
      tableSelector: ".probate-cases",
      rowSelector: ".case-row",
      ownerSelector: ".deceased",
      addressSelector: ".property",
      executorSelector: ".executor",
      dateSelector: ".filing-date",
      caseSelector: ".case-number"
    }
  },

  // ===== TIER 2: VACANT PROPERTIES =====
  {
    id: "vacant-usps",
    name: "USPS Vacant Properties",
    category: "Vacant Properties",
    url: "https://www.usps.com/vacant-properties",
    method: "api",
    dataType: "vacant-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "USPS vacant property indicators",
    apiConfig: {
      endpoint: "https://api.usps.com/vacant-properties",
      parameters: {
        "format": "json"
      }
    }
  },

  // ===== TIER 2: ABSENTEE OWNERS =====
  {
    id: "absentee-los-angeles",
    name: "Los Angeles County Assessor - Absentee Owners",
    category: "Absentee Owners",
    url: "https://assessor.lacounty.gov/owner-search",
    method: "scraper",
    dataType: "absentee-owners",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Los Angeles County absentee owners",
    selectors: {
      tableSelector: ".owner-results",
      rowSelector: ".owner-row",
      ownerSelector: ".owner-name",
      propertyAddressSelector: ".property-address",
      mailingAddressSelector: ".mailing-address",
      stateSelector: ".state"
    }
  },

  // ===== TIER 2: EVICTION FILINGS =====
  {
    id: "evictions-los-angeles",
    name: "Los Angeles County Eviction Filings",
    category: "Eviction Filings",
    url: "https://www.lacourt.org/eviction-filings",
    method: "scraper",
    dataType: "eviction-filings",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Los Angeles County eviction filings",
    selectors: {
      tableSelector: ".eviction-cases",
      rowSelector: ".case-row",
      tenantSelector: ".tenant-name",
      landlordSelector: ".landlord-name",
      addressSelector: ".property-address",
      dateSelector: ".filing-date",
      caseSelector: ".case-number"
    }
  },

  // ===== TIER 2: DIVORCE-RELATED PROPERTIES =====
  {
    id: "divorce-los-angeles",
    name: "Los Angeles County Divorce Filings",
    category: "Divorce Properties",
    url: "https://www.lacourt.org/divorce-filings",
    method: "scraper",
    dataType: "divorce-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Los Angeles County divorce-related properties",
    selectors: {
      tableSelector: ".divorce-cases",
      rowSelector: ".case-row",
      petitionerSelector: ".petitioner",
      respondentSelector: ".respondent",
      addressSelector: ".property-address",
      dateSelector: ".filing-date",
      caseSelector: ".case-number"
    }
  },

  // ===== TIER 2: RENTAL REGISTRATION =====
  {
    id: "rental-registration-chicago",
    name: "Chicago Rental Registration",
    category: "Rental Registration",
    url: "https://data.cityofchicago.org/rental-registration",
    method: "api",
    dataType: "rental-registrations",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Chicago rental registration data",
    apiConfig: {
      endpoint: "https://data.cityofchicago.org/resource/rental-registration.json",
      parameters: {
        "$limit": "1000",
        "$order": "registration_date DESC"
      }
    }
  },

  // ===== TIER 2: ENVIRONMENTAL VIOLATIONS =====
  {
    id: "environmental-epa",
    name: "EPA Environmental Violations",
    category: "Environmental Violations",
    url: "https://api.epa.gov/environmental-violations",
    method: "api",
    dataType: "environmental-violations",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "EPA environmental violation records",
    apiConfig: {
      endpoint: "https://api.epa.gov/environmental-violations",
      parameters: {
        "format": "json"
      }
    }
  },

  // ===== TIER 2: DEMOLITION LISTS =====
  {
    id: "demolition-chicago",
    name: "Chicago Demolition Permits",
    category: "Demolition Lists",
    url: "https://data.cityofchicago.org/demolition-permits",
    method: "api",
    dataType: "demolition-permits",
    dataQuality: "HIGH",
    implementation: "PHASE_2",
    description: "Chicago demolition permit data",
    apiConfig: {
      endpoint: "https://data.cityofchicago.org/resource/demolition-permits.json",
      parameters: {
        "$limit": "1000",
        "$order": "permit_date DESC"
      }
    }
  },

  // ===== TIER 2: UTILITY SHUTOFFS =====
  {
    id: "utility-shutoffs-chicago",
    name: "Chicago Utility Shutoffs",
    category: "Utility Shutoffs",
    url: "https://data.cityofchicago.org/utility-shutoffs",
    method: "api",
    dataType: "utility-shutoffs",
    dataQuality: "MEDIUM",
    implementation: "PHASE_2",
    description: "Chicago utility shutoff data",
    apiConfig: {
      endpoint: "https://data.cityofchicago.org/resource/utility-shutoffs.json",
      parameters: {
        "$limit": "1000",
        "$order": "shutoff_date DESC"
      }
    }
  },

  // ===== TIER 3: SENIOR-OWNED PROPERTIES =====
  {
    id: "senior-owned-los-angeles",
    name: "Los Angeles Senior-Owned Properties",
    category: "Senior-Owned Properties",
    url: "https://assessor.lacounty.gov/senior-properties",
    method: "scraper",
    dataType: "senior-owned-properties",
    dataQuality: "MEDIUM",
    implementation: "PHASE_3",
    description: "Los Angeles County senior-owned properties",
    selectors: {
      tableSelector: ".senior-properties",
      rowSelector: ".property-row",
      ownerSelector: ".owner-name",
      addressSelector: ".property-address",
      ageSelector: ".owner-age",
      exemptionSelector: ".exemption-type"
    }
  },

  // ===== TIER 3: BANK-OWNED (REO) PROPERTIES =====
  {
    id: "reo-hud",
    name: "HUD REO Properties",
    category: "Bank-Owned (REO)",
    url: "https://www.hud.gov/reo",
    method: "scraper",
    dataType: "reo-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_3",
    description: "HUD REO properties",
    selectors: {
      tableSelector: ".reo-properties",
      rowSelector: ".property-row",
      addressSelector: ".property-address",
      priceSelector: ".list-price",
      statusSelector: ".status",
      dateSelector: ".list-date"
    }
  },
  {
    id: "reo-fannie",
    name: "Fannie Mae REO Properties",
    category: "Bank-Owned (REO)",
    url: "https://www.fanniemae.com/reo",
    method: "scraper",
    dataType: "reo-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_3",
    description: "Fannie Mae REO properties",
    selectors: {
      tableSelector: ".reo-properties",
      rowSelector: ".property-row",
      addressSelector: ".property-address",
      priceSelector: ".list-price",
      statusSelector: ".status",
      dateSelector: ".list-date"
    }
  },
  {
    id: "reo-freddie",
    name: "Freddie Mac REO Properties",
    category: "Bank-Owned (REO)",
    url: "https://www.freddiemac.com/reo",
    method: "scraper",
    dataType: "reo-properties",
    dataQuality: "HIGH",
    implementation: "PHASE_3",
    description: "Freddie Mac REO properties",
    selectors: {
      tableSelector: ".reo-properties",
      rowSelector: ".property-row",
      addressSelector: ".property-address",
      priceSelector: ".list-price",
      statusSelector: ".status",
      dateSelector: ".list-date"
    }
  }
];

// ===== USER-PROVIDED DATA SOURCES =====
// Add your custom URLs here for immediate integration

export const userProvidedDataSources: FreeDataSource[] = [
  // Add your URLs here - I'll automatically configure them
  // Example format:
  // {
  //   id: "your-custom-source",
  //   name: "Your Custom Data Source",
  //   category: "Tax Delinquent", // or "Code Violations", "Pre-Foreclosure", etc.
  //   url: "https://your-url-here.com",
  //   method: "scraper", // or "api" or "csv"
  //   dataType: "tax-delinquent", // or "code-violations", "pre-foreclosure", etc.
  //   dataQuality: "HIGH", // or "MEDIUM" or "LOW"
  //   implementation: "IMMEDIATE", // or "PHASE_2" or "PHASE_3"
  //   description: "Your description of this data source",
  //   selectors: {
  //     tableSelector: ".data-table",
  //     rowSelector: "tr",
  //     ownerSelector: ".owner-name",
  //     addressSelector: ".property-address",
  //     amountSelector: ".tax-amount",
  //     dateSelector: ".delinquent-year"
  //   },
  //   apiConfig: {
  //     endpoint: "https://api.your-url.com/data",
  //     parameters: {
  //       "$limit": "1000"
  //     }
  //   }
  // }
];

// Combine all data sources
export const allDataSources = [
  ...freeDataSources,
  ...userProvidedDataSources
];

// Data source categories for organization
export const freeDataSourceCategories = [
  'Tax Delinquent',
  'Code Violations', 
  'Pre-Foreclosures',
  'Probate Properties',
  'Vacant Properties',
  'Absentee Owners',
  'Eviction Filings',
  'Divorce Properties',
  'Rental Registration',
  'Environmental Violations',
  'Demolition Lists',
  'Utility Shutoffs',
  'Senior-Owned Properties',
  'Bank-Owned (REO)'
];

// Implementation phases
export const implementationPhases = ['IMMEDIATE', 'PHASE_2', 'PHASE_3'] as const;

// Data quality levels
export const dataQualityLevels = ['HIGH', 'MEDIUM', 'LOW'] as const;

// Method types for data collection
export const methodTypes = ['scraper', 'api', 'csv'] as const; 