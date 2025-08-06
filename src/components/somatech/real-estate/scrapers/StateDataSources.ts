// State-by-State Data Source Collection Guide
// URLs to gather for each state's property data

export interface StateDataSource {
  state: string;
  stateCode: string;
  population: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dataSources: {
    taxAssessor: string[];
    treasurer: string[];
    clerk: string[];
    courts: string[];
    municipal: string[];
    auction: string[];
  };
  estimatedProperties: number;
}

export const stateDataSources: StateDataSource[] = [
  {
    state: 'California',
    stateCode: 'CA',
    population: 39538223,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.lacounty.gov/tax-delinquent',
        'https://assessor.orangecounty.gov/tax-delinquent',
        'https://assessor.sandiego.gov/tax-delinquent',
        'https://assessor.sacramento.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.lacounty.gov/delinquent-taxes',
        'https://treasurer.orangecounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.lacounty.gov/foreclosures',
        'https://clerk.orangecounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.ca.gov/foreclosures',
        'https://courts.ca.gov/probate',
        'https://courts.ca.gov/divorce'
      ],
      municipal: [
        'https://data.lacity.org/code-violations',
        'https://data.sandiego.gov/building-permits',
        'https://data.sacramento.gov/properties'
      ],
      auction: [
        'https://auction.com/california',
        'https://realtytrac.com/california'
      ]
    },
    estimatedProperties: 50000
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    population: 29145505,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://www.hcad.org/tax-delinquent',
        'https://assessor.dallascounty.org/tax-delinquent',
        'https://assessor.tarrantcounty.com/tax-delinquent',
        'https://assessor.harriscounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.harriscounty.gov/delinquent-taxes',
        'https://treasurer.dallascounty.org/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.harriscounty.gov/foreclosures',
        'https://clerk.dallascounty.org/foreclosures'
      ],
      courts: [
        'https://courts.texas.gov/foreclosures',
        'https://courts.texas.gov/probate'
      ],
      municipal: [
        'https://data.houston.gov/code-violations',
        'https://data.dallas.gov/building-permits',
        'https://data.austin.gov/properties'
      ],
      auction: [
        'https://auction.com/texas',
        'https://realtytrac.com/texas'
      ]
    },
    estimatedProperties: 45000
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    population: 21538187,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.miamidade.gov/tax-delinquent',
        'https://assessor.broward.org/tax-delinquent',
        'https://assessor.palmbeach.gov/tax-delinquent',
        'https://assessor.orangecountyfl.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.miamidade.gov/delinquent-taxes',
        'https://treasurer.broward.org/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.miamidade.gov/foreclosures',
        'https://clerk.broward.org/foreclosures'
      ],
      courts: [
        'https://courts.fl.gov/foreclosures',
        'https://courts.fl.gov/probate'
      ],
      municipal: [
        'https://data.miamidade.gov/code-violations',
        'https://data.orlando.gov/building-permits',
        'https://data.tampa.gov/properties'
      ],
      auction: [
        'https://auction.com/florida',
        'https://realtytrac.com/florida'
      ]
    },
    estimatedProperties: 40000
  },
  {
    state: 'New York',
    stateCode: 'NY',
    population: 20201249,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.nyc.gov/tax-delinquent',
        'https://assessor.nassaucounty.gov/tax-delinquent',
        'https://assessor.suffolkcounty.gov/tax-delinquent',
        'https://assessor.westchestergov.com/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.nyc.gov/delinquent-taxes',
        'https://treasurer.nassaucounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.nyc.gov/foreclosures',
        'https://clerk.nassaucounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.ny.gov/foreclosures',
        'https://courts.ny.gov/probate'
      ],
      municipal: [
        'https://data.cityofnewyork.us/code-violations',
        'https://data.buffalo.gov/building-permits',
        'https://data.rochester.gov/properties'
      ],
      auction: [
        'https://auction.com/new-york',
        'https://realtytrac.com/new-york'
      ]
    },
    estimatedProperties: 35000
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    population: 12812508,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.cookcounty.gov/tax-delinquent',
        'https://assessor.dupagecounty.gov/tax-delinquent',
        'https://assessor.willcounty.gov/tax-delinquent',
        'https://assessor.lakecounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.cookcounty.gov/delinquent-taxes',
        'https://treasurer.dupagecounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.cookcounty.gov/foreclosures',
        'https://clerk.dupagecounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.illinois.gov/foreclosures',
        'https://courts.illinois.gov/probate'
      ],
      municipal: [
        'https://data.cityofchicago.org/code-violations',
        'https://data.cityofchicago.org/building-permits',
        'https://data.cityofchicago.org/properties'
      ],
      auction: [
        'https://auction.com/illinois',
        'https://realtytrac.com/illinois'
      ]
    },
    estimatedProperties: 30000
  },
  {
    state: 'Pennsylvania',
    stateCode: 'PA',
    population: 13002700,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.philadelphia.gov/tax-delinquent',
        'https://assessor.alleghenycounty.gov/tax-delinquent',
        'https://assessor.montgomerycounty.gov/tax-delinquent',
        'https://assessor.delawarecounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.philadelphia.gov/delinquent-taxes',
        'https://treasurer.alleghenycounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.philadelphia.gov/foreclosures',
        'https://clerk.alleghenycounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.pa.gov/foreclosures',
        'https://courts.pa.gov/probate'
      ],
      municipal: [
        'https://data.phila.gov/code-violations',
        'https://data.pittsburgh.gov/building-permits',
        'https://data.phila.gov/properties'
      ],
      auction: [
        'https://auction.com/pennsylvania',
        'https://realtytrac.com/pennsylvania'
      ]
    },
    estimatedProperties: 28000
  },
  {
    state: 'Ohio',
    stateCode: 'OH',
    population: 11799448,
    priority: 'MEDIUM',
    dataSources: {
      taxAssessor: [
        'https://assessor.cuyahogacounty.gov/tax-delinquent',
        'https://assessor.hamiltoncounty.gov/tax-delinquent',
        'https://assessor.franklincounty.gov/tax-delinquent',
        'https://assessor.summitcounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.cuyahogacounty.gov/delinquent-taxes',
        'https://treasurer.hamiltoncounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.cuyahogacounty.gov/foreclosures',
        'https://clerk.hamiltoncounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.ohio.gov/foreclosures',
        'https://courts.ohio.gov/probate'
      ],
      municipal: [
        'https://data.cleveland.gov/code-violations',
        'https://data.cincinnati.gov/building-permits',
        'https://data.columbus.gov/properties'
      ],
      auction: [
        'https://auction.com/ohio',
        'https://realtytrac.com/ohio'
      ]
    },
    estimatedProperties: 25000
  },
  {
    state: 'Georgia',
    stateCode: 'GA',
    population: 10711908,
    priority: 'HIGH',
    dataSources: {
      taxAssessor: [
        'https://assessor.fultoncounty.gov/tax-delinquent',
        'https://assessor.gwinnettcounty.gov/tax-delinquent',
        'https://assessor.cobbcounty.gov/tax-delinquent',
        'https://assessor.dekalbcounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.fultoncounty.gov/delinquent-taxes',
        'https://treasurer.gwinnettcounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.fultoncounty.gov/foreclosures',
        'https://clerk.gwinnettcounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.ga.gov/foreclosures',
        'https://courts.ga.gov/probate'
      ],
      municipal: [
        'https://data.atlantaga.gov/code-violations',
        'https://data.atlantaga.gov/building-permits',
        'https://data.atlantaga.gov/properties'
      ],
      auction: [
        'https://auction.com/georgia',
        'https://realtytrac.com/georgia'
      ]
    },
    estimatedProperties: 22000
  },
  {
    state: 'North Carolina',
    stateCode: 'NC',
    population: 10439388,
    priority: 'MEDIUM',
    dataSources: {
      taxAssessor: [
        'https://assessor.mecklenburgcounty.gov/tax-delinquent',
        'https://assessor.wakecounty.gov/tax-delinquent',
        'https://assessor.guilfordcounty.gov/tax-delinquent',
        'https://assessor.forsythcounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.mecklenburgcounty.gov/delinquent-taxes',
        'https://treasurer.wakecounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.mecklenburgcounty.gov/foreclosures',
        'https://clerk.wakecounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.nc.gov/foreclosures',
        'https://courts.nc.gov/probate'
      ],
      municipal: [
        'https://data.charlottenc.gov/code-violations',
        'https://data.raleighnc.gov/building-permits',
        'https://data.greensboro-nc.gov/properties'
      ],
      auction: [
        'https://auction.com/north-carolina',
        'https://realtytrac.com/north-carolina'
      ]
    },
    estimatedProperties: 20000
  },
  {
    state: 'Michigan',
    stateCode: 'MI',
    population: 10077331,
    priority: 'MEDIUM',
    dataSources: {
      taxAssessor: [
        'https://assessor.waynecounty.gov/tax-delinquent',
        'https://assessor.oaklandcounty.gov/tax-delinquent',
        'https://assessor.macombcounty.gov/tax-delinquent',
        'https://assessor.kentcounty.gov/tax-delinquent'
      ],
      treasurer: [
        'https://treasurer.waynecounty.gov/delinquent-taxes',
        'https://treasurer.oaklandcounty.gov/delinquent-taxes'
      ],
      clerk: [
        'https://clerk.waynecounty.gov/foreclosures',
        'https://clerk.oaklandcounty.gov/foreclosures'
      ],
      courts: [
        'https://courts.michigan.gov/foreclosures',
        'https://courts.michigan.gov/probate'
      ],
      municipal: [
        'https://data.detroitmi.gov/code-violations',
        'https://data.grandrapids.gov/building-permits',
        'https://data.lansing.gov/properties'
      ],
      auction: [
        'https://auction.com/michigan',
        'https://realtytrac.com/michigan'
      ]
    },
    estimatedProperties: 18000
  }
];

