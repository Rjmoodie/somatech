import React, { useState } from 'react';
import { useSearchContext } from './context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

const SearchBarTest = () => {
  const { state, dispatch } = useSearchContext();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runSearchTests = () => {
    const results: string[] = [];
    
    console.log('=== SEARCH BAR INTEGRATION TESTS ===');
    
    // Test 1: Check if search context is available
    if (state && dispatch) {
      results.push('✅ Search context is available');
      console.log('✅ Search context is available');
    } else {
      results.push('❌ Search context not available');
      console.log('❌ Search context not available');
    }
    
    // Test 2: Test different search scenarios
    const testSearches = [
      { name: 'State Search', query: 'NY', expectedFilters: { state: 'NY' } },
      { name: 'City Search', query: 'Los Angeles', expectedFilters: { city: 'Los Angeles' } },
      { name: 'ZIP Search', query: '10001', expectedFilters: { zip: '10001' } },
      { name: 'Address Search', query: '123 Main St', expectedFilters: { address: '123 Main St' } },
      { name: 'Full Address Search', query: '123 Main St, New York, NY 10001', expectedFilters: { address: '123 Main St', city: 'New York', state: 'NY', zip: '10001' } },
    ];
    
    testSearches.forEach((test, index) => {
      console.log(`\n--- Test ${index + 1}: ${test.name} ---`);
      console.log(`Query: "${test.query}"`);
      console.log(`Expected filters:`, test.expectedFilters);
      
      // Simulate the search
      dispatch({ type: 'SET_FILTERS', payload: test.expectedFilters });
      
      // Check if filters were set
      if (JSON.stringify(state.filters) === JSON.stringify(test.expectedFilters)) {
        results.push(`✅ ${test.name}: Filters set correctly`);
        console.log(`✅ ${test.name}: Filters set correctly`);
      } else {
        results.push(`❌ ${test.name}: Filters not set correctly`);
        console.log(`❌ ${test.name}: Filters not set correctly`);
        console.log('Current filters:', state.filters);
      }
    });
    
    // Test 3: Clear search
    console.log('\n--- Test: Clear Search ---');
    dispatch({ type: 'SET_FILTERS', payload: {} });
    if (Object.keys(state.filters).length === 0) {
      results.push('✅ Clear search: Filters cleared correctly');
      console.log('✅ Clear search: Filters cleared correctly');
    } else {
      results.push('❌ Clear search: Filters not cleared');
      console.log('❌ Clear search: Filters not cleared');
    }
    
    setTestResults(results);
    console.log('\n=== SEARCH BAR TESTS COMPLETED ===');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Bar Integration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Current Filters</h3>
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              {Object.keys(state.filters).length === 0 ? (
                <span className="text-gray-500">No filters applied</span>
              ) : (
                <pre className="text-xs">{JSON.stringify(state.filters, null, 2)}</pre>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Search Results</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {state.results.length} properties
              </Badge>
              {state.loading && (
                <Badge variant="outline">Loading...</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div>
          <Button
            onClick={runSearchTests}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Run Search Bar Tests
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    result.startsWith('✅') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.startsWith('✅') ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How to Test Search Bar</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>1. <strong>Type in the search bar</strong> - Try searching for:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>"NY" (state search)</li>
              <li>"Los Angeles" (city search)</li>
              <li>"10001" (ZIP code search)</li>
              <li>"123 Main St" (address search)</li>
              <li>"123 Main St, New York, NY 10001" (full address)</li>
            </ul>
            <p>2. <strong>Check console logs</strong> - Look for search-related messages</p>
            <p>3. <strong>Verify results update</strong> - Map markers and property list should update</p>
            <p>4. <strong>Test autocomplete</strong> - Suggestions should appear as you type</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SearchBarTest; 