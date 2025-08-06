// Utility functions for Investor Guide live data
// Real API integration for Global Macro (FRED) and Country Analysis (World Bank)

const FRED_API_KEY = '33aa24f385bf4aa84f41499f1c30da89';
const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

// FRED Series IDs
const FRED_SERIES = {
  gdpGrowth: 'A191RL1Q225SBEA', // US Real GDP YoY % Change (quarterly)
  inflation: 'CPIAUCSL', // US CPI (monthly)
  oilPrice: 'DCOILBRENTEU', // Brent Oil Price (daily)
  usdIndex: 'DTWEXBGS', // Trade Weighted U.S. Dollar Index: Broad (daily)
  fedFundsRate: 'FEDFUNDS', // Effective Federal Funds Rate (daily)
  treasury10Y: 'DGS10', // 10-Year Treasury Constant Maturity Rate (daily)
  unemployment: 'UNRATE', // US Unemployment Rate (monthly)
};

async function fetchFREDLatest(seriesId) {
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.observations && data.observations.length > 0) {
    return parseFloat(data.observations[0].value);
  }
  return null;
}

export async function fetchGlobalMacroData() {
  // Call the Supabase Edge Function instead of FRED directly
  const res = await fetch("/functions/v1/fetch-fred-data");
  if (!res.ok) throw new Error("Failed to fetch macro data");
  return await res.json();
}

// --- Country Analysis (World Bank API) ---
const WB_BASE = 'https://api.worldbank.org/v2/country';
const WB_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AU', name: 'Australia' },
  { code: 'MX', name: 'Mexico' },
];
const WB_INDICATORS = {
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  interestRate: 'FR.INR.RINR',
  // Consumer confidence and political risk are not always available; will use placeholders
};

async function fetchWorldBankLatest(countryCode, indicator) {
  const url = `${WB_BASE}/${countryCode}/indicator/${indicator}?format=json&per_page=2`;
  const res = await fetch(url);
  const data = await res.json();
  if (Array.isArray(data) && data[1] && data[1][0] && data[1][0].value !== null) {
    return data[1][0].value;
  }
  return null;
}

export async function fetchCountryAnalysisData() {
  // Fetch GDP growth and interest rate for each country
  const results = await Promise.all(
    WB_COUNTRIES.map(async (c) => {
      const [gdpGrowth, interestRate] = await Promise.all([
        fetchWorldBankLatest(c.code, WB_INDICATORS.gdpGrowth),
        fetchWorldBankLatest(c.code, WB_INDICATORS.interestRate),
      ]);
      return {
        country: c.name,
        gdpGrowth,
        interestRate,
        politicalRisk: null, // Placeholder
        consumerConfidence: null, // Placeholder
      };
    })
  );
  return results;
}

// --- Industry Breakdown (Yahoo Finance/public) ---
export async function fetchIndustryBreakdownData() {
  // TODO: Fetch from Yahoo Finance or public source
  return [
    { industry: 'Software', cagr: 8.2, ebitMargin: 22, tam: 1200, type: 'growth' },
    { industry: 'Utilities', cagr: 2.1, ebitMargin: 14, tam: 400, type: 'value' },
    // ...more industries
  ];
}

// --- Sector Intelligence (Alpha Vantage via Supabase Edge Function) ---
export async function fetchSectorIntelligenceData() {
  // TODO: Call Supabase Edge Function for Alpha Vantage sector data
  return [
    { sector: 'Technology', pe: 28, evEbitda: 18, roic: 12, profitMargin: 21, topCompanies: ['AAPL', 'MSFT', 'GOOGL'] },
    { sector: 'Healthcare', pe: 22, evEbitda: 15, roic: 10, profitMargin: 18, topCompanies: ['JNJ', 'PFE', 'MRK'] },
    // ...more sectors
  ];
}

// --- Company Deep Dive (Alpha Vantage via Supabase Edge Function) ---
export async function fetchCompanyDeepDiveData(symbol: string) {
  // TODO: Call Supabase Edge Function for Alpha Vantage company data
  return {
    symbol,
    name: 'Apple Inc.',
    price: 195.2,
    pe: 32,
    evEbitda: 21,
    roic: 14,
    profitMargin: 23,
    revenueGrowth: 6.5,
    dividendYield: 0.6,
    debtEquity: 1.2,
    // ...more fields
  };
} 