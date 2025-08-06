import React, { useState, useEffect } from 'react';
import { enhancedLeadService, AdvancedFilters, GeospatialFilter, SearchResult, EnhancedProperty } from '@/services/enhanced-lead-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Filter, Download, Save, RefreshCw, Map, Text, Database, Settings } from 'lucide-react';
import { toast } from 'sonner';
import RealDataSourcesManager from './RealDataSourcesManager';
import LiveDataDashboard from './LiveDataDashboard';

interface SearchState {
  filters: AdvancedFilters;
  results: SearchResult | null;
  isLoading: boolean;
  currentPage: number;
}

const AdvancedSearchInterface: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    filters: {},
    results: null,
    isLoading: false,
    currentPage: 1
  });

  const [geospatialFilter, setGeospatialFilter] = useState<GeospatialFilter>({
    type: 'radius',
    center: { lat: 39.8283, lng: -98.5795 },
    radius: 10
  });

  const [fullTextQuery, setFullTextQuery] = useState<string>('');

  // Search methods
  const performRegularSearch = async () => {
    setSearchState(prev => ({ ...prev, isLoading: true }));
    try {
      const results = await enhancedLeadService.searchProperties(
        searchState.filters,
        searchState.currentPage,
        20
      );
      setSearchState(prev => ({ ...prev, results, isLoading: false }));
      toast.success(`Found ${results.totalCount} properties`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const performGeospatialSearch = async () => {
    setSearchState(prev => ({ ...prev, isLoading: true }));
    try {
      const results = await enhancedLeadService.searchProperties(
        { ...searchState.filters, geospatial: geospatialFilter },
        1,
        20
      );
      setSearchState(prev => ({ ...prev, results, isLoading: false, currentPage: 1 }));
      toast.success(`Found ${results.totalCount} properties in area`);
    } catch (error) {
      console.error('Geospatial search error:', error);
      toast.error('Geospatial search failed');
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const performFullTextSearch = async () => {
    if (!fullTextQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true }));
    try {
      const results = await enhancedLeadService.searchProperties(
        { ...searchState.filters, fullTextSearch: fullTextQuery },
        1,
        20
      );
      setSearchState(prev => ({ ...prev, results, isLoading: false, currentPage: 1 }));
      toast.success(`Found ${results.totalCount} properties matching "${fullTextQuery}"`);
    } catch (error) {
      console.error('Full-text search error:', error);
      toast.error('Full-text search failed');
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshData = async () => {
    try {
      const results = await enhancedLeadService.refreshPropertyData();
      toast.success(`Refreshed data from ${results.length} sources`);
    } catch (error) {
      console.error('Data refresh error:', error);
      toast.error('Data refresh failed');
    }
  };

  const exportResults = async (format: 'csv' | 'json' | 'geojson') => {
    if (!searchState.results) {
      toast.error('No results to export');
      return;
    }

    try {
      await enhancedLeadService.exportResults(searchState.filters, format);
      toast.success(`Exported results as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const saveSearch = async () => {
    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;

    try {
      await enhancedLeadService.saveSearch('user123', searchName, searchState.filters);
      toast.success('Search saved successfully');
    } catch (error) {
      console.error('Save search error:', error);
      toast.error('Failed to save search');
    }
  };

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  };

  const updateGeospatialFilter = (key: keyof GeospatialFilter, value: any) => {
    setGeospatialFilter(prev => ({ ...prev, [key]: value }));
  };

  const PropertyCard: React.FC<{ property: EnhancedProperty }> = ({ property }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{property.address}</h3>
            <p className="text-sm text-muted-foreground">
              {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <Badge variant={property.investment_score && property.investment_score > 7 ? 'default' : 'secondary'}>
            Score: {property.investment_score?.toFixed(1) || 'N/A'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>Value: ${property.estimated_value?.toLocaleString() || 'N/A'}</div>
          <div>Equity: {property.equity_percent}%</div>
          <div>{property.bedrooms} bed, {property.bathrooms} bath</div>
          <div>{property.square_feet?.toLocaleString()} sq ft</div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {property.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Source: {property.data_source}</span>
          <span>Confidence: {(property.data_confidence || 0) * 100}%</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Property Search</h1>
          <p className="text-muted-foreground">
            Search properties using geospatial queries, full-text search, and advanced filters
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          {searchState.results && (
            <>
              <Button onClick={saveSearch} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Search
              </Button>
              <Button onClick={() => exportResults('csv')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="regular" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Regular Search
          </TabsTrigger>
          <TabsTrigger value="geospatial" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Geospatial Search
          </TabsTrigger>
          <TabsTrigger value="fulltext" className="flex items-center gap-2">
            <Text className="w-4 h-4" />
            Full-Text Search
          </TabsTrigger>
          <TabsTrigger value="livedata" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Live Data
          </TabsTrigger>
          <TabsTrigger value="datasources" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Data Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </CardTitle>
              <CardDescription>
                Apply comprehensive filters to find the perfect investment properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>State</Label>
                  <Input
                    placeholder="e.g., CA, TX, FL"
                    value={searchState.filters.state || ''}
                    onChange={(e) => updateFilter('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    placeholder="e.g., Los Angeles"
                    value={searchState.filters.city || ''}
                    onChange={(e) => updateFilter('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    placeholder="e.g., 90210"
                    value={searchState.filters.zipCode || ''}
                    onChange={(e) => updateFilter('zipCode', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Property Value Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={searchState.filters.valueRange?.min || ''}
                      onChange={(e) => updateFilter('valueRange', {
                        ...searchState.filters.valueRange,
                        min: parseInt(e.target.value) || undefined
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={searchState.filters.valueRange?.max || ''}
                      onChange={(e) => updateFilter('valueRange', {
                        ...searchState.filters.valueRange,
                        max: parseInt(e.target.value) || undefined
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Investment Score Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={searchState.filters.investmentScoreRange?.min || ''}
                      onChange={(e) => updateFilter('investmentScoreRange', {
                        ...searchState.filters.investmentScoreRange,
                        min: parseFloat(e.target.value) || undefined
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={searchState.filters.investmentScoreRange?.max || ''}
                      onChange={(e) => updateFilter('investmentScoreRange', {
                        ...searchState.filters.investmentScoreRange,
                        max: parseFloat(e.target.value) || undefined
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={performRegularSearch} disabled={searchState.isLoading} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                {searchState.isLoading ? 'Searching...' : 'Search Properties'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geospatial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geospatial Search
              </CardTitle>
              <CardDescription>
                Search properties by location using radius, polygon, or nearest neighbor queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Search Type</Label>
                  <Select
                    value={geospatialFilter.type}
                    onValueChange={(value: 'radius' | 'polygon' | 'nearest') => 
                      updateGeospatialFilter('type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radius">Radius Search</SelectItem>
                      <SelectItem value="polygon">Polygon Search</SelectItem>
                      <SelectItem value="nearest">Nearest Neighbor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={geospatialFilter.center?.lat || ''}
                    onChange={(e) => updateGeospatialFilter('center', {
                      ...geospatialFilter.center,
                      lat: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={geospatialFilter.center?.lng || ''}
                    onChange={(e) => updateGeospatialFilter('center', {
                      ...geospatialFilter.center,
                      lng: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              {geospatialFilter.type === 'radius' && (
                <div>
                  <Label>Radius (miles): {geospatialFilter.radius}</Label>
                  <Slider
                    value={[geospatialFilter.radius || 10]}
                    onValueChange={([value]) => updateGeospatialFilter('radius', value)}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {geospatialFilter.type === 'nearest' && (
                <div>
                  <Label>Number of Results</Label>
                  <Input
                    type="number"
                    value={geospatialFilter.limit || 10}
                    onChange={(e) => updateGeospatialFilter('limit', parseInt(e.target.value) || 10)}
                    min={1}
                    max={100}
                  />
                </div>
              )}

              <Button onClick={performGeospatialSearch} disabled={searchState.isLoading} className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                {searchState.isLoading ? 'Searching...' : 'Search by Location'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fulltext" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Text className="w-4 h-4" />
                Full-Text Search
              </CardTitle>
              <CardDescription>
                Search properties by address, owner name, or any text using PostgreSQL full-text search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Search Query</Label>
                <Input
                  placeholder="e.g., 'John Smith' or '123 Main St' or 'Phoenix AZ'"
                  value={fullTextQuery}
                  onChange={(e) => setFullTextQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performFullTextSearch()}
                />
              </div>

              <Button onClick={performFullTextSearch} disabled={searchState.isLoading} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                {searchState.isLoading ? 'Searching...' : 'Search by Text'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livedata" className="space-y-4">
          <LiveDataDashboard />
        </TabsContent>

        <TabsContent value="datasources" className="space-y-4">
          <RealDataSourcesManager />
        </TabsContent>
      </Tabs>

      {/* Results Section */}
      {searchState.results && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Found {searchState.results.totalCount} properties in {searchState.results.searchTime.toFixed(2)}ms
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {searchState.results.coverage.states} States
                </Badge>
                <Badge variant="outline">
                  {searchState.results.coverage.counties} Counties
                </Badge>
                <Badge variant="outline">
                  {searchState.results.dataSources.join(', ')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchState.results.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {searchState.results.properties.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No properties found matching your criteria
              </div>
            )}

            {searchState.results.totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button
                  variant="outline"
                  disabled={searchState.currentPage === 1}
                  onClick={() => setSearchState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {searchState.currentPage} of {searchState.results.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={searchState.currentPage === searchState.results.totalPages}
                  onClick={() => setSearchState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearchInterface; 