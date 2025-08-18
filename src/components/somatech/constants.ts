import { 
  Calculator, 
  TrendingUp, 
  Users, 
  FileText, 
  Home, 
  DollarSign, 
  Star, 
  ShoppingCart, 
  LayoutDashboard, 
  Activity, 
  Heart, 
  Target,
  Crown,
  BarChart3,
  Settings,
  Palette,
  Shield,
  Building,
  Eye,
  Calendar,
  Search,
  Store,
  Database,
  RefreshCw,
  CreditCard,
  Bell,
  MessageSquare,
  User,
  Building2,
  BarChart,
  AlertTriangle,
  BookOpen,
  Map,
  Globe
} from "lucide-react";
import { Module } from "./types";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

// Enhanced hook: supports optional filters for dynamic queries
export function usePropertyLeads(filters?: Partial<PropertyLead>) {
  return useQuery<PropertyLead[], Error>({
    queryKey: ['property-leads', filters],
    queryFn: async () => {
      let query = supabase.from('properties').select('*').order('last_updated', { ascending: false });

      // Apply filters dynamically
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PropertyLead[];
    },
    staleTime: 60000, // 1 minute
  });
}

export const modules: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview of your financial portfolio and market insights",
    icon: "LayoutDashboard",
    category: "overview",
    navGroup: "dashboard",
    featured: true,
    seo: {
      title: "Dashboard | SomaTech",
      description: "Overview of your financial portfolio and market insights. Track investments, monitor performance, and stay updated with the latest market trends on SomaTech.",
      keywords: "dashboard, financial overview, portfolio, market insights, investment tracking, SomaTech"
    }
  },
  {
    id: "investor-guide",
    name: "Investor Guide",
    description: "A guided, top-down investing research and education experience.",
    icon: "BookOpen",
    category: "education",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "Investor Guide | SomaTech",
      description: "A guided, top-down investing research and education experience. Learn investment strategies, market analysis, and financial planning with SomaTech.",
      keywords: "investor guide, investing education, research, financial planning, market analysis, SomaTech"
    }
  },
  {
    id: "stock-analysis",
    name: "Stock Analysis",
    description: "Comprehensive stock research and technical analysis",
    icon: "TrendingUp",
    category: "investing",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "Stock Analysis | SomaTech",
      description: "Comprehensive stock research and technical analysis. Analyze stocks, trends, and market data to make informed investment decisions.",
      keywords: "stock analysis, technical analysis, stock research, market data, investment, SomaTech"
    }
  },
  {
    id: "pdufa",
    name: "PDUFA Calendar",
    description: "FDA Prescription Drug User Fee Act decision dates and alerts",
    icon: "Calendar",
    category: "investing",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "PDUFA Calendar | SomaTech",
      description: "Track FDA Prescription Drug User Fee Act decision dates with automated alerts and real-time updates. Monitor biotech and pharmaceutical company regulatory milestones.",
      keywords: "PDUFA, FDA calendar, drug approval dates, biotech, pharmaceutical, regulatory milestones, FDA decisions, SomaTech"
    }
  },
  {
    id: "earnings",
    name: "Earnings Calendar",
    description: "Track quarterly earnings announcements and financial results",
    icon: "DollarSign",
    category: "investing",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "Earnings Calendar | SomaTech",
      description: "Track quarterly earnings announcements and financial results with real-time updates. Monitor earnings dates, estimates, and actual results for informed investment decisions.",
      keywords: "earnings calendar, quarterly earnings, earnings announcements, financial results, earnings dates, stock earnings, SomaTech"
    }
  },
  {
    id: "trades",
    name: "Trade Analysis",
    description: "Connect brokerages, analyze trades, and review your trading performance.",
    icon: "BarChart3",
    category: "investing",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "Trade Analysis | SomaTech",
      description: "Connect brokerages, analyze trades, and review your trading performance. Optimize your trading strategy with SomaTech's analytics tools.",
      keywords: "trade analysis, trading performance, brokerage, trading strategy, analytics, SomaTech"
    }
  },
  {
    id: "watchlist",
    name: "Watchlist",
    description: "Track your favorite stocks and market movements",
    icon: "Eye",
    category: "investing",
    navGroup: "financial",
    featured: false,
    seo: {
      title: "Watchlist | SomaTech",
      description: "Track your favorite stocks and market movements. Create and manage your personalized watchlist for timely investment decisions.",
      keywords: "watchlist, stock tracking, market movements, investment, personalized watchlist, SomaTech"
    }
  },
  {
    id: "business-valuation",
    name: "Business Valuation",
    description: "Professional business valuation and analysis tools",
    icon: "Building2",
    category: "business",
    navGroup: "financial",
    featured: true,
    seo: {
      title: "Business Valuation | SomaTech",
      description: "Professional business valuation and analysis tools. Get accurate, real-time valuations for startups, SaaS, and more.",
      keywords: "business valuation, valuation tools, startup valuation, SaaS valuation, financial analysis, SomaTech"
    }
  },
  {
    id: "cash-flow",
    name: "Cash Flow Simulator",
    description: "Model and analyze business cash flows",
    icon: "DollarSign",
    category: "business",
    navGroup: "financial",
    featured: false,
    seo: {
      title: "Cash Flow Simulator | SomaTech",
      description: "Model and analyze business cash flows. Simulate scenarios and optimize your company's financial health with SomaTech.",
      keywords: "cash flow, cash flow simulator, business analysis, financial modeling, scenario simulation, SomaTech"
    }
  },
  {
    id: "retirement-planning",
    name: "Retirement Planning",
    description: "Plan your financial future with retirement tools",
    icon: "Calendar",
    category: "planning",
    navGroup: "financial",
    featured: false,
    seo: {
      title: "Retirement Planning | SomaTech",
      description: "Plan your financial future with retirement tools. Calculate retirement needs, analyze savings strategies, and optimize your retirement plan.",
      keywords: "retirement planning, retirement calculator, financial planning, retirement savings, investment planning, SomaTech"
    }
  },
  {
    id: "lead-gen",
    name: "Real Estate Leads",
    description: "Find investment properties across all 50 states with advanced search and analysis",
    icon: "Search",
    category: "real-estate",
    navGroup: "realEstate",
    featured: true,
    seo: {
      title: "Real Estate Leads | SomaTech",
      description: "Find investment properties across all 50 states. Search tax delinquent properties, pre-foreclosures, and high-equity opportunities with advanced filtering and analysis tools.",
      keywords: "real estate leads, property search, investment properties, tax delinquent, pre-foreclosure, real estate analysis, SomaTech"
    }
  },

  {
    id: "expanded-data-sources",
    name: "Expanded Data Sources",
    description: "Advanced real estate data integration with 100+ sources across all categories",
    icon: "Globe",
    category: "real-estate",
    navGroup: "realEstate",
    featured: true,
    seo: {
      title: "Expanded Data Sources | SomaTech",
      description: "Advanced real estate data integration with 100+ sources including MLS, auctions, court records, environmental data, demographics, and commercial properties.",
      keywords: "expanded data sources, real estate data integration, MLS data, auction data, court records, environmental data, demographics, commercial properties, SomaTech"
    }
  },
  {
    id: "database-test",
    name: "Database Test",
    description: "Test database connection and view all properties",
    icon: "Database",
    category: "debug",
    navGroup: "debug",
    featured: false,
    seo: {
      title: "Database Test | SomaTech",
      description: "Test database connection and view all properties in the database.",
      keywords: "database test, debug, properties, SomaTech"
    }
  },
  {
    id: "database-debug",
    name: "Database Debug",
    description: "Advanced database debugging and search testing",
    icon: "RefreshCw",
    category: "debug",
    navGroup: "debug",
    featured: false,
    seo: {
      title: "Database Debug | SomaTech",
      description: "Advanced database debugging and search testing tools.",
      keywords: "database debug, search test, debugging, SomaTech"
    }
  },
  {
    id: "account",
    name: "Account",
    description: "Manage your account settings and preferences",
    icon: "User",
    category: "account",
    navGroup: "account",
    featured: false,
    seo: {
      title: "Account | SomaTech",
      description: "Manage your account settings and preferences. Update your profile, security settings, and account information.",
      keywords: "account, settings, profile, security, preferences, SomaTech"
    }
  },
  {
    id: "settings",
    name: "Settings",
    description: "Configure application settings and preferences",
    icon: "Settings",
    category: "settings",
    navGroup: "settings",
    featured: false,
    seo: {
      title: "Settings | SomaTech",
      description: "Configure application settings and preferences. Customize your experience with SomaTech's powerful tools.",
      keywords: "settings, configuration, preferences, customization, SomaTech"
    }
  }
];

