// Live Data Test Component
// Tests and demonstrates live data from free sources

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  MapPin,
  Users,
  Shield
} from 'lucide-react';
import FreeDataSourcesService, { CensusData, FEMAData } from '@/services/free-data-sources';

interface LiveDataTestProps {
  className?: string;
}

export default function LiveDataTest({ className }: LiveDataTestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    census?: any;
    fema?: any;
    location?: any;
  }>({});
  const [testLocation, setTestLocation] = useState({
    state: 'CA',
    county: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437
  });

  const freeDataService = FreeDataSourcesService.getInstance();

  const testCensusData = async () => {
    setIsLoading(true);
    try {
      const result = await freeDataService.getCensusData({
        state: testLocation.state,
        county: testLocation.county
      });
      setTestResults(prev => ({ ...prev, census: result }));
    } catch (error) {
      console.error('Census test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        census: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testFEMAData = async () => {
    setIsLoading(true);
    try {
      const result = await freeDataService.getFEMAData({
        latitude: testLocation.latitude,
        longitude: testLocation.longitude
      });
      setTestResults(prev => ({ ...prev, fema: result }));
    } catch (error) {
      console.error('FEMA test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        fema: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testLocationData = async () => {
    setIsLoading(true);
    try {
      const result = await freeDataService.getLocationFreeData({
        state: testLocation.state,
        county: testLocation.county,
        latitude: testLocation.latitude,
        longitude: testLocation.longitude
      });
      setTestResults(prev => ({ ...prev, location: result }));
    } catch (error) {
      console.error('Location test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        location: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        testCensusData(),
        testFEMAData(),
        testLocationData()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
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
          <h2 className="text-2xl font-bold tracking-tight">Live Data Test</h2>
          <p className="text-muted-foreground">
            Test live data sources (Census & FEMA) with real API calls
          </p>
        </div>
        <Button onClick={testAllData} disabled={isLoading}>
          <TestTube className="h-4 w-4 mr-2" />
          {isLoading ? 'Testing...' : 'Test All Sources'}
        </Button>
      </div>

      {/* Test Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Test Location
          </CardTitle>
          <CardDescription>
            Set location for testing live data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-state">State</Label>
              <Input
                id="test-state"
                value={testLocation.state}
                onChange={(e) => setTestLocation(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                placeholder="e.g., CA"
              />
            </div>
            <div>
              <Label htmlFor="test-county">County</Label>
              <Input
                id="test-county"
                value={testLocation.county}
                onChange={(e) => setTestLocation(prev => ({ ...prev, county: e.target.value }))}
                placeholder="e.g., Los Angeles"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-lat">Latitude</Label>
              <Input
                id="test-lat"
                type="number"
                step="0.0001"
                value={testLocation.latitude}
                onChange={(e) => setTestLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                placeholder="34.0522"
              />
            </div>
            <div>
              <Label htmlFor="test-lng">Longitude</Label>
              <Input
                id="test-lng"
                type="number"
                step="0.0001"
                value={testLocation.longitude}
                onChange={(e) => setTestLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                placeholder="-118.2437"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Census Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Census Data Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              {testResults.census && getStatusIcon(testResults.census.success)}
            </div>
            
            {testResults.census && (
              <div className="space-y-2">
                {testResults.census.success ? (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Population:</strong> {formatNumber(testResults.census.data?.population || 0)}
                    </div>
                    <div className="text-sm">
                      <strong>Median Income:</strong> {formatCurrency(testResults.census.data?.medianIncome || 0)}
                    </div>
                    <div className="text-sm">
                      <strong>Median Home Value:</strong> {formatCurrency(testResults.census.data?.medianHomeValue || 0)}
                    </div>
                    <div className="text-sm">
                      <strong>Education Level:</strong> 
                      <Badge variant="secondary" className="ml-2 capitalize">
                        {testResults.census.data?.educationLevel || 'unknown'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Response time: {testResults.census.requestTime}ms
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{testResults.census.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <Button 
              onClick={testCensusData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Test Census
            </Button>
          </CardContent>
        </Card>

        {/* FEMA Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              FEMA Data Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              {testResults.fema && getStatusIcon(testResults.fema.success)}
            </div>
            
            {testResults.fema && (
              <div className="space-y-2">
                {testResults.fema.success ? (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Flood Zone:</strong> {testResults.fema.data?.floodZone || 'Unknown'}
                    </div>
                    <div className="text-sm">
                      <strong>Risk Level:</strong> 
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 ${
                          testResults.fema.data?.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          testResults.fema.data?.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {testResults.fema.data?.riskLevel || 'unknown'}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <strong>Insurance Required:</strong> {testResults.fema.data?.floodInsuranceRequired ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Response time: {testResults.fema.requestTime}ms
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{testResults.fema.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <Button 
              onClick={testFEMAData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Test FEMA
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Combined Test Results */}
      {testResults.location && (
        <Card>
          <CardHeader>
            <CardTitle>Combined Location Data</CardTitle>
            <CardDescription>
              Results from both Census and FEMA APIs for the test location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Census Results</h4>
                {testResults.location.census?.success ? (
                  <div className="space-y-1 text-sm">
                    <div>✅ Census data retrieved successfully</div>
                    <div>Response time: {testResults.location.census.requestTime}ms</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <div>❌ Census data failed</div>
                    <div className="text-red-600">{testResults.location.census?.error}</div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">FEMA Results</h4>
                {testResults.location.fema?.success ? (
                  <div className="space-y-1 text-sm">
                    <div>✅ FEMA data retrieved successfully</div>
                    <div>Response time: {testResults.location.fema.requestTime}ms</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <div>❌ FEMA data failed</div>
                    <div className="text-red-600">{testResults.location.fema?.error}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>1. <strong>Set Location:</strong> Enter state, county, and coordinates</div>
          <div>2. <strong>Test Individual Sources:</strong> Click "Test Census" or "Test FEMA"</div>
          <div>3. <strong>Test All Sources:</strong> Click "Test All Sources" for comprehensive test</div>
          <div>4. <strong>Monitor Results:</strong> Check response times and data quality</div>
          <div className="text-muted-foreground mt-2">
            <strong>Note:</strong> These are real API calls to Census Bureau and FEMA servers. 
            Response times may vary based on network conditions and server load.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 