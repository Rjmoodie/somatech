import React, { useState, useEffect } from 'react';
import { useSearchContext } from './context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Home, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Camera, 
  Filter, 
  Download, 
  Plus,
  Minus,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparableSale {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  salePrice: number;
  saleDate: Date;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  lotSize: number;
  propertyType: string;
  condition: string;
  daysOnMarket: number;
  pricePerSqFt: number;
  photos: string[];
  distance: number;
  priceDifference: number;
  priceDifferencePercent: number;
}

interface CompsFilters {
  radius: number;
  minPrice: number;
  maxPrice: number;
  minSqFt: number;
  maxSqFt: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  condition: string;
  daysOnMarket: number;
}

export const ComparableSalesAnalyzer = () => {
  const { state } = useSearchContext();
  const [comps, setComps] = useState<ComparableSale[]>([]);
  const [filters, setFilters] = useState<CompsFilters>({
    radius: 1,
    minPrice: 0,
    maxPrice: 1000000,
    minSqFt: 0,
    maxSqFt: 5000,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: 'all',
    condition: 'all',
    daysOnMarket: 365
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedComp, setSelectedComp] = useState<ComparableSale | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Mock comparable sales data
  const generateMockComps = (targetProperty: any): ComparableSale[] => {
    const comps: ComparableSale[] = [];
    const basePrice = targetProperty.estimated_value || 250000;
    const baseSqFt = targetProperty.square_footage || 1500;
    
    for (let i = 0; i < 12; i++) {
      const priceVariation = (Math.random() - 0.5) * 0.4; // ±20%
      const sqFtVariation = (Math.random() - 0.5) * 0.3; // ±15%
      const distance = Math.random() * 2; // 0-2 miles
      
      const salePrice = Math.round(basePrice * (1 + priceVariation));
      const squareFootage = Math.round(baseSqFt * (1 + sqFtVariation));
      const pricePerSqFt = Math.round(salePrice / squareFootage);
      
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 365));
      
      comps.push({
        id: `comp-${i}`,
        address: `${Math.floor(Math.random() * 9999)} ${['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'][Math.floor(Math.random() * 5)]} St`,
        city: targetProperty.city || 'Anytown',
        state: targetProperty.state || 'CA',
        zip: targetProperty.zip || '90210',
        salePrice,
        saleDate,
        squareFootage,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        lotSize: Math.floor(Math.random() * 10000) + 5000,
        propertyType: ['Single Family', 'Townhouse', 'Condo'][Math.floor(Math.random() * 3)],
        condition: ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)],
        daysOnMarket: Math.floor(Math.random() * 90) + 1,
        pricePerSqFt,
        photos: [
          `https://picsum.photos/300/200?random=${i}`,
          `https://picsum.photos/300/200?random=${i + 100}`,
          `https://picsum.photos/300/200?random=${i + 200}`
        ],
        distance,
        priceDifference: salePrice - basePrice,
        priceDifferencePercent: ((salePrice - basePrice) / basePrice) * 100
      });
    }
    
    return comps.sort((a, b) => a.distance - b.distance);
  };

  const findComparables = async () => {
    if (!state.selectedPropertyId) {
      toast.error('Please select a property first');
      return;
    }

    const selectedProperty = state.results.find(p => p.id === state.selectedPropertyId);
    if (!selectedProperty) {
      toast.error('Selected property not found');
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockComps = generateMockComps(selectedProperty);
      setComps(mockComps);
      
      toast.success(`Found ${mockComps.length} comparable sales`);
    } catch (error) {
      console.error('Error finding comparables:', error);
      toast.error('Failed to find comparable sales');
    } finally {
      setLoading(false);
    }
  };

  const filteredComps = comps.filter(comp => {
    if (comp.distance > filters.radius) return false;
    if (comp.salePrice < filters.minPrice || comp.salePrice > filters.maxPrice) return false;
    if (comp.squareFootage < filters.minSqFt || comp.squareFootage > filters.maxSqFt) return false;
    if (filters.bedrooms > 0 && comp.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms > 0 && comp.bathrooms < filters.bathrooms) return false;
    if (filters.propertyType !== 'all' && comp.propertyType !== filters.propertyType) return false;
    if (filters.condition !== 'all' && comp.condition !== filters.condition) return false;
    if (comp.daysOnMarket > filters.daysOnMarket) return false;
    return true;
  });

  const averagePrice = filteredComps.length > 0 
    ? filteredComps.reduce((sum, comp) => sum + comp.salePrice, 0) / filteredComps.length 
    : 0;

  const averagePricePerSqFt = filteredComps.length > 0 
    ? filteredComps.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / filteredComps.length 
    : 0;

  const exportComps = () => {
    const csvContent = [
      'Address,City,State,ZIP,Sale Price,Sale Date,Square Footage,Bedrooms,Bathrooms,Lot Size,Property Type,Condition,Days on Market,Price per Sq Ft,Distance,Price Difference,Price Difference %',
      ...filteredComps.map(comp => 
        `"${comp.address}","${comp.city}","${comp.state}","${comp.zip}","${comp.salePrice}","${comp.saleDate.toLocaleDateString()}","${comp.squareFootage}","${comp.bedrooms}","${comp.bathrooms}","${comp.lotSize}","${comp.propertyType}","${comp.condition}","${comp.daysOnMarket}","${comp.pricePerSqFt}","${comp.distance.toFixed(2)}","${comp.priceDifference}","${comp.priceDifferencePercent.toFixed(2)}%"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparable-sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Comparable sales exported to CSV');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceChangeIcon = (difference: number) => {
    if (difference > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (difference < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Comparable Sales Analyzer
          </CardTitle>
          <CardDescription>
            Find and analyze recent sales of similar properties in the area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={findComparables}
              disabled={loading || !state.selectedPropertyId}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Finding Comps...' : 'Find Comparables'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            {filteredComps.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'list' ? <Home className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  {viewMode === 'list' ? 'Grid' : 'List'} View
                </Button>
                <Button
                  variant="outline"
                  onClick={exportComps}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </>
            )}
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Filter Comparables</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Radius (miles)</Label>
                        <Slider
                          value={[filters.radius]}
                          onValueChange={([value]) => setFilters(prev => ({ ...prev, radius: value }))}
                          max={5}
                          min={0.1}
                          step={0.1}
                          className="mt-2"
                        />
                        <span className="text-xs text-muted-foreground">{filters.radius} miles</span>
                      </div>
                      
                      <div>
                        <Label>Days on Market</Label>
                        <Slider
                          value={[filters.daysOnMarket]}
                          onValueChange={([value]) => setFilters(prev => ({ ...prev, daysOnMarket: value }))}
                          max={365}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                        <span className="text-xs text-muted-foreground">≤ {filters.daysOnMarket} days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Price</Label>
                        <Input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Max Price</Label>
                        <Input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Min Sq Ft</Label>
                        <Input
                          type="number"
                          value={filters.minSqFt}
                          onChange={(e) => setFilters(prev => ({ ...prev, minSqFt: Number(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Bedrooms</Label>
                        <Select value={filters.bedrooms.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: Number(value) }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Bathrooms</Label>
                        <Select value={filters.bathrooms.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: Number(value) }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Stats */}
          {filteredComps.length > 0 && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredComps.length}
                </div>
                <div className="text-xs text-muted-foreground">Comparables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(averagePrice)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Sale Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${averagePricePerSqFt}
                </div>
                <div className="text-xs text-muted-foreground">Avg Price/Sq Ft</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filters.radius}
                </div>
                <div className="text-xs text-muted-foreground">Mile Radius</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparables Display */}
      {filteredComps.length > 0 && (
        <div className="space-y-4">
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredComps.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedComp(comp)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Photo */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={comp.photos[0]} 
                            alt={comp.address}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{comp.address}</h4>
                              <p className="text-sm text-muted-foreground">{comp.city}, {comp.state} {comp.zip}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatPrice(comp.salePrice)}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                {getPriceChangeIcon(comp.priceDifference)}
                                <span className={comp.priceDifference > 0 ? 'text-green-600' : comp.priceDifference < 0 ? 'text-red-600' : 'text-gray-600'}>
                                  {comp.priceDifference > 0 ? '+' : ''}{formatPrice(comp.priceDifference)} ({comp.priceDifferencePercent > 0 ? '+' : ''}{comp.priceDifferencePercent.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              {comp.squareFootage} sq ft
                            </span>
                            <span>{comp.bedrooms} bed, {comp.bathrooms} bath</span>
                            <Badge variant="secondary" className={getConditionColor(comp.condition)}>
                              {comp.condition}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {comp.distance.toFixed(2)} mi
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {comp.saleDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComps.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedComp(comp)}>
                    <div className="relative">
                      <img 
                        src={comp.photos[0]} 
                        alt={comp.address}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        {formatPrice(comp.salePrice)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{comp.address}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{comp.city}, {comp.state}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Price/Sq Ft:</span>
                          <span className="font-medium">${comp.pricePerSqFt}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Size:</span>
                          <span>{comp.squareFootage} sq ft</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Distance:</span>
                          <span>{comp.distance.toFixed(2)} mi</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Sold:</span>
                          <span>{comp.saleDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {comps.length > 0 && filteredComps.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No comparables found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find more comparable sales.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 