export const industryMultipliers: Record<string, number> = {
  "technology": 8,
  "healthcare": 6,
  "finance": 4,
  "retail": 3,
  "manufacturing": 2.5,
  "other": 3
};

export const industryOptions = [
  { value: "saas", label: "SaaS/Software" },
  { value: "technology", label: "Technology Hardware" },
  { value: "healthcare", label: "Healthcare/Biotech" },
  { value: "finance", label: "Financial Services" },
  { value: "retail", label: "Retail/E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional Services" },
  { value: "realestate", label: "Real Estate" },
  { value: "energy", label: "Energy/Utilities" },
  { value: "automotive", label: "Automotive" },
  { value: "food", label: "Food & Beverage" },
  { value: "media", label: "Media/Entertainment" },
  { value: "other", label: "Other" }
];

export const businessTypeOptions = [
  { value: "subscription", label: "Subscription-based" },
  { value: "product", label: "Product-based" },
  { value: "service", label: "Service-based" },
  { value: "marketplace", label: "Marketplace/Platform" },
  { value: "saas", label: "Software as a Service" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "retail", label: "Physical Retail" },
  { value: "manufacturing", label: "Manufacturing/Production" },
  { value: "consulting", label: "Consulting/Advisory" },
  { value: "franchise", label: "Franchise" }
];

export const valuationMultiples = {
  saas: { revenue: 6, ebitda: 15, pe: 25 },
  technology: { revenue: 4, ebitda: 12, pe: 20 },
  healthcare: { revenue: 3, ebitda: 10, pe: 18 },
  finance: { revenue: 2.5, ebitda: 8, pe: 12 },
  retail: { revenue: 1.5, ebitda: 6, pe: 15 },
  manufacturing: { revenue: 1.2, ebitda: 5, pe: 12 },
  services: { revenue: 2, ebitda: 7, pe: 16 },
  realestate: { revenue: 1.8, ebitda: 8, pe: 14 },
  energy: { revenue: 1.5, ebitda: 6, pe: 10 },
  automotive: { revenue: 1, ebitda: 5, pe: 12 },
  food: { revenue: 1.5, ebitda: 6, pe: 14 },
  media: { revenue: 2.5, ebitda: 8, pe: 18 },
  other: { revenue: 2, ebitda: 7, pe: 15 }
};

export const campaignCategories = [
  { value: "car", label: "Car/Vehicle" },
  { value: "education", label: "Education/Tuition" },
  { value: "business", label: "Business/Startup" },
  { value: "medical", label: "Medical/Health" },
  { value: "emergency", label: "Emergency Fund" },
  { value: "housing", label: "Housing/Rent" },
  { value: "other", label: "Other" }
];

export const donationAmounts = [10, 25, 50, 100, 250, 500];