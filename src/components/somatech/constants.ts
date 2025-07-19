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
  AlertTriangle
} from "lucide-react";
import { Module } from "./types";

export const modules: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview of your financial portfolio and market insights",
    icon: "LayoutDashboard",
    category: "overview",
    featured: true
  },
  {
    id: "stock-analysis",
    name: "Stock Analysis",
    description: "Comprehensive stock research and technical analysis",
    icon: "TrendingUp",
    category: "investing",
    featured: true
  },
  {
    id: "watchlist",
    name: "Watchlist",
    description: "Track your favorite stocks and market movements",
    icon: "Eye",
    category: "investing",
    featured: false
  },
  {
    id: "business-valuation",
    name: "Business Valuation",
    description: "Professional business valuation and analysis tools",
    icon: "Building2",
    category: "business",
    featured: true
  },
  {
    id: "cash-flow",
    name: "Cash Flow Simulator",
    description: "Model and analyze business cash flows",
    icon: "DollarSign",
    category: "business",
    featured: false
  },
  {
    id: "retirement-planning",
    name: "Retirement Planning",
    description: "Plan your financial future with retirement tools",
    icon: "Calendar",
    category: "planning",
    featured: false
  },
  {
    id: "real-estate",
    name: "Real Estate Calculator",
    description: "Real estate investment analysis and calculations",
    icon: "Home",
    category: "real-estate",
    featured: true
  },
  {
    id: "real-estate-deal-sourcing",
    name: "Deal Sourcing",
    description: "Access real estate leads from all 50 U.S. states",
    icon: "Search",
    category: "real-estate",
    featured: true
  },
  {
    id: "deal-sourcing-data-manager",
    name: "Data Manager",
    description: "Manage data sources and ingestion pipelines",
    icon: "Database",
    category: "real-estate",
    featured: false
  },
  {
    id: "data-ingestion-pipeline",
    name: "Data Pipeline",
    description: "Monitor automated data collection and processing",
    icon: "RefreshCw",
    category: "real-estate",
    featured: false
  },
  {
    id: "data-scraping-engine",
    name: "Scraping Engine",
    description: "Automated data collection from public sources",
    icon: "Database",
    category: "real-estate",
    featured: false
  },
  {
    id: "tax-delinquent-scraper",
    name: "Tax Delinquent Scraper",
    description: "Extract tax delinquent property data",
    icon: "DollarSign",
    category: "real-estate",
    featured: false
  },
  {
    id: "code-violation-scraper",
    name: "Code Violation Scraper",
    description: "Extract code violation property data",
    icon: "AlertTriangle",
    category: "real-estate",
    featured: false
  },
  {
    id: "pre-foreclosure-scraper",
    name: "Pre-Foreclosure Scraper",
    description: "Extract pre-foreclosure property data",
    icon: "Building2",
    category: "real-estate",
    featured: false
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Buy and sell businesses in the marketplace",
    icon: "Store",
    category: "business",
    featured: true
  },
  {
    id: "funding-campaigns",
    name: "Funding Campaigns",
    description: "Create and manage funding campaigns",
    icon: "Target",
    category: "business",
    featured: false
  },
  {
    id: "campaign-projection",
    name: "Campaign Projection",
    description: "Project and analyze funding campaign performance",
    icon: "BarChart3",
    category: "business",
    featured: false
  },
  {
    id: "subscription",
    name: "Subscription",
    description: "Manage your subscription and billing",
    icon: "CreditCard",
    category: "account",
    featured: false
  },
  {
    id: "enterprise-analytics",
    name: "Usage Analytics",
    description: "Advanced analytics and usage insights",
    icon: "BarChart",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-admin",
    name: "Admin Panel",
    description: "Administrative tools and user management",
    icon: "Settings",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-whitelabel",
    name: "White Label",
    description: "Customize branding and white label options",
    icon: "Palette",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-reporting",
    name: "Advanced Reporting",
    description: "Comprehensive reporting and analytics",
    icon: "FileText",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-performance",
    name: "Performance Monitoring",
    description: "Monitor system performance and metrics",
    icon: "Activity",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-success",
    name: "Customer Success",
    description: "Customer success and support tools",
    icon: "Users",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-security",
    name: "Security Audit",
    description: "Security monitoring and audit tools",
    icon: "Shield",
    category: "enterprise",
    featured: false
  },
  {
    id: "enterprise-tenant",
    name: "Multi-Tenant",
    description: "Multi-tenant architecture management",
    icon: "Building",
    category: "enterprise",
    featured: false
  },
  {
    id: "account-settings",
    name: "Account Settings",
    description: "Manage your account and preferences",
    icon: "User",
    category: "account",
    featured: false
  },
  {
    id: "user-dashboard",
    name: "User Dashboard",
    description: "Personal user dashboard and analytics",
    icon: "LayoutDashboard",
    category: "account",
    featured: false
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Manage notifications and alerts",
    icon: "Bell",
    category: "account",
    featured: false
  },
  {
    id: "feedback",
    name: "Feedback Hub",
    description: "Submit feedback and view responses",
    icon: "MessageSquare",
    category: "account",
    featured: false
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