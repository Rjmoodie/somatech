import React, { useState } from "react";
import { useSearchContext } from "./context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  TrendingUp,
  MapPin,
  Building,
  User,
  Calendar,
  Target,
  Sliders,
  RefreshCw,
  Save,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Home,
  Users,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const FilterSidebar: React.FC = () => {
  const { state, dispatch } = useSearchContext();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['location', 'financial', 'property']));
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...state.filters, [key]: value };
    dispatch({ type: "SET_FILTERS", payload: newFilters });
    
    // Update active filters
    const newActiveFilters = new Set(activeFilters);
    if (value && value !== '') {
      newActiveFilters.add(key);
    } else {
      newActiveFilters.delete(key);
    }
    setActiveFilters(newActiveFilters);
  };

  const clearAllFilters = () => {
    dispatch({ type: "SET_FILTERS", payload: {} });
    setActiveFilters(new Set());
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...state.filters };
    delete newFilters[key];
    dispatch({ type: "SET_FILTERS", payload: newFilters });
    
    const newActiveFilters = new Set(activeFilters);
    newActiveFilters.delete(key);
    setActiveFilters(newActiveFilters);
  };

  const FilterSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    section: string;
    children: React.ReactNode;
  }> = ({ title, icon, section, children }) => {
    const isExpanded = expandedSections.has(section);
    
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FilterChip: React.FC<{
    label: string;
    value: string;
    onClear: () => void;
  }> = ({ label, value, onClear }) => (
    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
      <span>{label}: {value}</span>
      <button
        onClick={onClear}
        className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
          {activeFilters.size > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilters.size}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={activeFilters.size === 0}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.size > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Active Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.filters.state && (
              <FilterChip
                label="State"
                value={state.filters.state}
                onClear={() => clearFilter('state')}
              />
            )}
            {state.filters.city && (
              <FilterChip
                label="City"
                value={state.filters.city}
                onClear={() => clearFilter('city')}
              />
            )}
            {state.filters.zip && (
              <FilterChip
                label="ZIP"
                value={state.filters.zip}
                onClear={() => clearFilter('zip')}
              />
            )}
            {state.filters.equity_percent && (
              <FilterChip
                label="Min Equity"
                value={`${state.filters.equity_percent}%`}
                onClear={() => clearFilter('equity_percent')}
              />
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Location Filters */}
        <FilterSection
          title="Location"
          icon={<MapPin className="h-4 w-4 text-green-600" />}
          section="location"
        >
          <div className="space-y-3">
            <div>
              <Label htmlFor="state" className="text-xs font-medium">State</Label>
              <Select
                value={state.filters.state || ""}
                onValueChange={(value) => updateFilter('state', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city" className="text-xs font-medium">City</Label>
              <Input
                id="city"
                placeholder="Enter city name"
                value={state.filters.city || ""}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="zip" className="text-xs font-medium">ZIP Code</Label>
              <Input
                id="zip"
                placeholder="Enter ZIP code"
                value={state.filters.zip || ""}
                onChange={(e) => updateFilter('zip', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </FilterSection>

        {/* Financial Filters */}
        <FilterSection
          title="Financial"
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
          section="financial"
        >
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Minimum Equity %</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  value={[state.filters.equity_percent || 0]}
                  onValueChange={([value]) => updateFilter('equity_percent', value)}
                  max={100}
                  min={0}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-12 text-right">
                  {state.filters.equity_percent || 0}%
                </span>
              </div>
            </div>
            
            <div>
              <Label className="text-xs font-medium">Price Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Min"
                  value={state.filters.min_price || ""}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Max"
                  value={state.filters.max_price || ""}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Property Filters */}
        <FilterSection
          title="Property"
          icon={<Building className="h-4 w-4 text-purple-600" />}
          section="property"
        >
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium">Property Type</Label>
              <Select
                value={state.filters.property_type || ""}
                onValueChange={(value) => updateFilter('property_type', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family">Single Family</SelectItem>
                  <SelectItem value="multi_family">Multi Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs font-medium">Owner Type</Label>
              <Select
                value={state.filters.owner_type || ""}
                onValueChange={(value) => updateFilter('owner_type', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absentee">Absentee</SelectItem>
                  <SelectItem value="owner_occupied">Owner Occupied</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs font-medium">Property Status</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={state.filters.tags?.includes('distressed') || false}
                    onChange={(e) => {
                      const tags = state.filters.tags || [];
                      const newTags = e.target.checked 
                        ? [...tags, 'distressed']
                        : tags.filter(t => t !== 'distressed');
                      updateFilter('tags', newTags);
                    }}
                    className="rounded"
                  />
                  <AlertTriangle className="h-3 w-3 text-orange-600" />
                  Distressed
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={state.filters.tags?.includes('vacant') || false}
                    onChange={(e) => {
                      const tags = state.filters.tags || [];
                      const newTags = e.target.checked 
                        ? [...tags, 'vacant']
                        : tags.filter(t => t !== 'vacant');
                      updateFilter('tags', newTags);
                    }}
                    className="rounded"
                  />
                  <Building className="h-3 w-3 text-yellow-600" />
                  Vacant
                </label>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Quick Actions */}
        <FilterSection
          title="Quick Actions"
          icon={<Zap className="h-4 w-4 text-yellow-600" />}
          section="quick"
        >
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs justify-start"
              onClick={() => updateFilter('equity_percent', 70)}
            >
              <TrendingUp className="h-3 w-3 mr-2" />
              High Equity (70%+)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs justify-start"
              onClick={() => updateFilter('owner_type', 'absentee')}
            >
              <User className="h-3 w-3 mr-2" />
              Absentee Owners
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs justify-start"
              onClick={() => {
                const tags = state.filters.tags || [];
                updateFilter('tags', [...tags, 'distressed']);
              }}
            >
              <AlertTriangle className="h-3 w-3 mr-2" />
              Distressed Properties
            </Button>
          </div>
        </FilterSection>
      </div>

      {/* Filter Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>{activeFilters.size} active filters</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              // TODO: Save filter preset
            }}
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 