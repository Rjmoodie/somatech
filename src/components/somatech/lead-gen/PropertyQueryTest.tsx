import React, { useState } from 'react';
import { usePropertyLeads } from './usePropertyLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Home, User, Search, TestTube } from 'lucide-react';

const PropertyQueryTest = () => {
  const [filters, setFilters] = useState<any>({});
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Test different query scenarios
  const testQueries = [
    { name: 'All Properties', filters: {} },
    { name: 'NY Properties', filters: { state: 'NY' } },
    { name: 'Absentee Owners', filters: { owner_type: 'absentee' } },
    { name: 'High Value (>$500k)', filters: { estimated_value: 500000 } },
    { name: 'Active Status', filters: { status: 'active' } },
    { name: 'Los Angeles', filters: { city: 'Los Angeles' } },
  ];

  const { data: properties, isLoading: queryLoading, error } = usePropertyLeads(filters);

  const runTest = async (testQuery: any) => {
    setIsLoading(true);
    console.log('Running test:', testQuery.name, 'with filters:', testQuery.filters);
    
    // Simulate the query
    setFilters(testQuery.filters);
    
    // Wait a bit for the query to complete
    setTimeout(() => {
      setTestResults(properties || []);
      setIsLoading(false);
      console.log('Test completed. Results:', properties);
    }, 1000);
  };

  const runAllTests = async () => {
    console.log('=== STARTING PROPERTY QUERY TESTS ===');
    
    for (const test of testQueries) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait between tests
    }
    
    console.log('=== ALL TESTS COMPLETED ===');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Property Query Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Query Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Current Filters</Label>
            <div className="text-sm text-muted-foreground mt-1">
              {Object.keys(filters).length === 0 ? 'No filters' : JSON.stringify(filters, null, 2)}
            </div>
          </div>
          <div>
            <Label>Query Status</Label>
            <div className="flex items-center gap-2 mt-1">
              {queryLoading ? (
                <Badge variant="secondary">Loading...</Badge>
              ) : error ? (
                <Badge variant="destructive">Error</Badge>
              ) : (
                <Badge variant="default">Success</Badge>
              )}
              {properties && (
                <span className="text-sm text-muted-foreground">
                  {properties.length} properties found
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Manual Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>State</Label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger>
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
            <Label>Owner Type</Label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, owner_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select owner type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="absentee">Absentee</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Test Buttons */}
        <div>
          <Label>Quick Tests</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {testQueries.map((test, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => runTest(test)}
                disabled={isLoading}
              >
                {test.name}
              </Button>
            ))}
            <Button
              variant="default"
              size="sm"
              onClick={runAllTests}
              disabled={isLoading}
            >
              Run All Tests
            </Button>
          </div>
        </div>

        {/* Results Display */}
        <div>
          <Label>Query Results</Label>
          <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
            {properties?.map((property, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{property.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.city}, {property.state} {property.zip}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {property.bedrooms}bd {property.bathrooms}ba
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${(property.estimated_value / 1000).toFixed(0)}k
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {property.owner_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {property.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {property.tags.join(', ')}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {properties?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No properties found with current filters
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="font-medium text-red-800">Query Error</div>
            <div className="text-sm text-red-600 mt-1">{error.message}</div>
          </div>
        )}

        {/* Debug Info */}
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="font-medium cursor-pointer">Debug Information</summary>
          <div className="mt-2 text-sm space-y-2">
            <div>
              <strong>Current Filters:</strong>
              <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                {JSON.stringify(filters, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Query Key:</strong>
              <div className="bg-white p-2 rounded mt-1 text-xs">
                ['property-leads', {JSON.stringify(filters)}]
              </div>
            </div>
            <div>
              <strong>Total Properties Available:</strong>
              <div className="bg-white p-2 rounded mt-1 text-xs">
                {properties?.length || 0} properties
              </div>
            </div>
          </div>
        </details>

      </CardContent>
    </Card>
  );
};

export default PropertyQueryTest; 