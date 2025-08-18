import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { leadGenAPI, LeadGenData } from '../../../services/lead-gen-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Filter,
  Target,
  Home,
  Building,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Maximize2,
  Minimize2
} from 'lucide-react';

export interface MapEngineProps {
  className?: string;
  initialBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  onPropertyClick?: (property: LeadGenData) => void;
  onMapBoundsChange?: (bounds: any) => void;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  property: LeadGenData;
  cluster?: boolean;
  clusterSize?: number;
}

export interface MapFilters {
  showHighEquity: boolean;
  showDistressed: boolean;
  showVacant: boolean;
  showAbsenteeOwners: boolean;
  minEquity: number;
  maxValue: number;
  propertyTypes: string[];
}

export const MapEngine: React.FC<MapEngineProps> = ({
  className,
  initialBounds,
  onPropertyClick,
  onMapBoundsChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBounds, setCurrentBounds] = useState(initialBounds);
  const [zoom, setZoom] = useState(10);
  const [filters, setFilters] = useState<MapFilters>({
    showHighEquity: true,
    showDistressed: true,
    showVacant: true,
    showAbsenteeOwners: true,
    minEquity: 0,
    maxValue: 1000000,
    propertyTypes: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<LeadGenData | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('streets');

  // Initialize map (placeholder for actual map library integration)
  useEffect(() => {
    if (!mapRef.current) return;

    // This would be replaced with actual map library initialization
    // For now, we'll create a placeholder map container
    const initMap = () => {
      console.log('🗺️ Initializing map...');
      // Placeholder for map initialization
      setMapInstance({ type: 'placeholder' });
    };

    initMap();
  }, []);

  // Load properties for current map bounds
  const loadPropertiesForBounds = useCallback(async (bounds: any) => {
    if (!bounds) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Loading properties for map bounds:', bounds);

      const area = {
        type: 'polygon' as const,
        coordinates: [
          [bounds.west, bounds.south],
          [bounds.east, bounds.south],
          [bounds.east, bounds.north],
          [bounds.west, bounds.north],
          [bounds.west, bounds.south]
        ]
      };

      const result = await leadGenAPI.getPropertiesByArea(area, {
        maxProperties: 1000,
        includeAnalytics: true,
        filters: {
          equityRange: { min: filters.minEquity, max: 100 },
          valueRange: { min: 0, max: filters.maxValue }
        }
      });

      // Transform properties to map markers
      const newMarkers: MapMarker[] = result.properties
        .filter(property => {
          // Apply filters
          if (!filters.showHighEquity && (property.equity_percent || 0) > 70) return false;
          if (!filters.showDistressed && property.tags?.includes('distressed')) return false;
          if (!filters.showVacant && property.tags?.includes('vacant')) return false;
          if (!filters.showAbsenteeOwners && property.owner_type === 'absentee') return false;
          if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.property_type)) return false;
          
          return true;
        })
        .map(property => ({
          id: property.id,
          position: [property.latitude, property.longitude] as [number, number],
          property
        }));

      setMarkers(newMarkers);
      console.log(`✅ Loaded ${newMarkers.length} properties for map area`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
      setError(errorMessage);
      console.error('❌ Error loading properties for map:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update markers when filters change
  useEffect(() => {
    if (currentBounds) {
      loadPropertiesForBounds(currentBounds);
    }
  }, [currentBounds, filters, loadPropertiesForBounds]);

  // Handle map bounds change
  const handleMapBoundsChange = useCallback((newBounds: any) => {
    setCurrentBounds(newBounds);
    onMapBoundsChange?.(newBounds);
  }, [onMapBoundsChange]);

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedProperty(marker.property);
    onPropertyClick?.(marker.property);
  }, [onPropertyClick]);

  // Handle cluster click
  const handleClusterClick = useCallback((cluster: any) => {
    // Zoom to cluster bounds
    console.log('🔍 Zooming to cluster:', cluster);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Get trend icon
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get marker color based on property type
  const getMarkerColor = (property: LeadGenData) => {
    if (property.tags?.includes('distressed')) return 'red';
    if (property.tags?.includes('vacant')) return 'yellow';
    if ((property.equity_percent || 0) > 70) return 'green';
    return 'blue';
  };

  // Get marker icon based on property type
  const getMarkerIcon = (property: LeadGenData) => {
    if (property.property_type === 'commercial') return <Building className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  // Memoized filtered markers
  const filteredMarkers = useMemo(() => {
    return markers.filter(marker => {
      const property = marker.property;
      
      // Apply equity filter
      if ((property.equity_percent || 0) < filters.minEquity) return false;
      
      // Apply value filter
      if ((property.estimated_value || 0) > filters.maxValue) return false;
      
      // Apply property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.property_type)) return false;
      
      return true;
    });
  }, [markers, filters]);

  // Memoized marker statistics
  const markerStats = useMemo(() => {
    const total = filteredMarkers.length;
    const highEquity = filteredMarkers.filter(m => (m.property.equity_percent || 0) > 70).length;
    const distressed = filteredMarkers.filter(m => m.property.tags?.includes('distressed')).length;
    const vacant = filteredMarkers.filter(m => m.property.tags?.includes('vacant')).length;
    const totalValue = filteredMarkers.reduce((sum, m) => sum + (m.property.estimated_value || 0), 0);

    return {
      total,
      highEquity,
      distressed,
      vacant,
      totalValue,
      averageValue: total > 0 ? totalValue / total : 0
    };
  }, [filteredMarkers]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className="relative h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden">
        {/* Placeholder Map */}
        <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
              <p className="text-muted-foreground mb-4">
                Map integration with clustering, filtering, and real-time data
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="font-semibold">{markerStats.total}</div>
                  <div className="text-muted-foreground">Properties</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="font-semibold">{formatCurrency(markerStats.totalValue)}</div>
                  <div className="text-muted-foreground">Total Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setZoom(prev => Math.min(prev + 1, 20))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setZoom(prev => Math.max(prev - 1, 1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow text-sm">
          Zoom: {zoom}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm">Loading properties...</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-4 left-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="absolute top-4 left-4 w-80 bg-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Map Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Type Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Types</label>
              <div className="space-y-2">
                {['single-family', 'multi-family', 'condo', 'commercial'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({
                          ...prev,
                          propertyTypes: checked
                            ? [...prev.propertyTypes, type]
                            : prev.propertyTypes.filter(t => t !== type)
                        }));
                      }}
                    />
                    <label htmlFor={type} className="text-sm capitalize">
                      {type.replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Equity Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Equity: {filters.minEquity}%
              </label>
              <Slider
                value={[filters.minEquity]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, minEquity: value }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Value Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max Value: {formatCurrency(filters.maxValue)}
              </label>
              <Slider
                value={[filters.maxValue]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, maxValue: value }))}
                max={2000000}
                step={50000}
                className="w-full"
              />
            </div>

            {/* Property Status Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Status</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="high-equity"
                    checked={filters.showHighEquity}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showHighEquity: !!checked }))}
                  />
                  <label htmlFor="high-equity" className="text-sm">High Equity (&gt;70%)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="distressed"
                    checked={filters.showDistressed}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showDistressed: !!checked }))}
                  />
                  <label htmlFor="distressed" className="text-sm">Distressed</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vacant"
                    checked={filters.showVacant}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showVacant: !!checked }))}
                  />
                  <label htmlFor="vacant" className="text-sm">Vacant</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="absentee"
                    checked={filters.showAbsenteeOwners}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showAbsenteeOwners: !!checked }))}
                  />
                  <label htmlFor="absentee" className="text-sm">Absentee Owners</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Details Panel */}
      {selectedProperty && (
        <Card className="absolute bottom-4 right-4 w-96 bg-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Property Details</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedProperty(null)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold">{selectedProperty.address}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Owner</div>
                <div className="font-medium">{selectedProperty.owner_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Value</div>
                <div className="font-medium">{formatCurrency(selectedProperty.estimated_value)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Equity</div>
                <div className="font-medium">{formatPercentage(selectedProperty.equity_percent)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Type</div>
                <div className="font-medium capitalize">{selectedProperty.property_type.replace('-', ' ')}</div>
              </div>
            </div>

            {selectedProperty.opportunityScore && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedProperty.opportunityScore}% Opportunity
                </Badge>
                {selectedProperty.marketTrend && getTrendIcon(selectedProperty.marketTrend)}
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {selectedProperty.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                // This would open detailed property view
                console.log('Opening detailed view for:', selectedProperty.id);
              }}
            >
              View Full Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Map Statistics */}
      <Card className="absolute top-4 left-4 bg-white shadow-lg">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">{markerStats.total}</div>
              <div className="text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{markerStats.highEquity}</div>
              <div className="text-muted-foreground">High Equity</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-red-600">{markerStats.distressed}</div>
              <div className="text-muted-foreground">Distressed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-yellow-600">{markerStats.vacant}</div>
              <div className="text-muted-foreground">Vacant</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 