// URL Collection Priority by Data Type
export const urlCollectionPriority = {
  HIGH_PRIORITY: [
    'Tax Delinquent Properties',
    'Pre-Foreclosure Properties', 
    'Code Violation Properties',
    'Probate Properties',
    'REO Properties'
  ],
  MEDIUM_PRIORITY: [
    'Auction Properties',
    'Vacant Properties',
    'Divorce Properties',
    'Bankruptcy Properties'
  ],
  LOW_PRIORITY: [
    'Demographic Data',
    'Environmental Data',
    'Market Data'
  ]
};

// URL Collection Checklist
export const urlCollectionChecklist = {
  TAX_ASSESSOR_URLS: [
    'County tax assessor websites',
    'Tax delinquent property lists',
    'Property search databases',
    'Assessment records'
  ],
  COURT_RECORDS_URLS: [
    'County clerk websites',
    'Foreclosure listings',
    'Probate court records',
    'Divorce filings'
  ],
  MUNICIPAL_API_URLS: [
    'Open data portals',
    'Code violation databases',
    'Building permit records',
    'Property registration'
  ],
  GOVERNMENT_REO_URLS: [
    'HUD REO properties',
    'Fannie Mae REO',
    'Freddie Mac REO',
    'VA REO properties'
  ],
  AUCTION_URLS: [
    'Sheriff sale listings',
    'Online auction sites',
    'Real estate auction databases'
  ]
}; 