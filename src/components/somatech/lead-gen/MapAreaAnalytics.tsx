import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Home, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Users, 
  Target,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchContext } from './context';

interface AreaAnalytics {
  totalProperties: number;
  averageValue: number;
  averageEquity: number;
  totalValue: number;
  totalEquity: number;
  propertyTypes: Record<string, number>;
  ownerTypes: Record<string, number>;
  statusDistribution: Record<string, number>;
  valueRanges: Record<string, number>;
  equityRanges: Record<string, number>;
  topNeighborhoods: Array<{ name: string; count: number; avgValue: number }>;
  investmentOpportunities: number;
  highEquityProperties: number;
  distressedProperties: number;
  absenteeOwners: number;
}

interface MapAreaAnalyticsProps {
  isVisible: boolean;
  selectedArea?: {
    coordinates: [number, number][];
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  onClose: () => void;
}

export const MapAreaAnalytics: React.FC<MapAreaAnalyticsProps> = ({
  isVisible,
  selectedArea,
  onClose
}) => {
  const { state } = useSearchContext();
  const [analytics, setAnalytics] = useState<AreaAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Calculate analytics for the selected area
  const calculateAreaAnalytics = useMemo(() => {
    if (!selectedArea || !state.results.length) return null;

    const areaProperties = state.results.filter(property => {
      const [lng, lat] = property.coordinates || [0, 0];
      return (
        lat >= selectedArea.bounds.south &&
        lat <= selectedArea.bounds.north &&
        lng >= selectedArea.bounds.west &&
        lng <= selectedArea.bounds.east
      );
    });

    if (areaProperties.length === 0) return null;

    // Calculate basic statistics
    const totalProperties = areaProperties.length;
    const totalValue = areaProperties.reduce((sum, p) => sum + (p.estimated_value || 0), 0);
    const totalEquity = areaProperties.reduce((sum, p) => sum + (p.equity_amount || 0), 0);
    const averageValue = totalValue / totalProperties;
    const averageEquity = totalEquity / totalProperties;

    // Property type distribution
    const propertyTypes = areaProperties.reduce((acc, p) => {
      const type = p.property_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Owner type distribution
    const ownerTypes = areaProperties.reduce((acc, p) => {
      const type = p.owner_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const statusDistribution = areaProperties.reduce((acc, p) => {
      const status = p.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Value ranges
    const valueRanges = areaProperties.reduce((acc, p) => {
      const value = p.estimated_value || 0;
      let range = '';
      if (value < 100000) range = 'Under $100k';
      else if (value < 200000) range = '$100k-$200k';
      else if (value < 300000) range = '$200k-$300k';
      else if (value < 500000) range = '$300k-$500k';
      else range = 'Over $500k';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Equity ranges
    const equityRanges = areaProperties.reduce((acc, p) => {
      const equity = p.equity_percent || 0;
      let range = '';
      if (equity < 20) range = 'Under 20%';
      else if (equity < 40) range = '20%-40%';
      else if (equity < 60) range = '40%-60%';
      else if (equity < 80) range = '60%-80%';
      else range = 'Over 80%';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top neighborhoods
    const neighborhoods = areaProperties.reduce((acc, p) => {
      const neighborhood = p.city || 'Unknown';
      if (!acc[neighborhood]) {
        acc[neighborhood] = { count: 0, totalValue: 0 };
      }
      acc[neighborhood].count += 1;
      acc[neighborhood].totalValue += p.estimated_value || 0;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    const topNeighborhoods = Object.entries(neighborhoods)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgValue: data.totalValue / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Investment opportunities
    const investmentOpportunities = areaProperties.filter(p => 
      (p.equity_percent || 0) > 30 && 
      (p.estimated_value || 0) > 100000
    ).length;

    const highEquityProperties = areaProperties.filter(p => 
      (p.equity_percent || 0) > 50
    ).length;

    const distressedProperties = areaProperties.filter(p => 
      p.status === 'distressed' || p.status === 'foreclosure'
    ).length;

    const absenteeOwners = areaProperties.filter(p => 
      p.owner_type === 'absentee' || p.owner_type === 'out_of_state'
    ).length;

    return {
      totalProperties,
      averageValue,
      averageEquity,
      totalValue,
      totalEquity,
      propertyTypes,
      ownerTypes,
      statusDistribution,
      valueRanges,
      equityRanges,
      topNeighborhoods,
      investmentOpportunities,
      highEquityProperties,
      distressedProperties,
      absenteeOwners
    };
  }, [selectedArea, state.results]);

  // Update analytics when area changes
  useEffect(() => {
    if (calculateAreaAnalytics) {
      setAnalytics(calculateAreaAnalytics);
      setLastUpdated(new Date());
    }
  }, [calculateAreaAnalytics]);

  // Export analytics data
  const exportAnalytics = () => {
    if (!analytics) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Properties', analytics.totalProperties],
      ['Average Property Value', `$${analytics.averageValue.toLocaleString()}`],
      ['Average Equity', `$${analytics.averageEquity.toLocaleString()}`],
      ['Total Portfolio Value', `$${analytics.totalValue.toLocaleString()}`],
      ['Total Equity', `$${analytics.totalEquity.toLocaleString()}`],
      ['Investment Opportunities', analytics.investmentOpportunities],
      ['High Equity Properties', analytics.highEquityProperties],
      ['Distressed Properties', analytics.distressedProperties],
      ['Absentee Owners', analytics.absenteeOwners],
      ['', ''],
      ['Property Types', 'Count'],
      ...Object.entries(analytics.propertyTypes).map(([type, count]) => [type, count.toString()]),
      ['', ''],
      ['Owner Types', 'Count'],
      ...Object.entries(analytics.ownerTypes).map(([type, count]) => [type, count.toString()]),
      ['', ''],
      ['Top Neighborhoods', 'Properties', 'Avg Value'],
      ...analytics.topNeighborhoods.map(n => [n.name, n.count.toString(), `$${n.avgValue.toLocaleString()}`])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `area-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isVisible || !analytics) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed top-4 right-4 w-96 max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Area Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics.totalProperties} properties selected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportAnalytics}
              className="h-8"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Properties</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {analytics.totalProperties.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">Avg Value</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ${analytics.averageValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Avg Equity</span>
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ${analytics.averageEquity.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Opportunities</span>
                </div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {analytics.investmentOpportunities}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Investment Opportunities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Investment Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">High Equity Properties</span>
                <Badge variant="secondary">{analytics.highEquityProperties}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Distressed Properties</span>
                <Badge variant="destructive">{analytics.distressedProperties}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Absentee Owners</span>
                <Badge variant="outline">{analytics.absenteeOwners}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Property Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Property Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(analytics.propertyTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm">{type}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(count / analytics.totalProperties) * 100} 
                        className="w-20 h-2"
                      />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Top Neighborhoods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Neighborhoods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics.topNeighborhoods.map((neighborhood, index) => (
                <div key={neighborhood.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{neighborhood.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{neighborhood.count} properties</div>
                    <div className="text-xs text-gray-500">
                      ${neighborhood.avgValue.toLocaleString()} avg
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center pt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 