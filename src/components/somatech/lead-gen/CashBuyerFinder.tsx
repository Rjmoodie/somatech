import React, { useState } from 'react';
import { useSearchContext } from './context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DollarSign, 
  Users, 
  MapPin, 
  Building, 
  Search, 
  Download, 
  Filter,
  TrendingUp,
  Eye,
  EyeOff,
  Target,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CashBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  counties: string[];
  investmentTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  lastActive: Date;
  totalDeals: number;
  averageDealSize: number;
  preferredContact: 'email' | 'phone' | 'both';
  notes?: string;
  status: 'active' | 'inactive' | 'verified';
}

interface CashBuyerFilters {
  counties: string[];
  investmentTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  status: string;
  lastActiveDays: number;
  minDeals: number;
}

export const CashBuyerFinder = () => {
  const { state } = useSearchContext();
  const [cashBuyers, setCashBuyers] = useState<CashBuyer[]>([]);
  const [filters, setFilters] = useState<CashBuyerFilters>({
    counties: [],
    investmentTypes: [],
    priceRange: { min: 0, max: 1000000 },
    propertyTypes: [],
    status: 'all',
    lastActiveDays: 365,
    minDeals: 0
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<CashBuyer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Mock cash buyer data
  const generateMockCashBuyers = (): CashBuyer[] => {
    const buyers: CashBuyer[] = [];
    const counties = ['Los Angeles', 'Orange', 'San Diego', 'Riverside', 'San Bernardino'];
    const investmentTypes = ['Fix & Flip', 'Buy & Hold', 'Wholesale', 'BRRRR', 'Land Development'];
    const propertyTypes = ['Single Family', 'Multi-Family', 'Townhouse', 'Condo', 'Land'];
    
    for (let i = 0; i < 25; i++) {
      const priceRange = {
        min: Math.floor(Math.random() * 200000) + 50000,
        max: Math.floor(Math.random() * 800000) + 200000
      };
      
      buyers.push({
        id: `buyer-${i}`,
        name: `${['John', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'James', 'Maria'][Math.floor(Math.random() * 8)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'][Math.floor(Math.random() * 7)]}`,
        email: `buyer${i}@email.com`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        company: Math.random() > 0.3 ? `${['ABC', 'XYZ', 'Premier', 'Elite', 'First'][Math.floor(Math.random() * 5)]} Investments` : undefined,
        counties: [counties[Math.floor(Math.random() * counties.length)]],
        investmentTypes: [investmentTypes[Math.floor(Math.random() * investmentTypes.length)]],
        priceRange,
        propertyTypes: [propertyTypes[Math.floor(Math.random() * propertyTypes.length)]],
        lastActive: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        totalDeals: Math.floor(Math.random() * 50) + 1,
        averageDealSize: Math.floor(Math.random() * 200000) + 100000,
        preferredContact: ['email', 'phone', 'both'][Math.floor(Math.random() * 3)] as 'email' | 'phone' | 'both',
        notes: Math.random() > 0.7 ? 'Prefers distressed properties' : undefined,
        status: ['active', 'inactive', 'verified'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'verified'
      });
    }
    
    return buyers;
  };

  const findCashBuyers = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockBuyers = generateMockCashBuyers();
      setCashBuyers(mockBuyers);
      
      toast.success(`Found ${mockBuyers.length} cash buyers`);
    } catch (error) {
      console.error('Error finding cash buyers:', error);
      toast.error('Failed to find cash buyers');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuyers = cashBuyers.filter(buyer => {
    if (filters.counties.length > 0 && !filters.counties.some(county => buyer.counties.includes(county))) return false;
    if (filters.investmentTypes.length > 0 && !filters.investmentTypes.some(type => buyer.investmentTypes.includes(type))) return false;
    if (buyer.priceRange.max < filters.priceRange.min || buyer.priceRange.min > filters.priceRange.max) return false;
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.some(type => buyer.propertyTypes.includes(type))) return false;
    if (filters.status !== 'all' && buyer.status !== filters.status) return false;
    if (buyer.lastActive < new Date(Date.now() - filters.lastActiveDays * 24 * 60 * 60 * 1000)) return false;
    if (buyer.totalDeals < filters.minDeals) return false;
    return true;
  });

  const exportBuyers = () => {
    const csvContent = [
      'Name,Email,Phone,Company,Counties,Investment Types,Price Range,Property Types,Last Active,Total Deals,Average Deal Size,Preferred Contact,Status,Notes',
      ...filteredBuyers.map(buyer => 
        `"${buyer.name}","${buyer.email}","${buyer.phone}","${buyer.company || ''}","${buyer.counties.join('; ')}","${buyer.investmentTypes.join('; ')}","${buyer.priceRange.min}-${buyer.priceRange.max}","${buyer.propertyTypes.join('; ')}","${buyer.lastActive.toLocaleDateString()}","${buyer.totalDeals}","${buyer.averageDealSize}","${buyer.preferredContact}","${buyer.status}","${buyer.notes || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-buyers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Cash buyers exported to CSV');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Cash Buyer Finder
          </CardTitle>
          <CardDescription>
            Find active cash buyers in your target counties and connect with them for potential deals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={findCashBuyers}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Finding Buyers...' : 'Find Cash Buyers'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            {filteredBuyers.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'list' ? <Users className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  {viewMode === 'list' ? 'Grid' : 'List'} View
                </Button>
                <Button
                  variant="outline"
                  onClick={exportBuyers}
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
                    <CardTitle className="text-sm">Filter Cash Buyers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Price Range</Label>
                        <Input
                          type="number"
                          value={filters.priceRange.min}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Max Price Range</Label>
                        <Input
                          type="number"
                          value={filters.priceRange.max}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                          }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Last Active (days)</Label>
                        <Input
                          type="number"
                          value={filters.lastActiveDays}
                          onChange={(e) => setFilters(prev => ({ ...prev, lastActiveDays: Number(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Min Total Deals</Label>
                        <Input
                          type="number"
                          value={filters.minDeals}
                          onChange={(e) => setFilters(prev => ({ ...prev, minDeals: Number(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Stats */}
          {filteredBuyers.length > 0 && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredBuyers.length}
                </div>
                <div className="text-xs text-muted-foreground">Cash Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredBuyers.filter(b => b.status === 'verified').length}
                </div>
                <div className="text-xs text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredBuyers.reduce((sum, b) => sum + b.totalDeals, 0) / filteredBuyers.length)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatPrice(Math.round(filteredBuyers.reduce((sum, b) => sum + b.averageDealSize, 0) / filteredBuyers.length))}
                </div>
                <div className="text-xs text-muted-foreground">Avg Deal Size</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cash Buyers Display */}
      {filteredBuyers.length > 0 && (
        <div className="space-y-4">
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredBuyers.map((buyer, index) => (
                <motion.div
                  key={buyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedBuyer(buyer)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{buyer.name}</h4>
                            {buyer.company && (
                              <Badge variant="outline" className="text-xs">
                                {buyer.company}
                              </Badge>
                            )}
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(buyer.status)}`}>
                              {buyer.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {buyer.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {buyer.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {buyer.counties.join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {getDaysAgo(buyer.lastActive)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              {formatPrice(buyer.priceRange.min)} - {formatPrice(buyer.priceRange.max)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {buyer.propertyTypes.join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {buyer.totalDeals} deals
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {buyer.investmentTypes.map((type, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
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
              {filteredBuyers.map((buyer, index) => (
                <motion.div
                  key={buyer.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedBuyer(buyer)}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{buyer.name}</h4>
                          <Badge variant="secondary" className={getStatusColor(buyer.status)}>
                            {buyer.status}
                          </Badge>
                        </div>
                        
                        {buyer.company && (
                          <p className="text-sm text-muted-foreground">{buyer.company}</p>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{buyer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{buyer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{buyer.counties.join(', ')}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Price Range:</span>
                            <span className="font-medium">{formatPrice(buyer.priceRange.min)} - {formatPrice(buyer.priceRange.max)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Total Deals:</span>
                            <span className="font-medium">{buyer.totalDeals}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Avg Deal:</span>
                            <span className="font-medium">{formatPrice(buyer.averageDealSize)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {buyer.investmentTypes.map((type, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
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
      {cashBuyers.length > 0 && filteredBuyers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No cash buyers found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find more cash buyers.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 