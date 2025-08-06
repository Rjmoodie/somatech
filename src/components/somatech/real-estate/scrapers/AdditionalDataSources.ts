// Additional Data Sources for Real Estate Scraping
// This file contains additional data sources beyond the main scraping engine

export interface AdditionalDataSource {
  id: string;
  name: string;
  category: string;
  url: string;
  method: 'api' | 'scraper' | 'rss' | 'csv';
  description: string;
  dataType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'real-time';
  requiresAuth: boolean;
  apiKey?: string;
  rateLimit?: number;
  priority: 'high' | 'medium' | 'low';
}

export const additionalDataSources: AdditionalDataSource[] = [
  // MLS Data Sources
  {
    id: 'mls-realtor',
    name: 'Realtor.com MLS',
    category: 'MLS',
    url: 'https://www.realtor.com/api/v1/properties',
    method: 'api',
    description: 'MLS listings from Realtor.com',
    dataType: 'mls-listings',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-realtor-api-key',
    rateLimit: 1000,
    priority: 'high'
  },
  {
    id: 'mls-zillow',
    name: 'Zillow MLS',
    category: 'MLS',
    url: 'https://api.zillow.com/v2/properties',
    method: 'api',
    description: 'MLS listings from Zillow',
    dataType: 'mls-listings',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-zillow-api-key',
    rateLimit: 1000,
    priority: 'high'
  },
  {
    id: 'mls-redfin',
    name: 'Redfin MLS',
    category: 'MLS',
    url: 'https://api.redfin.com/v1/properties',
    method: 'api',
    description: 'MLS listings from Redfin',
    dataType: 'mls-listings',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-redfin-api-key',
    rateLimit: 1000,
    priority: 'high'
  },

  // Auction Sites
  {
    id: 'auction-hubspot',
    name: 'HubSpot Auctions',
    category: 'Auctions',
    url: 'https://www.hubspot.com/auctions',
    method: 'scraper',
    description: 'Property auctions from HubSpot',
    dataType: 'auction-properties',
    frequency: 'daily',
    requiresAuth: false,
    priority: 'high'
  },
  {
    id: 'auction-auctioncom',
    name: 'Auction.com',
    category: 'Auctions',
    url: 'https://www.auction.com/api/properties',
    method: 'api',
    description: 'Property auctions from Auction.com',
    dataType: 'auction-properties',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-auction-api-key',
    rateLimit: 500,
    priority: 'high'
  },
  {
    id: 'auction-realtytrac',
    name: 'RealtyTrac Auctions',
    category: 'Auctions',
    url: 'https://www.realtytrac.com/api/auctions',
    method: 'api',
    description: 'Property auctions from RealtyTrac',
    dataType: 'auction-properties',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-realtytrac-api-key',
    rateLimit: 500,
    priority: 'high'
  },

  // Court Records
  {
    id: 'court-pacer',
    name: 'PACER Court Records',
    category: 'Court Records',
    url: 'https://pacer.uscourts.gov/api',
    method: 'api',
    description: 'Federal court records from PACER',
    dataType: 'court-records',
    frequency: 'daily',
    requiresAuth: true,
    apiKey: 'your-pacer-api-key',
    rateLimit: 100,
    priority: 'medium'
  },
  {
    id: 'court-lexis',
    name: 'LexisNexis Court Records',
    category: 'Court Records',
    url: 'https://api.lexisnexis.com/court-records',
    method: 'api',
    description: 'Court records from LexisNexis',
    dataType: 'court-records',
    frequency: 'real-time',
    requiresAuth: true,
    apiKey: 'your-lexis-api-key',
    rateLimit: 1000,
    priority: 'medium'
  },

  // Tax Records
  {
    id: 'tax-propertyradar',
    name: 'PropertyRadar Tax Records',
    category: 'Tax Records',
    url: 'https://api.propertyradar.com/tax-records',
    method: 'api',
    description: 'Tax records from PropertyRadar',
    dataType: 'tax-records',
    frequency: 'weekly',
    requiresAuth: true,
    apiKey: 'your-propertyradar-api-key',
    rateLimit: 500,
    priority: 'high'
  },
  {
    id: 'tax-propertyiq',
    name: 'PropertyIQ Tax Records',
    category: 'Tax Records',
    url: 'https://api.propertyiq.com/tax-records',
    method: 'api',
    description: 'Tax records from PropertyIQ',
    dataType: 'tax-records',
    frequency: 'weekly',
    requiresAuth: true,
    apiKey: 'your-propertyiq-api-key',
    rateLimit: 500,
    priority: 'high'
  },

  // Bankruptcy Records
  {
    id: 'bankruptcy-pacer',
    name: 'PACER Bankruptcy Records',
    category: 'Bankruptcy',
    url: 'https://pacer.uscourts.gov/bankruptcy',
    method: 'api',
    description: 'Bankruptcy records from PACER',
    dataType: 'bankruptcy-records',
    frequency: 'daily',
    requiresAuth: true,
    apiKey: 'your-pacer-api-key',
    rateLimit: 100,
    priority: 'medium'
  },

  // Probate Records
  {
    id: 'probate-ancestry',
    name: 'Ancestry Probate Records',
    category: 'Probate',
    url: 'https://api.ancestry.com/probate-records',
    method: 'api',
    description: 'Probate records from Ancestry',
    dataType: 'probate-records',
    frequency: 'weekly',
    requiresAuth: true,
    apiKey: 'your-ancestry-api-key',
    rateLimit: 200,
    priority: 'medium'
  },

  // Divorce Records
  {
    id: 'divorce-courtapi',
    name: 'CourtAPI Divorce Records',
    category: 'Divorce',
    url: 'https://api.courtapi.com/divorce-records',
    method: 'api',
    description: 'Divorce records from CourtAPI',
    dataType: 'divorce-records',
    frequency: 'weekly',
    requiresAuth: true,
    apiKey: 'your-courtapi-api-key',
    rateLimit: 300,
    priority: 'medium'
  },

  // Estate Sales
  {
    id: 'estate-estatesales',
    name: 'EstateSales.net',
    category: 'Estate Sales',
    url: 'https://www.estatesales.net/api/sales',
    method: 'api',
    description: 'Estate sales from EstateSales.net',
    dataType: 'estate-sales',
    frequency: 'daily',
    requiresAuth: false,
    rateLimit: 100,
    priority: 'medium'
  },

  // Short Sales
  {
    id: 'shortsale-hud',
    name: 'HUD Short Sales',
    category: 'Short Sales',
    url: 'https://www.hud.gov/shortsales',
    method: 'scraper',
    description: 'HUD short sale properties',
    dataType: 'short-sales',
    frequency: 'weekly',
    requiresAuth: false,
    priority: 'high'
  },

  // REO Properties
  {
    id: 'reo-hud',
    name: 'HUD REO Properties',
    category: 'REO',
    url: 'https://www.hud.gov/reo',
    method: 'scraper',
    description: 'HUD REO properties',
    dataType: 'reo-properties',
    frequency: 'weekly',
    requiresAuth: false,
    priority: 'high'
  },
  {
    id: 'reo-fannie',
    name: 'Fannie Mae REO',
    category: 'REO',
    url: 'https://www.fanniemae.com/reo',
    method: 'scraper',
    description: 'Fannie Mae REO properties',
    dataType: 'reo-properties',
    frequency: 'weekly',
    requiresAuth: false,
    priority: 'high'
  },
  {
    id: 'reo-freddie',
    name: 'Freddie Mac REO',
    category: 'REO',
    url: 'https://www.freddiemac.com/reo',
    method: 'scraper',
    description: 'Freddie Mac REO properties',
    dataType: 'reo-properties',
    frequency: 'weekly',
    requiresAuth: false,
    priority: 'high'
  },

  // Vacant Properties
  {
    id: 'vacant-usps',
    name: 'USPS Vacant Properties',
    category: 'Vacant Properties',
    url: 'https://www.usps.com/vacant-properties',
    method: 'api',
    description: 'Vacant properties from USPS',
    dataType: 'vacant-properties',
    frequency: 'monthly',
    requiresAuth: true,
    apiKey: 'your-usps-api-key',
    rateLimit: 50,
    priority: 'medium'
  },

  // Absentee Owners
  {
    id: 'absentee-propertyradar',
    name: 'PropertyRadar Absentee Owners',
    category: 'Absentee Owners',
    url: 'https://api.propertyradar.com/absentee-owners',
    method: 'api',
    description: 'Absentee owner data from PropertyRadar',
    dataType: 'absentee-owners',
    frequency: 'weekly',
    requiresAuth: true,
    apiKey: 'your-propertyradar-api-key',
    rateLimit: 500,
    priority: 'medium'
  },

  // Code Violations
  {
    id: 'violations-open311',
    name: 'Open311 Code Violations',
    category: 'Code Violations',
    url: 'https://api.open311.org/violations',
    method: 'api',
    description: 'Code violations from Open311',
    dataType: 'code-violations',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 1000,
    priority: 'high'
  },

  // Building Permits
  {
    id: 'permits-open311',
    name: 'Open311 Building Permits',
    category: 'Building Permits',
    url: 'https://api.open311.org/permits',
    method: 'api',
    description: 'Building permits from Open311',
    dataType: 'building-permits',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 1000,
    priority: 'medium'
  },

  // Demolition Permits
  {
    id: 'demolition-open311',
    name: 'Open311 Demolition Permits',
    category: 'Demolition Permits',
    url: 'https://api.open311.org/demolition',
    method: 'api',
    description: 'Demolition permits from Open311',
    dataType: 'demolition-permits',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 1000,
    priority: 'medium'
  },

  // Zoning Changes
  {
    id: 'zoning-open311',
    name: 'Open311 Zoning Changes',
    category: 'Zoning',
    url: 'https://api.open311.org/zoning',
    method: 'api',
    description: 'Zoning changes from Open311',
    dataType: 'zoning-changes',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 1000,
    priority: 'medium'
  },

  // Environmental Hazards
  {
    id: 'environmental-epa',
    name: 'EPA Environmental Hazards',
    category: 'Environmental',
    url: 'https://api.epa.gov/environmental-hazards',
    method: 'api',
    description: 'Environmental hazards from EPA',
    dataType: 'environmental-hazards',
    frequency: 'weekly',
    requiresAuth: false,
    rateLimit: 100,
    priority: 'high'
  },

  // Flood Zones
  {
    id: 'flood-fema',
    name: 'FEMA Flood Zones',
    category: 'Flood Zones',
    url: 'https://api.fema.gov/flood-zones',
    method: 'api',
    description: 'Flood zones from FEMA',
    dataType: 'flood-zones',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'medium'
  },

  // Fire Zones
  {
    id: 'fire-california',
    name: 'California Fire Zones',
    category: 'Fire Zones',
    url: 'https://api.calfire.gov/fire-zones',
    method: 'api',
    description: 'Fire zones from CalFire',
    dataType: 'fire-zones',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 100,
    priority: 'medium'
  },

  // Earthquake Zones
  {
    id: 'earthquake-usgs',
    name: 'USGS Earthquake Zones',
    category: 'Earthquake Zones',
    url: 'https://api.usgs.gov/earthquake-zones',
    method: 'api',
    description: 'Earthquake zones from USGS',
    dataType: 'earthquake-zones',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 100,
    priority: 'medium'
  },

  // School Districts
  {
    id: 'schools-nces',
    name: 'NCES School Districts',
    category: 'School Districts',
    url: 'https://api.nces.gov/school-districts',
    method: 'api',
    description: 'School districts from NCES',
    dataType: 'school-districts',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Crime Data
  {
    id: 'crime-fbi',
    name: 'FBI Crime Data',
    category: 'Crime Data',
    url: 'https://api.fbi.gov/crime-data',
    method: 'api',
    description: 'Crime data from FBI',
    dataType: 'crime-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'medium'
  },

  // Demographics
  {
    id: 'demographics-census',
    name: 'US Census Demographics',
    category: 'Demographics',
    url: 'https://api.census.gov/demographics',
    method: 'api',
    description: 'Demographics from US Census',
    dataType: 'demographics',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Economic Data
  {
    id: 'economic-bls',
    name: 'BLS Economic Data',
    category: 'Economic Data',
    url: 'https://api.bls.gov/economic-data',
    method: 'api',
    description: 'Economic data from BLS',
    dataType: 'economic-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Employment Data
  {
    id: 'employment-bls',
    name: 'BLS Employment Data',
    category: 'Employment Data',
    url: 'https://api.bls.gov/employment-data',
    method: 'api',
    description: 'Employment data from BLS',
    dataType: 'employment-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Income Data
  {
    id: 'income-census',
    name: 'US Census Income Data',
    category: 'Income Data',
    url: 'https://api.census.gov/income-data',
    method: 'api',
    description: 'Income data from US Census',
    dataType: 'income-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Transportation
  {
    id: 'transportation-dot',
    name: 'DOT Transportation Data',
    category: 'Transportation',
    url: 'https://api.dot.gov/transportation-data',
    method: 'api',
    description: 'Transportation data from DOT',
    dataType: 'transportation-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Public Transit
  {
    id: 'transit-gtfs',
    name: 'GTFS Transit Data',
    category: 'Public Transit',
    url: 'https://api.gtfs.org/transit-data',
    method: 'api',
    description: 'Public transit data from GTFS',
    dataType: 'transit-data',
    frequency: 'real-time',
    requiresAuth: false,
    rateLimit: 1000,
    priority: 'low'
  },

  // Parks and Recreation
  {
    id: 'parks-nps',
    name: 'NPS Parks Data',
    category: 'Parks and Recreation',
    url: 'https://api.nps.gov/parks-data',
    method: 'api',
    description: 'Parks data from NPS',
    dataType: 'parks-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Libraries
  {
    id: 'libraries-ala',
    name: 'ALA Libraries Data',
    category: 'Libraries',
    url: 'https://api.ala.org/libraries-data',
    method: 'api',
    description: 'Libraries data from ALA',
    dataType: 'libraries-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Hospitals
  {
    id: 'hospitals-aha',
    name: 'AHA Hospitals Data',
    category: 'Hospitals',
    url: 'https://api.aha.org/hospitals-data',
    method: 'api',
    description: 'Hospitals data from AHA',
    dataType: 'hospitals-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Police Stations
  {
    id: 'police-fbi',
    name: 'FBI Police Data',
    category: 'Police Stations',
    url: 'https://api.fbi.gov/police-data',
    method: 'api',
    description: 'Police data from FBI',
    dataType: 'police-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Fire Stations
  {
    id: 'fire-nfpa',
    name: 'NFPA Fire Data',
    category: 'Fire Stations',
    url: 'https://api.nfpa.org/fire-data',
    method: 'api',
    description: 'Fire data from NFPA',
    dataType: 'fire-data',
    frequency: 'yearly',
    requiresAuth: false,
    rateLimit: 10,
    priority: 'low'
  },

  // Post Offices
  {
    id: 'postoffice-usps',
    name: 'USPS Post Office Data',
    category: 'Post Offices',
    url: 'https://api.usps.com/post-office-data',
    method: 'api',
    description: 'Post office data from USPS',
    dataType: 'post-office-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Banks
  {
    id: 'banks-fdic',
    name: 'FDIC Bank Data',
    category: 'Banks',
    url: 'https://api.fdic.gov/bank-data',
    method: 'api',
    description: 'Bank data from FDIC',
    dataType: 'bank-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Credit Unions
  {
    id: 'creditunions-ncua',
    name: 'NCUA Credit Union Data',
    category: 'Credit Unions',
    url: 'https://api.ncua.gov/credit-union-data',
    method: 'api',
    description: 'Credit union data from NCUA',
    dataType: 'credit-union-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Grocery Stores
  {
    id: 'grocery-usda',
    name: 'USDA Grocery Data',
    category: 'Grocery Stores',
    url: 'https://api.usda.gov/grocery-data',
    method: 'api',
    description: 'Grocery data from USDA',
    dataType: 'grocery-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Gas Stations
  {
    id: 'gas-eia',
    name: 'EIA Gas Station Data',
    category: 'Gas Stations',
    url: 'https://api.eia.gov/gas-station-data',
    method: 'api',
    description: 'Gas station data from EIA',
    dataType: 'gas-station-data',
    frequency: 'weekly',
    requiresAuth: false,
    rateLimit: 100,
    priority: 'low'
  },

  // Restaurants
  {
    id: 'restaurants-fda',
    name: 'FDA Restaurant Data',
    category: 'Restaurants',
    url: 'https://api.fda.gov/restaurant-data',
    method: 'api',
    description: 'Restaurant data from FDA',
    dataType: 'restaurant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Hotels
  {
    id: 'hotels-aaa',
    name: 'AAA Hotel Data',
    category: 'Hotels',
    url: 'https://api.aaa.com/hotel-data',
    method: 'api',
    description: 'Hotel data from AAA',
    dataType: 'hotel-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Movie Theaters
  {
    id: 'theaters-mpaa',
    name: 'MPAA Theater Data',
    category: 'Movie Theaters',
    url: 'https://api.mpaa.org/theater-data',
    method: 'api',
    description: 'Theater data from MPAA',
    dataType: 'theater-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Shopping Centers
  {
    id: 'shopping-icsc',
    name: 'ICSC Shopping Center Data',
    category: 'Shopping Centers',
    url: 'https://api.icsc.org/shopping-center-data',
    method: 'api',
    description: 'Shopping center data from ICSC',
    dataType: 'shopping-center-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Office Buildings
  {
    id: 'office-boma',
    name: 'BOMA Office Data',
    category: 'Office Buildings',
    url: 'https://api.boma.org/office-data',
    method: 'api',
    description: 'Office building data from BOMA',
    dataType: 'office-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Industrial Buildings
  {
    id: 'industrial-naiop',
    name: 'NAIOP Industrial Data',
    category: 'Industrial Buildings',
    url: 'https://api.naiop.org/industrial-data',
    method: 'api',
    description: 'Industrial building data from NAIOP',
    dataType: 'industrial-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Warehouses
  {
    id: 'warehouses-werc',
    name: 'WERC Warehouse Data',
    category: 'Warehouses',
    url: 'https://api.werc.org/warehouse-data',
    method: 'api',
    description: 'Warehouse data from WERC',
    dataType: 'warehouse-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Data Centers
  {
    id: 'datacenters-uptime',
    name: 'Uptime Institute Data Center Data',
    category: 'Data Centers',
    url: 'https://api.uptimeinstitute.org/datacenter-data',
    method: 'api',
    description: 'Data center data from Uptime Institute',
    dataType: 'datacenter-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Cell Towers
  {
    id: 'celltowers-fcc',
    name: 'FCC Cell Tower Data',
    category: 'Cell Towers',
    url: 'https://api.fcc.gov/cell-tower-data',
    method: 'api',
    description: 'Cell tower data from FCC',
    dataType: 'cell-tower-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Solar Farms
  {
    id: 'solar-eia',
    name: 'EIA Solar Farm Data',
    category: 'Solar Farms',
    url: 'https://api.eia.gov/solar-farm-data',
    method: 'api',
    description: 'Solar farm data from EIA',
    dataType: 'solar-farm-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Wind Farms
  {
    id: 'wind-eia',
    name: 'EIA Wind Farm Data',
    category: 'Wind Farms',
    url: 'https://api.eia.gov/wind-farm-data',
    method: 'api',
    description: 'Wind farm data from EIA',
    dataType: 'wind-farm-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Hydroelectric Plants
  {
    id: 'hydro-eia',
    name: 'EIA Hydroelectric Data',
    category: 'Hydroelectric Plants',
    url: 'https://api.eia.gov/hydroelectric-data',
    method: 'api',
    description: 'Hydroelectric data from EIA',
    dataType: 'hydroelectric-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Nuclear Plants
  {
    id: 'nuclear-eia',
    name: 'EIA Nuclear Plant Data',
    category: 'Nuclear Plants',
    url: 'https://api.eia.gov/nuclear-plant-data',
    method: 'api',
    description: 'Nuclear plant data from EIA',
    dataType: 'nuclear-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Coal Plants
  {
    id: 'coal-eia',
    name: 'EIA Coal Plant Data',
    category: 'Coal Plants',
    url: 'https://api.eia.gov/coal-plant-data',
    method: 'api',
    description: 'Coal plant data from EIA',
    dataType: 'coal-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Natural Gas Plants
  {
    id: 'gas-eia',
    name: 'EIA Natural Gas Plant Data',
    category: 'Natural Gas Plants',
    url: 'https://api.eia.gov/natural-gas-plant-data',
    method: 'api',
    description: 'Natural gas plant data from EIA',
    dataType: 'natural-gas-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Oil Refineries
  {
    id: 'oil-eia',
    name: 'EIA Oil Refinery Data',
    category: 'Oil Refineries',
    url: 'https://api.eia.gov/oil-refinery-data',
    method: 'api',
    description: 'Oil refinery data from EIA',
    dataType: 'oil-refinery-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Chemical Plants
  {
    id: 'chemical-epa',
    name: 'EPA Chemical Plant Data',
    category: 'Chemical Plants',
    url: 'https://api.epa.gov/chemical-plant-data',
    method: 'api',
    description: 'Chemical plant data from EPA',
    dataType: 'chemical-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Steel Mills
  {
    id: 'steel-aist',
    name: 'AIST Steel Mill Data',
    category: 'Steel Mills',
    url: 'https://api.aist.org/steel-mill-data',
    method: 'api',
    description: 'Steel mill data from AIST',
    dataType: 'steel-mill-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Paper Mills
  {
    id: 'paper-tappi',
    name: 'TAPPI Paper Mill Data',
    category: 'Paper Mills',
    url: 'https://api.tappi.org/paper-mill-data',
    method: 'api',
    description: 'Paper mill data from TAPPI',
    dataType: 'paper-mill-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Cement Plants
  {
    id: 'cement-pca',
    name: 'PCA Cement Plant Data',
    category: 'Cement Plants',
    url: 'https://api.cement.org/cement-plant-data',
    method: 'api',
    description: 'Cement plant data from PCA',
    dataType: 'cement-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Glass Plants
  {
    id: 'glass-gpi',
    name: 'GPI Glass Plant Data',
    category: 'Glass Plants',
    url: 'https://api.glass.org/glass-plant-data',
    method: 'api',
    description: 'Glass plant data from GPI',
    dataType: 'glass-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Aluminum Plants
  {
    id: 'aluminum-aa',
    name: 'AA Aluminum Plant Data',
    category: 'Aluminum Plants',
    url: 'https://api.aluminum.org/aluminum-plant-data',
    method: 'api',
    description: 'Aluminum plant data from AA',
    dataType: 'aluminum-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Copper Plants
  {
    id: 'copper-cda',
    name: 'CDA Copper Plant Data',
    category: 'Copper Plants',
    url: 'https://api.copper.org/copper-plant-data',
    method: 'api',
    description: 'Copper plant data from CDA',
    dataType: 'copper-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Zinc Plants
  {
    id: 'zinc-iza',
    name: 'IZA Zinc Plant Data',
    category: 'Zinc Plants',
    url: 'https://api.zinc.org/zinc-plant-data',
    method: 'api',
    description: 'Zinc plant data from IZA',
    dataType: 'zinc-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Lead Plants
  {
    id: 'lead-ila',
    name: 'ILA Lead Plant Data',
    category: 'Lead Plants',
    url: 'https://api.lead.org/lead-plant-data',
    method: 'api',
    description: 'Lead plant data from ILA',
    dataType: 'lead-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Nickel Plants
  {
    id: 'nickel-ni',
    name: 'NI Nickel Plant Data',
    category: 'Nickel Plants',
    url: 'https://api.nickel.org/nickel-plant-data',
    method: 'api',
    description: 'Nickel plant data from NI',
    dataType: 'nickel-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Chromium Plants
  {
    id: 'chromium-icda',
    name: 'ICDA Chromium Plant Data',
    category: 'Chromium Plants',
    url: 'https://api.chromium.org/chromium-plant-data',
    method: 'api',
    description: 'Chromium plant data from ICDA',
    dataType: 'chromium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Manganese Plants
  {
    id: 'manganese-imn',
    name: 'IMnI Manganese Plant Data',
    category: 'Manganese Plants',
    url: 'https://api.manganese.org/manganese-plant-data',
    method: 'api',
    description: 'Manganese plant data from IMnI',
    dataType: 'manganese-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Molybdenum Plants
  {
    id: 'molybdenum-imoa',
    name: 'IMOA Molybdenum Plant Data',
    category: 'Molybdenum Plants',
    url: 'https://api.molybdenum.org/molybdenum-plant-data',
    method: 'api',
    description: 'Molybdenum plant data from IMOA',
    dataType: 'molybdenum-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Tungsten Plants
  {
    id: 'tungsten-itia',
    name: 'ITIA Tungsten Plant Data',
    category: 'Tungsten Plants',
    url: 'https://api.tungsten.org/tungsten-plant-data',
    method: 'api',
    description: 'Tungsten plant data from ITIA',
    dataType: 'tungsten-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Vanadium Plants
  {
    id: 'vanadium-vanitec',
    name: 'Vanitec Vanadium Plant Data',
    category: 'Vanadium Plants',
    url: 'https://api.vanadium.org/vanadium-plant-data',
    method: 'api',
    description: 'Vanadium plant data from Vanitec',
    dataType: 'vanadium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Cobalt Plants
  {
    id: 'cobalt-cobalt',
    name: 'Cobalt Institute Cobalt Plant Data',
    category: 'Cobalt Plants',
    url: 'https://api.cobalt.org/cobalt-plant-data',
    method: 'api',
    description: 'Cobalt plant data from Cobalt Institute',
    dataType: 'cobalt-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Lithium Plants
  {
    id: 'lithium-lithium',
    name: 'Lithium Institute Lithium Plant Data',
    category: 'Lithium Plants',
    url: 'https://api.lithium.org/lithium-plant-data',
    method: 'api',
    description: 'Lithium plant data from Lithium Institute',
    dataType: 'lithium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Rare Earth Plants
  {
    id: 'rareearth-rare',
    name: 'Rare Earth Institute Rare Earth Plant Data',
    category: 'Rare Earth Plants',
    url: 'https://api.rareearth.org/rare-earth-plant-data',
    method: 'api',
    description: 'Rare earth plant data from Rare Earth Institute',
    dataType: 'rare-earth-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Platinum Plants
  {
    id: 'platinum-pgm',
    name: 'PGM Institute Platinum Plant Data',
    category: 'Platinum Plants',
    url: 'https://api.platinum.org/platinum-plant-data',
    method: 'api',
    description: 'Platinum plant data from PGM Institute',
    dataType: 'platinum-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Palladium Plants
  {
    id: 'palladium-pgm',
    name: 'PGM Institute Palladium Plant Data',
    category: 'Palladium Plants',
    url: 'https://api.palladium.org/palladium-plant-data',
    method: 'api',
    description: 'Palladium plant data from PGM Institute',
    dataType: 'palladium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Rhodium Plants
  {
    id: 'rhodium-pgm',
    name: 'PGM Institute Rhodium Plant Data',
    category: 'Rhodium Plants',
    url: 'https://api.rhodium.org/rhodium-plant-data',
    method: 'api',
    description: 'Rhodium plant data from PGM Institute',
    dataType: 'rhodium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Iridium Plants
  {
    id: 'iridium-pgm',
    name: 'PGM Institute Iridium Plant Data',
    category: 'Iridium Plants',
    url: 'https://api.iridium.org/iridium-plant-data',
    method: 'api',
    description: 'Iridium plant data from PGM Institute',
    dataType: 'iridium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Ruthenium Plants
  {
    id: 'ruthenium-pgm',
    name: 'PGM Institute Ruthenium Plant Data',
    category: 'Ruthenium Plants',
    url: 'https://api.ruthenium.org/ruthenium-plant-data',
    method: 'api',
    description: 'Ruthenium plant data from PGM Institute',
    dataType: 'ruthenium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  },

  // Osmium Plants
  {
    id: 'osmium-pgm',
    name: 'PGM Institute Osmium Plant Data',
    category: 'Osmium Plants',
    url: 'https://api.osmium.org/osmium-plant-data',
    method: 'api',
    description: 'Osmium plant data from PGM Institute',
    dataType: 'osmium-plant-data',
    frequency: 'monthly',
    requiresAuth: false,
    rateLimit: 50,
    priority: 'low'
  }
];

// Data source categories for organization
export const dataSourceCategories = [
  'MLS',
  'Auctions',
  'Court Records',
  'Tax Records',
  'Bankruptcy',
  'Probate',
  'Divorce',
  'Estate Sales',
  'Short Sales',
  'REO',
  'Vacant Properties',
  'Absentee Owners',
  'Code Violations',
  'Building Permits',
  'Demolition Permits',
  'Zoning',
  'Environmental',
  'Flood Zones',
  'Fire Zones',
  'Earthquake Zones',
  'School Districts',
  'Crime Data',
  'Demographics',
  'Economic Data',
  'Employment Data',
  'Income Data',
  'Transportation',
  'Public Transit',
  'Parks and Recreation',
  'Libraries',
  'Hospitals',
  'Police Stations',
  'Fire Stations',
  'Post Offices',
  'Banks',
  'Credit Unions',
  'Grocery Stores',
  'Gas Stations',
  'Restaurants',
  'Hotels',
  'Movie Theaters',
  'Shopping Centers',
  'Office Buildings',
  'Industrial Buildings',
  'Warehouses',
  'Data Centers',
  'Cell Towers',
  'Solar Farms',
  'Wind Farms',
  'Hydroelectric Plants',
  'Nuclear Plants',
  'Coal Plants',
  'Natural Gas Plants',
  'Oil Refineries',
  'Chemical Plants',
  'Steel Mills',
  'Paper Mills',
  'Cement Plants',
  'Glass Plants',
  'Aluminum Plants',
  'Copper Plants',
  'Zinc Plants',
  'Lead Plants',
  'Nickel Plants',
  'Chromium Plants',
  'Manganese Plants',
  'Molybdenum Plants',
  'Tungsten Plants',
  'Vanadium Plants',
  'Cobalt Plants',
  'Lithium Plants',
  'Rare Earth Plants',
  'Platinum Plants',
  'Palladium Plants',
  'Rhodium Plants',
  'Iridium Plants',
  'Ruthenium Plants',
  'Osmium Plants'
];

// Priority levels for data sources
export const priorityLevels = ['high', 'medium', 'low'] as const;

// Frequency options for data updates
export const frequencyOptions = ['real-time', 'daily', 'weekly', 'monthly', 'yearly'] as const;

// Method types for data collection
export const methodTypes = ['api', 'scraper', 'rss', 'csv'] as const; 