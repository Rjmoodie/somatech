import React, { useState } from "react";
import { useSearchContext } from "./context";
import PropertyCard from "./PropertyCard";
import PropertyDetailView from "./PropertyDetailView";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, 
  MapPin, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PropertyResultsList: React.FC = () => {
  const { state } = useSearchContext();
  const { results, loading, selectedPropertyId } = state;
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'equity' | 'date'>('relevance');

  console.log('PropertyResultsList: results', results);
  console.log('PropertyResultsList: loading', loading);
  console.log('PropertyResultsList: selectedPropertyId', selectedPropertyId);
  console.log('PropertyResultsList: results length', results?.length || 0);

  // Enhanced loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 dark:text-gray-400 text-sm">Finding properties...</p>
        <div className="flex items-center gap-2 mt-2">
          <Building className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-gray-500">Searching database</span>
        </div>
      </div>
    );
  }

  // Enhanced empty state
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 max-w-sm">
            Try adjusting your search criteria or filters to find more properties
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="h-3 w-3" />
            <span>Check your search terms and filters</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Enhanced results header
  const ResultsHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-purple-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {results.length} Properties
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Found
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-6 px-2 text-xs"
          >
            <List className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-6 px-2 text-xs"
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
        >
          <option value="relevance">Relevance</option>
          <option value="price">Price</option>
          <option value="equity">Equity</option>
          <option value="date">Date Added</option>
        </select>
      </div>
    </div>
  );

  // Enhanced results summary
  const ResultsSummary = () => {
    const avgPrice = results.reduce((sum, p) => sum + (p.purchase_price || 0), 0) / results.length;
    const avgEquity = results.reduce((sum, p) => sum + (p.equity_percent || 0), 0) / results.length;
    
    return (
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <DollarSign className="h-4 w-4 text-green-600 mb-1" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Avg Price</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ${(avgPrice / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Avg Equity</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {avgEquity.toFixed(0)}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-4 w-4 text-purple-600 mb-1" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Properties</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {results.length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ResultsHeader />
      <ResultsSummary />
      
      {/* Enhanced Property List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {results.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 border-b border-gray-100 dark:border-gray-800",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                selectedPropertyId === property.id && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              )}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Enhanced Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Last updated: Just now</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailView />
    </div>
  );
};

export default PropertyResultsList; 