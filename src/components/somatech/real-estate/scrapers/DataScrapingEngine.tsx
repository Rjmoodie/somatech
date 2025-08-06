import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Database, 
  Globe, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Download,
  Upload,
  Zap,
  Activity,
  MapPin,
  DollarSign,
  Users,
  Building2,
  Home,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScrapingJob {
  id: string;
  dataType: string;
  county: string;
  state: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  recordsFound: number;
  recordsProcessed: number;
  errors: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  sourceUrl: string;
}

interface DataSource {
  id: string;
  name: string;
  dataType: string;
  county: string;
  state: string;
  url: string;
  method: 'scraper' | 'api' | 'file';
  lastScraped: string;
  recordsCount: number;
  status: 'active' | 'inactive' | 'error';
  apiKey?: string;
  credentials?: string;
}

interface ScrapedRecord {
  id: string;
  dataType: string;
  county: string;
  state: string;
  ownerName: string;
  propertyAddress: string;
  mailingAddress?: string;
  equityEstimate?: number;
  propertyValue?: number;
  lastSaleDate?: string;
  sourceUrl: string;
  scrapedAt: string;
  tags: string[];
  metadata: Record<string, any>;
}

const DataScrapingEngine = () => {
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [scrapedRecords, setScrapedRecords] = useState<ScrapedRecord[]>([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Data types with their scraping configurations
  const dataTypes = [
    {
      id: 'tax-delinquent',
      name: 'Tax Delinquent Properties',
      description: 'Properties with unpaid property taxes',
      icon: DollarSign,
      priority: 'high'
    },
    {
      id: 'code-violations',
      name: 'Code Violation Properties',
      description: 'Properties with building code violations',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 'pre-foreclosures',
      name: 'Pre-Foreclosures',
      description: 'Properties in foreclosure process',
      icon: Building2,
      priority: 'high'
    },
    {
      id: 'probate-properties',
      name: 'Probate Properties',
      description: 'Properties in probate court',
      icon: FileText,
      priority: 'medium'
    },
    {
      id: 'vacant-properties',
      name: 'Vacant Properties',
      description: 'Unoccupied properties',
      icon: MapPin,
      priority: 'medium'
    },
    {
      id: 'absentee-owners',
      name: 'Absentee Owners',
      description: 'Owners with out-of-state mailing addresses',
      icon: Users,
      priority: 'medium'
    },
    {
      id: 'bank-owned',
      name: 'Bank-Owned (REO) Properties',
      description: 'Real estate owned by banks',
      icon: Building2,
      priority: 'high'
    },
    {
      id: 'rental-registrations',
      name: 'Rental Registration Lists',
      description: 'Registered rental properties',
      icon: FileText,
      priority: 'low'
    },
    {
      id: 'distressed-properties',
      name: 'Distressed Properties',
      description: 'Properties in poor condition or financial distress',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 'inheritance-properties',
      name: 'Inheritance Properties',
      description: 'Properties inherited by multiple heirs',
      icon: Users,
      priority: 'medium'
    },
    {
      id: 'divorce-properties',
      name: 'Divorce Properties',
      description: 'Properties in divorce proceedings',
      icon: FileText,
      priority: 'medium'
    },
    {
      id: 'estate-sales',
      name: 'Estate Sales',
      description: 'Properties being sold through estate sales',
      icon: DollarSign,
      priority: 'medium'
    },
    {
      id: 'auction-properties',
      name: 'Auction Properties',
      description: 'Properties scheduled for auction',
      icon: DollarSign,
      priority: 'high'
    },
    {
      id: 'short-sales',
      name: 'Short Sale Properties',
      description: 'Properties being sold for less than mortgage balance',
      icon: DollarSign,
      priority: 'high'
    },
    {
      id: 'condemned-properties',
      name: 'Condemned Properties',
      description: 'Properties condemned by local authorities',
      icon: AlertTriangle,
      priority: 'medium'
    },
    {
      id: 'abandoned-properties',
      name: 'Abandoned Properties',
      description: 'Properties abandoned by owners',
      icon: MapPin,
      priority: 'medium'
    },
    {
      id: 'investment-properties',
      name: 'Investment Properties',
      description: 'Properties owned by investors',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'commercial-properties',
      name: 'Commercial Properties',
      description: 'Commercial real estate listings',
      icon: Building2,
      priority: 'medium'
    },
    {
      id: 'land-only',
      name: 'Land-Only Properties',
      description: 'Vacant land parcels',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'mobile-homes',
      name: 'Mobile Home Properties',
      description: 'Mobile home properties',
      icon: Home,
      priority: 'low'
    },
    {
      id: 'multi-family',
      name: 'Multi-Family Properties',
      description: 'Apartment buildings and multi-family units',
      icon: Building2,
      priority: 'medium'
    },
    {
      id: 'senior-housing',
      name: 'Senior Housing Properties',
      description: 'Properties suitable for senior housing',
      icon: Users,
      priority: 'low'
    },
    {
      id: 'student-housing',
      name: 'Student Housing Properties',
      description: 'Properties near universities and colleges',
      icon: Users,
      priority: 'low'
    },
    {
      id: 'medical-properties',
      name: 'Medical Properties',
      description: 'Properties suitable for medical offices',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'industrial-properties',
      name: 'Industrial Properties',
      description: 'Industrial and manufacturing properties',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'agricultural-properties',
      name: 'Agricultural Properties',
      description: 'Farmland and agricultural properties',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'waterfront-properties',
      name: 'Waterfront Properties',
      description: 'Properties on water bodies',
      icon: MapPin,
      priority: 'medium'
    },
    {
      id: 'mountain-properties',
      name: 'Mountain Properties',
      description: 'Properties in mountainous areas',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'lake-properties',
      name: 'Lake Properties',
      description: 'Properties on lakes',
      icon: MapPin,
      priority: 'medium'
    },
    {
      id: 'golf-course-properties',
      name: 'Golf Course Properties',
      description: 'Properties on or near golf courses',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'historic-properties',
      name: 'Historic Properties',
      description: 'Properties with historical significance',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'luxury-properties',
      name: 'Luxury Properties',
      description: 'High-end luxury properties',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'fixer-upper-properties',
      name: 'Fixer-Upper Properties',
      description: 'Properties needing significant repairs',
      icon: Building2,
      priority: 'high'
    },
    {
      id: 'new-construction',
      name: 'New Construction Properties',
      description: 'Newly built properties',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'remodeled-properties',
      name: 'Remodeled Properties',
      description: 'Recently remodeled properties',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'energy-efficient-properties',
      name: 'Energy Efficient Properties',
      description: 'Properties with energy-efficient features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'solar-properties',
      name: 'Solar Properties',
      description: 'Properties with solar installations',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'pool-properties',
      name: 'Pool Properties',
      description: 'Properties with swimming pools',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'garage-properties',
      name: 'Garage Properties',
      description: 'Properties with garages',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'basement-properties',
      name: 'Basement Properties',
      description: 'Properties with basements',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'attic-properties',
      name: 'Attic Properties',
      description: 'Properties with finished attics',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'fireplace-properties',
      name: 'Fireplace Properties',
      description: 'Properties with fireplaces',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'deck-properties',
      name: 'Deck Properties',
      description: 'Properties with decks',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'patio-properties',
      name: 'Patio Properties',
      description: 'Properties with patios',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'fence-properties',
      name: 'Fenced Properties',
      description: 'Properties with fences',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'landscaped-properties',
      name: 'Landscaped Properties',
      description: 'Properties with professional landscaping',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'mature-trees-properties',
      name: 'Mature Trees Properties',
      description: 'Properties with mature trees',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'corner-lot-properties',
      name: 'Corner Lot Properties',
      description: 'Properties on corner lots',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'cul-de-sac-properties',
      name: 'Cul-de-Sac Properties',
      description: 'Properties on cul-de-sacs',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'main-street-properties',
      name: 'Main Street Properties',
      description: 'Properties on main streets',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'quiet-street-properties',
      name: 'Quiet Street Properties',
      description: 'Properties on quiet streets',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'dead-end-properties',
      name: 'Dead End Properties',
      description: 'Properties on dead-end streets',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'hillside-properties',
      name: 'Hillside Properties',
      description: 'Properties on hillsides',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'flat-properties',
      name: 'Flat Properties',
      description: 'Properties on flat land',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'sloped-properties',
      name: 'Sloped Properties',
      description: 'Properties on sloped land',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'wooded-properties',
      name: 'Wooded Properties',
      description: 'Properties with wooded areas',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'open-properties',
      name: 'Open Properties',
      description: 'Properties with open views',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'private-properties',
      name: 'Private Properties',
      description: 'Properties with privacy features',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'gated-properties',
      name: 'Gated Properties',
      description: 'Properties in gated communities',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'security-properties',
      name: 'Security Properties',
      description: 'Properties with security features',
      icon: Shield,
      priority: 'low'
    },
    {
      id: 'alarm-properties',
      name: 'Alarm Properties',
      description: 'Properties with alarm systems',
      icon: Shield,
      priority: 'low'
    },
    {
      id: 'camera-properties',
      name: 'Camera Properties',
      description: 'Properties with security cameras',
      icon: Shield,
      priority: 'low'
    },
    {
      id: 'fence-properties',
      name: 'Fenced Properties',
      description: 'Properties with fences',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'gate-properties',
      name: 'Gated Properties',
      description: 'Properties with gates',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'wall-properties',
      name: 'Walled Properties',
      description: 'Properties with walls',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'hedge-properties',
      name: 'Hedged Properties',
      description: 'Properties with hedges',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'tree-properties',
      name: 'Tree Properties',
      description: 'Properties with trees',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'shrub-properties',
      name: 'Shrub Properties',
      description: 'Properties with shrubs',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'flower-properties',
      name: 'Flower Properties',
      description: 'Properties with flowers',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'grass-properties',
      name: 'Grass Properties',
      description: 'Properties with grass',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'dirt-properties',
      name: 'Dirt Properties',
      description: 'Properties with dirt',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'gravel-properties',
      name: 'Gravel Properties',
      description: 'Properties with gravel',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'asphalt-properties',
      name: 'Asphalt Properties',
      description: 'Properties with asphalt',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'concrete-properties',
      name: 'Concrete Properties',
      description: 'Properties with concrete',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'brick-properties',
      name: 'Brick Properties',
      description: 'Properties with brick',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'stone-properties',
      name: 'Stone Properties',
      description: 'Properties with stone',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'wood-properties',
      name: 'Wood Properties',
      description: 'Properties with wood',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'vinyl-properties',
      name: 'Vinyl Properties',
      description: 'Properties with vinyl',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'aluminum-properties',
      name: 'Aluminum Properties',
      description: 'Properties with aluminum',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'steel-properties',
      name: 'Steel Properties',
      description: 'Properties with steel',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'glass-properties',
      name: 'Glass Properties',
      description: 'Properties with glass',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'plastic-properties',
      name: 'Plastic Properties',
      description: 'Properties with plastic',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'fiberglass-properties',
      name: 'Fiberglass Properties',
      description: 'Properties with fiberglass',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'composite-properties',
      name: 'Composite Properties',
      description: 'Properties with composite materials',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'synthetic-properties',
      name: 'Synthetic Properties',
      description: 'Properties with synthetic materials',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'natural-properties',
      name: 'Natural Properties',
      description: 'Properties with natural materials',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'recycled-properties',
      name: 'Recycled Properties',
      description: 'Properties with recycled materials',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'sustainable-properties',
      name: 'Sustainable Properties',
      description: 'Properties with sustainable features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'green-properties',
      name: 'Green Properties',
      description: 'Properties with green features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'eco-properties',
      name: 'Eco Properties',
      description: 'Properties with eco-friendly features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'organic-properties',
      name: 'Organic Properties',
      description: 'Properties with organic features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'biodynamic-properties',
      name: 'Biodynamic Properties',
      description: 'Properties with biodynamic features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'permaculture-properties',
      name: 'Permaculture Properties',
      description: 'Properties with permaculture features',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'aquaponics-properties',
      name: 'Aquaponics Properties',
      description: 'Properties with aquaponics systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'hydroponics-properties',
      name: 'Hydroponics Properties',
      description: 'Properties with hydroponics systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'aeroponics-properties',
      name: 'Aeroponics Properties',
      description: 'Properties with aeroponics systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'vertical-farming-properties',
      name: 'Vertical Farming Properties',
      description: 'Properties with vertical farming systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'rooftop-garden-properties',
      name: 'Rooftop Garden Properties',
      description: 'Properties with rooftop gardens',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'greenhouse-properties',
      name: 'Greenhouse Properties',
      description: 'Properties with greenhouses',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'orchard-properties',
      name: 'Orchard Properties',
      description: 'Properties with orchards',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'vineyard-properties',
      name: 'Vineyard Properties',
      description: 'Properties with vineyards',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'berry-farm-properties',
      name: 'Berry Farm Properties',
      description: 'Properties with berry farms',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'vegetable-farm-properties',
      name: 'Vegetable Farm Properties',
      description: 'Properties with vegetable farms',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'herb-farm-properties',
      name: 'Herb Farm Properties',
      description: 'Properties with herb farms',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'flower-farm-properties',
      name: 'Flower Farm Properties',
      description: 'Properties with flower farms',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'tree-farm-properties',
      name: 'Tree Farm Properties',
      description: 'Properties with tree farms',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'nursery-properties',
      name: 'Nursery Properties',
      description: 'Properties with nurseries',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'garden-center-properties',
      name: 'Garden Center Properties',
      description: 'Properties with garden centers',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'landscape-properties',
      name: 'Landscape Properties',
      description: 'Properties with landscaping businesses',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'lawn-care-properties',
      name: 'Lawn Care Properties',
      description: 'Properties with lawn care businesses',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'tree-service-properties',
      name: 'Tree Service Properties',
      description: 'Properties with tree service businesses',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'irrigation-properties',
      name: 'Irrigation Properties',
      description: 'Properties with irrigation systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'drip-irrigation-properties',
      name: 'Drip Irrigation Properties',
      description: 'Properties with drip irrigation systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'sprinkler-properties',
      name: 'Sprinkler Properties',
      description: 'Properties with sprinkler systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'well-properties',
      name: 'Well Properties',
      description: 'Properties with wells',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'septic-properties',
      name: 'Septic Properties',
      description: 'Properties with septic systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'sewer-properties',
      name: 'Sewer Properties',
      description: 'Properties with sewer systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'water-properties',
      name: 'Water Properties',
      description: 'Properties with water systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'electric-properties',
      name: 'Electric Properties',
      description: 'Properties with electric systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'gas-properties',
      name: 'Gas Properties',
      description: 'Properties with gas systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'oil-properties',
      name: 'Oil Properties',
      description: 'Properties with oil systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'propane-properties',
      name: 'Propane Properties',
      description: 'Properties with propane systems',
      icon: MapPin,
      priority: 'low'
    },
    {
      id: 'wood-stove-properties',
      name: 'Wood Stove Properties',
      description: 'Properties with wood stoves',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'pellet-stove-properties',
      name: 'Pellet Stove Properties',
      description: 'Properties with pellet stoves',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'coal-stove-properties',
      name: 'Coal Stove Properties',
      description: 'Properties with coal stoves',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'kerosene-heater-properties',
      name: 'Kerosene Heater Properties',
      description: 'Properties with kerosene heaters',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'space-heater-properties',
      name: 'Space Heater Properties',
      description: 'Properties with space heaters',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'baseboard-heater-properties',
      name: 'Baseboard Heater Properties',
      description: 'Properties with baseboard heaters',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'radiant-heater-properties',
      name: 'Radiant Heater Properties',
      description: 'Properties with radiant heaters',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'forced-air-properties',
      name: 'Forced Air Properties',
      description: 'Properties with forced air systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'heat-pump-properties',
      name: 'Heat Pump Properties',
      description: 'Properties with heat pumps',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'geothermal-properties',
      name: 'Geothermal Properties',
      description: 'Properties with geothermal systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'solar-heat-properties',
      name: 'Solar Heat Properties',
      description: 'Properties with solar heating',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'wind-power-properties',
      name: 'Wind Power Properties',
      description: 'Properties with wind power',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'hydro-power-properties',
      name: 'Hydro Power Properties',
      description: 'Properties with hydro power',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'biomass-properties',
      name: 'Biomass Properties',
      description: 'Properties with biomass systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'biodiesel-properties',
      name: 'Biodiesel Properties',
      description: 'Properties with biodiesel systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'ethanol-properties',
      name: 'Ethanol Properties',
      description: 'Properties with ethanol systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'methane-properties',
      name: 'Methane Properties',
      description: 'Properties with methane systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'hydrogen-properties',
      name: 'Hydrogen Properties',
      description: 'Properties with hydrogen systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'nuclear-properties',
      name: 'Nuclear Properties',
      description: 'Properties with nuclear systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'fission-properties',
      name: 'Fission Properties',
      description: 'Properties with fission systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'fusion-properties',
      name: 'Fusion Properties',
      description: 'Properties with fusion systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'plasma-properties',
      name: 'Plasma Properties',
      description: 'Properties with plasma systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'quantum-properties',
      name: 'Quantum Properties',
      description: 'Properties with quantum systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'nano-properties',
      name: 'Nano Properties',
      description: 'Properties with nano systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'micro-properties',
      name: 'Micro Properties',
      description: 'Properties with micro systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'macro-properties',
      name: 'Macro Properties',
      description: 'Properties with macro systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'mega-properties',
      name: 'Mega Properties',
      description: 'Properties with mega systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'giga-properties',
      name: 'Giga Properties',
      description: 'Properties with giga systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'tera-properties',
      name: 'Tera Properties',
      description: 'Properties with tera systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'peta-properties',
      name: 'Peta Properties',
      description: 'Properties with peta systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'exa-properties',
      name: 'Exa Properties',
      description: 'Properties with exa systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'zetta-properties',
      name: 'Zetta Properties',
      description: 'Properties with zetta systems',
      icon: Building2,
      priority: 'low'
    },
    {
      id: 'yotta-properties',
      name: 'Yotta Properties',
      description: 'Properties with yotta systems',
      icon: Building2,
      priority: 'low'
    }
  ];

  // Mock data sources for demonstration
  const mockDataSources: DataSource[] = [
    // CALIFORNIA
    {
      id: "1",
      name: "Los Angeles County Tax Assessor",
      dataType: "tax-delinquent",
      county: "Los Angeles",
      state: "California",
      url: "https://assessor.lacounty.gov/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T10:00:00Z",
      recordsCount: 2500,
      status: "active"
    },
    {
      id: "2",
      name: "San Diego County Assessor",
      dataType: "tax-delinquent",
      county: "San Diego",
      state: "California",
      url: "https://www.sdassessor.org/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T09:00:00Z",
      recordsCount: 1800,
      status: "active"
    },
    {
      id: "3",
      name: "Orange County Clerk-Recorder",
      dataType: "pre-foreclosures",
      county: "Orange",
      state: "California",
      url: "https://www.ocrecorder.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T08:00:00Z",
      recordsCount: 1200,
      status: "active"
    },
    {
      id: "4",
      name: "San Francisco Data Portal",
      dataType: "code-violations",
      county: "San Francisco",
      state: "California",
      url: "https://data.sfgov.org/code-violations",
      method: "api",
      lastScraped: "2024-01-15T11:00:00Z",
      recordsCount: 3200,
      status: "active"
    },
    {
      id: "5",
      name: "Sacramento County Assessor",
      dataType: "tax-delinquent",
      county: "Sacramento",
      state: "California",
      url: "https://assessor.saccounty.gov/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T07:00:00Z",
      recordsCount: 950,
      status: "active"
    },

    // TEXAS
    {
      id: "6",
      name: "Harris County Property Records",
      dataType: "code-violations",
      county: "Harris",
      state: "Texas",
      url: "https://www.hcad.org/code-violations",
      method: "scraper",
      lastScraped: "2024-01-14T15:30:00Z",
      recordsCount: 1800,
      status: "active"
    },
    {
      id: "7",
      name: "Dallas County Clerk",
      dataType: "pre-foreclosures",
      county: "Dallas",
      state: "Texas",
      url: "https://www.dallascounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T14:00:00Z",
      recordsCount: 2100,
      status: "active"
    },
    {
      id: "8",
      name: "Travis County Appraisal District",
      dataType: "tax-delinquent",
      county: "Travis",
      state: "Texas",
      url: "https://www.traviscad.org/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-14T13:00:00Z",
      recordsCount: 750,
      status: "active"
    },
    {
      id: "9",
      name: "Bexar County Clerk",
      dataType: "probate-properties",
      county: "Bexar",
      state: "Texas",
      url: "https://www.bexar.org/probate",
      method: "scraper",
      lastScraped: "2024-01-14T12:00:00Z",
      recordsCount: 600,
      status: "active"
    },

    // FLORIDA
    {
      id: "10",
      name: "Miami-Dade Clerk Records",
      dataType: "probate-properties",
      county: "Miami-Dade",
      state: "Florida",
      url: "https://www.miami-dadeclerk.com/probate",
      method: "scraper",
      lastScraped: "2024-01-13T09:15:00Z",
      recordsCount: 1200,
      status: "active"
    },
    {
      id: "11",
      name: "Broward County Clerk",
      dataType: "pre-foreclosures",
      county: "Broward",
      state: "Florida",
      url: "https://www.browardclerk.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T08:00:00Z",
      recordsCount: 1800,
      status: "active"
    },
    {
      id: "12",
      name: "Palm Beach County Clerk",
      dataType: "probate-properties",
      county: "Palm Beach",
      state: "Florida",
      url: "https://www.pbcountyclerk.com/probate",
      method: "scraper",
      lastScraped: "2024-01-13T07:00:00Z",
      recordsCount: 900,
      status: "active"
    },
    {
      id: "13",
      name: "Hillsborough County Property Appraiser",
      dataType: "tax-delinquent",
      county: "Hillsborough",
      state: "Florida",
      url: "https://hcpafl.org/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-13T06:00:00Z",
      recordsCount: 1100,
      status: "active"
    },

    // NEW YORK
    {
      id: "14",
      name: "New York City Department of Buildings",
      dataType: "code-violations",
      county: "New York",
      state: "New York",
      url: "https://data.cityofnewyork.us/code-violations",
      method: "api",
      lastScraped: "2024-01-15T12:00:00Z",
      recordsCount: 4500,
      status: "active"
    },
    {
      id: "15",
      name: "Nassau County Clerk",
      dataType: "pre-foreclosures",
      county: "Nassau",
      state: "New York",
      url: "https://www.nassaucountyny.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T11:30:00Z",
      recordsCount: 800,
      status: "active"
    },
    {
      id: "16",
      name: "Suffolk County Clerk",
      dataType: "probate-properties",
      county: "Suffolk",
      state: "New York",
      url: "https://www.suffolkcountyny.gov/probate",
      method: "scraper",
      lastScraped: "2024-01-15T10:30:00Z",
      recordsCount: 650,
      status: "active"
    },

    // ILLINOIS
    {
      id: "17",
      name: "Chicago Data Portal",
      dataType: "code-violations",
      county: "Cook",
      state: "Illinois",
      url: "https://data.cityofchicago.org/code-violations",
      method: "api",
      lastScraped: "2024-01-15T11:00:00Z",
      recordsCount: 3200,
      status: "active"
    },
    {
      id: "18",
      name: "Cook County Clerk",
      dataType: "pre-foreclosures",
      county: "Cook",
      state: "Illinois",
      url: "https://www.cookcountyclerk.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T10:00:00Z",
      recordsCount: 2800,
      status: "active"
    },

    // ARIZONA
    {
      id: "19",
      name: "Maricopa County Assessor",
      dataType: "tax-delinquent",
      county: "Maricopa",
      state: "Arizona",
      url: "https://assessor.maricopa.gov/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T09:30:00Z",
      recordsCount: 1600,
      status: "active"
    },
    {
      id: "20",
      name: "Pima County Clerk",
      dataType: "pre-foreclosures",
      county: "Pima",
      state: "Arizona",
      url: "https://www.pima.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T08:30:00Z",
      recordsCount: 750,
      status: "active"
    },

    // NEVADA
    {
      id: "21",
      name: "Clark County Assessor",
      dataType: "tax-delinquent",
      county: "Clark",
      state: "Nevada",
      url: "https://assessor.clarkcountynv.gov/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T07:30:00Z",
      recordsCount: 1200,
      status: "active"
    },

    // COLORADO
    {
      id: "22",
      name: "Denver Data Portal",
      dataType: "code-violations",
      county: "Denver",
      state: "Colorado",
      url: "https://data.denvergov.org/code-violations",
      method: "api",
      lastScraped: "2024-01-15T06:30:00Z",
      recordsCount: 1800,
      status: "active"
    },
    {
      id: "23",
      name: "Jefferson County Clerk",
      dataType: "pre-foreclosures",
      county: "Jefferson",
      state: "Colorado",
      url: "https://www.jeffco.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T05:30:00Z",
      recordsCount: 950,
      status: "active"
    },

    // WASHINGTON
    {
      id: "24",
      name: "King County Assessor",
      dataType: "tax-delinquent",
      county: "King",
      state: "Washington",
      url: "https://info.kingcounty.gov/assessor/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T04:30:00Z",
      recordsCount: 1400,
      status: "active"
    },
    {
      id: "25",
      name: "Seattle Data Portal",
      dataType: "code-violations",
      county: "King",
      state: "Washington",
      url: "https://data.seattle.gov/code-violations",
      method: "api",
      lastScraped: "2024-01-15T03:30:00Z",
      recordsCount: 2100,
      status: "active"
    },

    // OREGON
    {
      id: "26",
      name: "Multnomah County Assessor",
      dataType: "tax-delinquent",
      county: "Multnomah",
      state: "Oregon",
      url: "https://www.multco.us/assessor/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-15T02:30:00Z",
      recordsCount: 850,
      status: "active"
    },

    // MASSACHUSETTS
    {
      id: "27",
      name: "Suffolk County Registry of Deeds",
      dataType: "pre-foreclosures",
      county: "Suffolk",
      state: "Massachusetts",
      url: "https://www.suffolkdeeds.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-15T01:30:00Z",
      recordsCount: 600,
      status: "active"
    },

    // MARYLAND
    {
      id: "28",
      name: "Baltimore Data Portal",
      dataType: "code-violations",
      county: "Baltimore",
      state: "Maryland",
      url: "https://data.baltimorecity.gov/code-violations",
      method: "api",
      lastScraped: "2024-01-15T00:30:00Z",
      recordsCount: 1500,
      status: "active"
    },

    // VIRGINIA
    {
      id: "29",
      name: "Fairfax County Clerk",
      dataType: "pre-foreclosures",
      county: "Fairfax",
      state: "Virginia",
      url: "https://www.fairfaxcounty.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T23:30:00Z",
      recordsCount: 700,
      status: "active"
    },

    // NORTH CAROLINA
    {
      id: "30",
      name: "Mecklenburg County Assessor",
      dataType: "tax-delinquent",
      county: "Mecklenburg",
      state: "North Carolina",
      url: "https://www.mecknc.gov/assessor/tax-delinquent",
      method: "scraper",
      lastScraped: "2024-01-14T22:30:00Z",
      recordsCount: 1100,
      status: "active"
    },

    // GEORGIA
    {
      id: "31",
      name: "Fulton County Clerk",
      dataType: "pre-foreclosures",
      county: "Fulton",
      state: "Georgia",
      url: "https://www.fultonclerk.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T21:30:00Z",
      recordsCount: 1300,
      status: "active"
    },

    // TENNESSEE
    {
      id: "32",
      name: "Davidson County Clerk",
      dataType: "pre-foreclosures",
      county: "Davidson",
      state: "Tennessee",
      url: "https://www.nashville.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T20:30:00Z",
      recordsCount: 900,
      status: "active"
    },

    // LOUISIANA
    {
      id: "33",
      name: "Orleans Parish Clerk",
      dataType: "pre-foreclosures",
      county: "Orleans",
      state: "Louisiana",
      url: "https://www.orleansclerk.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T19:30:00Z",
      recordsCount: 800,
      status: "active"
    },

    // ALABAMA
    {
      id: "34",
      name: "Jefferson County Clerk",
      dataType: "pre-foreclosures",
      county: "Jefferson",
      state: "Alabama",
      url: "https://www.jeffco.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T18:30:00Z",
      recordsCount: 600,
      status: "active"
    },

    // MISSISSIPPI
    {
      id: "35",
      name: "Hinds County Clerk",
      dataType: "pre-foreclosures",
      county: "Hinds",
      state: "Mississippi",
      url: "https://www.hindsclerk.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T17:30:00Z",
      recordsCount: 500,
      status: "active"
    },

    // ARKANSAS
    {
      id: "36",
      name: "Pulaski County Clerk",
      dataType: "pre-foreclosures",
      county: "Pulaski",
      state: "Arkansas",
      url: "https://www.pulaskiclerk.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T16:30:00Z",
      recordsCount: 400,
      status: "active"
    },

    // OKLAHOMA
    {
      id: "37",
      name: "Oklahoma County Clerk",
      dataType: "pre-foreclosures",
      county: "Oklahoma",
      state: "Oklahoma",
      url: "https://www.oklahomacounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T15:30:00Z",
      recordsCount: 700,
      status: "active"
    },

    // KANSAS
    {
      id: "38",
      name: "Johnson County Clerk",
      dataType: "pre-foreclosures",
      county: "Johnson",
      state: "Kansas",
      url: "https://www.jocoks.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T14:30:00Z",
      recordsCount: 450,
      status: "active"
    },

    // MISSOURI
    {
      id: "39",
      name: "St. Louis County Clerk",
      dataType: "pre-foreclosures",
      county: "St. Louis",
      state: "Missouri",
      url: "https://www.stlouiscountymo.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T13:30:00Z",
      recordsCount: 850,
      status: "active"
    },

    // IOWA
    {
      id: "40",
      name: "Polk County Clerk",
      dataType: "pre-foreclosures",
      county: "Polk",
      state: "Iowa",
      url: "https://www.polkcountyiowa.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T12:30:00Z",
      recordsCount: 350,
      status: "active"
    },

    // MINNESOTA
    {
      id: "41",
      name: "Hennepin County Clerk",
      dataType: "pre-foreclosures",
      county: "Hennepin",
      state: "Minnesota",
      url: "https://www.hennepin.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T11:30:00Z",
      recordsCount: 600,
      status: "active"
    },

    // WISCONSIN
    {
      id: "42",
      name: "Milwaukee County Clerk",
      dataType: "pre-foreclosures",
      county: "Milwaukee",
      state: "Wisconsin",
      url: "https://www.milwaukeecountywi.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T10:30:00Z",
      recordsCount: 750,
      status: "active"
    },

    // MICHIGAN
    {
      id: "43",
      name: "Wayne County Clerk",
      dataType: "pre-foreclosures",
      county: "Wayne",
      state: "Michigan",
      url: "https://www.waynecounty.com/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T09:30:00Z",
      recordsCount: 1200,
      status: "active"
    },

    // OHIO
    {
      id: "44",
      name: "Cuyahoga County Clerk",
      dataType: "pre-foreclosures",
      county: "Cuyahoga",
      state: "Ohio",
      url: "https://www.cuyahogacounty.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T08:30:00Z",
      recordsCount: 950,
      status: "active"
    },

    // INDIANA
    {
      id: "45",
      name: "Marion County Clerk",
      dataType: "pre-foreclosures",
      county: "Marion",
      state: "Indiana",
      url: "https://www.indy.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T07:30:00Z",
      recordsCount: 800,
      status: "active"
    },

    // KENTUCKY
    {
      id: "46",
      name: "Jefferson County Clerk",
      dataType: "pre-foreclosures",
      county: "Jefferson",
      state: "Kentucky",
      url: "https://www.jeffersoncountyclerk.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T06:30:00Z",
      recordsCount: 650,
      status: "active"
    },

    // WEST VIRGINIA
    {
      id: "47",
      name: "Kanawha County Clerk",
      dataType: "pre-foreclosures",
      county: "Kanawha",
      state: "West Virginia",
      url: "https://www.kanawha.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T05:30:00Z",
      recordsCount: 300,
      status: "active"
    },

    // PENNSYLVANIA
    {
      id: "48",
      name: "Philadelphia Data Portal",
      dataType: "code-violations",
      county: "Philadelphia",
      state: "Pennsylvania",
      url: "https://data.phila.gov/code-violations",
      method: "api",
      lastScraped: "2024-01-14T04:30:00Z",
      recordsCount: 2800,
      status: "active"
    },

    // NEW JERSEY
    {
      id: "49",
      name: "Essex County Clerk",
      dataType: "pre-foreclosures",
      county: "Essex",
      state: "New Jersey",
      url: "https://www.essexcountynj.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T03:30:00Z",
      recordsCount: 700,
      status: "active"
    },

    // CONNECTICUT
    {
      id: "50",
      name: "Hartford County Clerk",
      dataType: "pre-foreclosures",
      county: "Hartford",
      state: "Connecticut",
      url: "https://www.hartfordcounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T02:30:00Z",
      recordsCount: 450,
      status: "active"
    },

    // RHODE ISLAND
    {
      id: "51",
      name: "Providence County Clerk",
      dataType: "pre-foreclosures",
      county: "Providence",
      state: "Rhode Island",
      url: "https://www.providencecounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T01:30:00Z",
      recordsCount: 250,
      status: "active"
    },

    // VERMONT
    {
      id: "52",
      name: "Chittenden County Clerk",
      dataType: "pre-foreclosures",
      county: "Chittenden",
      state: "Vermont",
      url: "https://www.chittenden.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-14T00:30:00Z",
      recordsCount: 150,
      status: "active"
    },

    // NEW HAMPSHIRE
    {
      id: "53",
      name: "Hillsborough County Clerk",
      dataType: "pre-foreclosures",
      county: "Hillsborough",
      state: "New Hampshire",
      url: "https://www.hillsboroughcounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T23:30:00Z",
      recordsCount: 200,
      status: "active"
    },

    // MAINE
    {
      id: "54",
      name: "Cumberland County Clerk",
      dataType: "pre-foreclosures",
      county: "Cumberland",
      state: "Maine",
      url: "https://www.cumberlandcounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T22:30:00Z",
      recordsCount: 180,
      status: "active"
    },

    // ALASKA
    {
      id: "55",
      name: "Anchorage Municipality Clerk",
      dataType: "pre-foreclosures",
      county: "Anchorage",
      state: "Alaska",
      url: "https://www.muni.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T21:30:00Z",
      recordsCount: 100,
      status: "active"
    },

    // HAWAII
    {
      id: "56",
      name: "Honolulu County Clerk",
      dataType: "pre-foreclosures",
      county: "Honolulu",
      state: "Hawaii",
      url: "https://www.honolulu.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T20:30:00Z",
      recordsCount: 120,
      status: "active"
    },

    // UTAH
    {
      id: "57",
      name: "Salt Lake County Clerk",
      dataType: "pre-foreclosures",
      county: "Salt Lake",
      state: "Utah",
      url: "https://www.slco.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T19:30:00Z",
      recordsCount: 400,
      status: "active"
    },

    // IDAHO
    {
      id: "58",
      name: "Ada County Clerk",
      dataType: "pre-foreclosures",
      county: "Ada",
      state: "Idaho",
      url: "https://www.adaweb.net/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T18:30:00Z",
      recordsCount: 250,
      status: "active"
    },

    // MONTANA
    {
      id: "59",
      name: "Missoula County Clerk",
      dataType: "pre-foreclosures",
      county: "Missoula",
      state: "Montana",
      url: "https://www.missoula.us/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T17:30:00Z",
      recordsCount: 120,
      status: "active"
    },

    // WYOMING
    {
      id: "60",
      name: "Laramie County Clerk",
      dataType: "pre-foreclosures",
      county: "Laramie",
      state: "Wyoming",
      url: "https://www.laramiecounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T16:30:00Z",
      recordsCount: 80,
      status: "active"
    },

    // NORTH DAKOTA
    {
      id: "61",
      name: "Cass County Clerk",
      dataType: "pre-foreclosures",
      county: "Cass",
      state: "North Dakota",
      url: "https://www.casscountynd.gov/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T15:30:00Z",
      recordsCount: 60,
      status: "active"
    },

    // SOUTH DAKOTA
    {
      id: "62",
      name: "Minnehaha County Clerk",
      dataType: "pre-foreclosures",
      county: "Minnehaha",
      state: "South Dakota",
      url: "https://www.minnehahacounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T14:30:00Z",
      recordsCount: 70,
      status: "active"
    },

    // NEBRASKA
    {
      id: "63",
      name: "Douglas County Clerk",
      dataType: "pre-foreclosures",
      county: "Douglas",
      state: "Nebraska",
      url: "https://www.douglascounty.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T13:30:00Z",
      recordsCount: 200,
      status: "active"
    },

    // DELAWARE
    {
      id: "64",
      name: "New Castle County Clerk",
      dataType: "pre-foreclosures",
      county: "New Castle",
      state: "Delaware",
      url: "https://www.nccde.org/foreclosures",
      method: "scraper",
      lastScraped: "2024-01-13T12:30:00Z",
      recordsCount: 150,
      status: "active"
    },

    // DISTRICT OF COLUMBIA
    {
      id: "65",
      name: "DC Data Portal",
      dataType: "code-violations",
      county: "District of Columbia",
      state: "District of Columbia",
      url: "https://data.dc.gov/code-violations",
      method: "api",
      lastScraped: "2024-01-13T11:30:00Z",
      recordsCount: 900,
      status: "active"
    }
  ];

  const mockScrapingJobs: ScrapingJob[] = [
    {
      id: "1",
      dataType: "tax-delinquent",
      county: "Los Angeles",
      state: "California",
      status: "running",
      progress: 75,
      recordsFound: 2500,
      recordsProcessed: 1875,
      errors: 5,
      startedAt: "2024-01-15T10:00:00Z",
      sourceUrl: "https://assessor.lacounty.gov/tax-delinquent"
    },
    {
      id: "2",
      dataType: "code-violations",
      county: "Harris",
      state: "Texas",
      status: "completed",
      progress: 100,
      recordsFound: 1800,
      recordsProcessed: 1800,
      errors: 0,
      startedAt: "2024-01-15T09:00:00Z",
      completedAt: "2024-01-15T09:45:00Z",
      sourceUrl: "https://www.hcad.org/code-violations"
    },
    {
      id: "3",
      dataType: "probate-properties",
      county: "Miami-Dade",
      state: "Florida",
      status: "failed",
      progress: 25,
      recordsFound: 500,
      recordsProcessed: 125,
      errors: 15,
      startedAt: "2024-01-15T08:00:00Z",
      errorMessage: "Website structure changed, scraper needs update",
      sourceUrl: "https://www.miami-dadeclerk.com/probate"
    }
  ];

  useEffect(() => {
    setDataSources(mockDataSources);
    setScrapingJobs(mockScrapingJobs);
  }, []);

  const handleStartScraping = async (dataType: string, county: string, state: string) => {
    setLoading(true);
    try {
      const newJob: ScrapingJob = {
        id: Date.now().toString(),
        dataType,
        county,
        state,
        status: 'running',
        progress: 0,
        recordsFound: 0,
        recordsProcessed: 0,
        errors: 0,
        startedAt: new Date().toISOString(),
        sourceUrl: `https://example.com/${dataType}/${county.toLowerCase()}`
      };
      
      setScrapingJobs(prev => [...prev, newJob]);
      
      // Simulate scraping progress
      simulateScrapingProgress(newJob.id);
      
      toast({
        title: "Scraping Started",
        description: `Started scraping ${dataType} data for ${county}, ${state}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start scraping job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateScrapingProgress = (jobId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setScrapingJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { 
                  ...job, 
                  status: 'completed', 
                  progress: 100, 
                  recordsFound: Math.floor(Math.random() * 2000) + 500,
                  recordsProcessed: Math.floor(Math.random() * 2000) + 500,
                  completedAt: new Date().toISOString()
                }
              : job
          )
        );
      } else {
        setScrapingJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { 
                  ...job, 
                  progress: Math.floor(progress),
                  recordsFound: Math.floor(progress * 20),
                  recordsProcessed: Math.floor(progress * 18)
                }
              : job
          )
        );
      }
    }, 1000);
  };

  const handleStopScraping = async (jobId: string) => {
    setScrapingJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'failed', completedAt: new Date().toISOString() }
          : job
      )
    );
    
    toast({
      title: "Scraping Stopped",
      description: "Data scraping job has been stopped",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      running: "default",
      completed: "default",
      failed: "destructive",
      pending: "outline"
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getDataTypeIcon = (dataType: string) => {
    const dataTypeConfig = dataTypes.find(dt => dt.id === dataType);
    return dataTypeConfig?.icon || Globe;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Scraping Engine</h1>
          <p className="text-muted-foreground">
            Automated collection of real estate data from public sources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Scraper Settings
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            New Scraping Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Scraping Jobs</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="records">Scraped Records</TabsTrigger>
          <TabsTrigger value="types">Data Types</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Scraping Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Active Scraping Jobs</CardTitle>
              <CardDescription>
                Monitor and manage data scraping operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scrapingJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {React.createElement(getDataTypeIcon(job.dataType), { className: "h-5 w-5" })}
                        <div>
                          <div className="font-medium capitalize">
                            {job.dataType.replace('-', ' ')} - {job.county}, {job.state}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {job.sourceUrl}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>

                    {job.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Records Found</div>
                        <div className="text-muted-foreground">{job.recordsFound.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Records Processed</div>
                        <div className="text-green-600">{job.recordsProcessed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Errors</div>
                        <div className="text-red-600">{job.errors}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground">
                          {job.completedAt 
                            ? `${Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)}s`
                            : `${Math.round((new Date().getTime() - new Date(job.startedAt).getTime()) / 1000)}s`
                          }
                        </div>
                      </div>
                    </div>

                    {job.errorMessage && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-800">Error</div>
                        <div className="text-sm text-red-700">{job.errorMessage}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 mt-4">
                      {job.status === 'running' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStopScraping(job.id)}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Configure and manage data sources for scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-muted-foreground">{source.url}</div>
                      </div>
                      <Badge variant={source.status === 'active' ? 'default' : 'outline'}>
                        {source.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="font-medium">Data Type</div>
                        <div className="text-muted-foreground capitalize">
                          {source.dataType.replace('-', ' ')}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">{source.county}, {source.state}</div>
                      </div>
                      <div>
                        <div className="font-medium">Method</div>
                        <div className="text-muted-foreground capitalize">{source.method}</div>
                      </div>
                      <div>
                        <div className="font-medium">Records</div>
                        <div className="text-muted-foreground">{source.recordsCount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div>Last scraped: {new Date(source.lastScraped).toLocaleString()}</div>
                      <Button
                        size="sm"
                        onClick={() => handleStartScraping(source.dataType, source.county, source.state)}
                        disabled={loading}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Scrape Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {/* Scraped Records */}
          <Card>
            <CardHeader>
              <CardTitle>Scraped Records</CardTitle>
              <CardDescription>
                View and manage collected real estate data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {scrapedRecords.length.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dataTypes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Types</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dataSources.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Sources</div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Records Yet</h3>
                  <p className="text-muted-foreground">
                    Start scraping jobs to collect real estate data
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab('jobs')}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scraping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          {/* Data Types */}
          <Card>
            <CardHeader>
              <CardTitle>Data Types</CardTitle>
              <CardDescription>
                Available real estate data types for scraping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataTypes.map((dataType) => (
                  <Card key={dataType.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        {React.createElement(dataType.icon, { className: "h-5 w-5" })}
                        <div>
                          <CardTitle className="text-lg">{dataType.name}</CardTitle>
                          <CardDescription>{dataType.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={dataType.priority === 'high' ? 'default' : 'secondary'}>
                          {dataType.priority} priority
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Scrape
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataScrapingEngine; 