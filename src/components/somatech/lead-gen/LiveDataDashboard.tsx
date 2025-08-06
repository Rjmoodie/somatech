// Live Data Dashboard Component
// Displays real-time data from free sources (Census and FEMA)

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  BarChart3,
  Globe,
  Shield,
  Target
} from 'lucide-react';
import FreeDataSourcesService, { CensusData, FEMAData } from '@/services/free-data-sources';

interface LiveDataDashboardProps {
  className?: string;
}

interface MarketInsights {
  demographics: CensusData | null;
  floodRisk: FEMAData | null;
  marketHealth: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
}

export default function LiveDataDashboard({ className }: LiveDataDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    state: 'CA',
    county: '',
    latitude: 34.0522,
    longitude: -118.2437
  });
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const freeDataService = FreeDataSourcesService.getInstance();

  const loadMarketInsights = async () => {
    setIsLoading(true);
    try {
      const insights = await freeDataService.getMarketInsights({
        state: location.state,
        county: location.county,
        latitude: location.latitude,
        longitude: location.longitude
      });
      setMarketInsights(insights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading market insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketInsights();
  }, [location]);

  const getMarketHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarketHealthIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score >= 50) return <Target className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getFloodRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Data Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time market insights from free data sources (Census & FEMA)
          </p>
        </div>
        <Button onClick={loadMarketInsights} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Settings
          </CardTitle>
          <CardDescription>
            Set the location for market analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={location.state}
                onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                placeholder="e.g., CA"
              />
            </div>
            <div>
              <Label htmlFor="county">County (Optional)</Label>
              <Input
                id="county"
                value={location.county}
                onChange={(e) => setLocation(prev => ({ ...prev, county: e.target.value }))}
                placeholder="e.g., Los Angeles"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={location.latitude}
                onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                placeholder="34.0522"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={location.longitude}
                onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                placeholder="-118.2437"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {marketInsights && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Market Health Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    {getMarketHealthIcon(marketInsights.marketHealth.score)}
                    Market Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    <span className={getMarketHealthColor(marketInsights.marketHealth.score)}>
                      {marketInsights.marketHealth.score}/100
                    </span>
                  </div>
                  <Progress value={marketInsights.marketHealth.score} className="h-2 mb-3" />
                  <div className="space-y-1">
                    {marketInsights.marketHealth.factors.map((factor, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {factor}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Demographics Summary */}
              {marketInsights.demographics && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Population</span>
                      <span className="text-sm font-medium">
                        {formatNumber(marketInsights.demographics.population)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Median Income</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(marketInsights.demographics.medianIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Median Home Value</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(marketInsights.demographics.medianHomeValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Education Level</span>
                      <Badge variant="secondary" className="capitalize">
                        {marketInsights.demographics.educationLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              {marketInsights.floodRisk && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Flood Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Risk Level</span>
                      <Badge className={getFloodRiskColor(marketInsights.floodRisk.riskLevel)}>
                        {marketInsights.floodRisk.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Flood Zone</span>
                      <span className="text-sm font-medium">
                        {marketInsights.floodRisk.floodZone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Insurance Required</span>
                      {marketInsights.floodRisk.floodInsuranceRequired ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          {marketInsights?.demographics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Population & Housing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Population</span>
                      <span className="font-medium">{formatNumber(marketInsights.demographics.population)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Housing Units</span>
                      <span className="font-medium">{formatNumber(marketInsights.demographics.housingUnits)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner Occupied</span>
                      <span className="font-medium">{formatNumber(marketInsights.demographics.ownerOccupied)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renter Occupied</span>
                      <span className="font-medium">{formatNumber(marketInsights.demographics.renterOccupied)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Economic Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Median Income</span>
                      <span className="font-medium">{formatCurrency(marketInsights.demographics.medianIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median Home Value</span>
                      <span className="font-medium">{formatCurrency(marketInsights.demographics.medianHomeValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unemployment Rate</span>
                      <span className="font-medium">{marketInsights.demographics.unemploymentRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Education Level</span>
                      <Badge variant="secondary" className="capitalize">
                        {marketInsights.demographics.educationLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>No demographic data available for this location.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {marketInsights?.floodRisk ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flood Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <Badge className={getFloodRiskColor(marketInsights.floodRisk.riskLevel)}>
                        {marketInsights.floodRisk.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Flood Zone</span>
                      <span className="font-medium">{marketInsights.floodRisk.floodZone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance Required</span>
                      <span className="font-medium">
                        {marketInsights.floodRisk.floodInsuranceRequired ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated</span>
                      <span className="font-medium">
                        {marketInsights.floodRisk.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketInsights.floodRisk.riskLevel === 'high' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          High flood risk detected. Consider flood insurance costs in your investment analysis.
                        </AlertDescription>
                      </Alert>
                    )}
                    {marketInsights.floodRisk.riskLevel === 'medium' && (
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                          Moderate flood risk. Monitor flood zone changes and insurance requirements.
                        </AlertDescription>
                      </Alert>
                    )}
                    {marketInsights.floodRisk.riskLevel === 'low' && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Low flood risk. Standard insurance should be sufficient.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>No flood risk data available for this location.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {marketInsights && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Health Analysis</CardTitle>
                  <CardDescription>
                    AI-powered market insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl font-bold">
                      Market Score: {marketInsights.marketHealth.score}/100
                    </div>
                    {getMarketHealthIcon(marketInsights.marketHealth.score)}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Positive Factors:</h4>
                    <div className="space-y-1">
                      {marketInsights.marketHealth.factors
                        .filter(factor => !factor.includes('Low') && !factor.includes('Expensive') && !factor.includes('flood'))
                        .map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {factor}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Risk Factors:</h4>
                    <div className="space-y-1">
                      {marketInsights.marketHealth.factors
                        .filter(factor => factor.includes('Low') || factor.includes('Expensive') || factor.includes('flood'))
                        .map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            {factor}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recommendations:</h4>
                    <div className="space-y-1">
                      {marketInsights.marketHealth.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Target className="h-3 w-3 text-blue-500" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 