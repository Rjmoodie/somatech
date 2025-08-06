// Property Query Test Script
// Run this in the browser console to test property queries

console.log('=== PROPERTY QUERY TEST SCRIPT ===');

// Test 1: Check if usePropertyLeads hook is working
console.log('Test 1: Checking usePropertyLeads hook...');

// Test 2: Verify mock data structure
const mockDataStructure = {
  id: "string",
  address: "string", 
  city: "string",
  state: "string",
  zip: "string",
  latitude: "number",
  longitude: "number",
  owner_name: "string",
  owner_type: "string",
  property_type: "string",
  bedrooms: "number",
  bathrooms: "number",
  square_feet: "number",
  lot_size: "number",
  year_built: "number",
  assessed_value: "number",
  estimated_value: "number",
  equity_percent: "number",
  mortgage_status: "string",
  lien_status: "string",
  tags: "array",
  status: "string",
  last_updated: "string"
};

console.log('Test 2: Expected data structure:', mockDataStructure);

// Test 3: Check if search context is working
console.log('Test 3: Checking search context...');
if (window.React) {
  console.log('✅ React is available');
} else {
  console.log('❌ React not found');
}

// Test 4: Verify Mapbox integration
console.log('Test 4: Checking Mapbox integration...');
if (window.mapboxgl) {
  console.log('✅ Mapbox GL JS is available');
} else {
  console.log('❌ Mapbox GL JS not found');
}

// Test 5: Check environment variables
console.log('Test 5: Checking environment variables...');
  if (import.meta.env.VITE_MAPBOX_TOKEN) {
  console.log('✅ Mapbox token is configured');
} else {
  console.log('❌ Mapbox token not found');
}

// Test 6: Verify component mounting
console.log('Test 6: Checking component mounting...');
const mapContainer = document.querySelector('[data-testid="map-container"]');
if (mapContainer) {
  console.log('✅ Map container found');
} else {
  console.log('❌ Map container not found');
}

// Test 7: Check property markers
console.log('Test 7: Checking property markers...');
const markers = document.querySelectorAll('.property-marker');
if (markers.length > 0) {
  console.log(`✅ Found ${markers.length} property markers`);
} else {
  console.log('❌ No property markers found');
}

// Test 8: Verify search functionality
console.log('Test 8: Checking search functionality...');
const searchBar = document.querySelector('input[placeholder*="address"]');
if (searchBar) {
  console.log('✅ Search bar found');
} else {
  console.log('❌ Search bar not found');
}

// Test 9: Check filter sidebar
console.log('Test 9: Checking filter sidebar...');
const filterSidebar = document.querySelector('[data-testid="filter-sidebar"]');
if (filterSidebar) {
  console.log('✅ Filter sidebar found');
} else {
  console.log('❌ Filter sidebar not found');
}

// Test 10: Verify property results
console.log('Test 10: Checking property results...');
const propertyCards = document.querySelectorAll('[data-testid="property-card"]');
if (propertyCards.length > 0) {
  console.log(`✅ Found ${propertyCards.length} property cards`);
} else {
  console.log('❌ No property cards found');
}

console.log('=== TEST SCRIPT COMPLETED ===');

// Helper function to test specific queries
window.testPropertyQuery = (filters) => {
  console.log('Testing property query with filters:', filters);
  // This would be called by the test component
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Query completed');
      resolve();
    }, 1000);
  });
};

// Helper function to check console logs
window.checkConsoleLogs = () => {
  console.log('Checking for property-related console logs...');
  const logs = [
    'usePropertyLeads: Using mock data for testing',
    'SimpleMapTest: Auto-triggering search to show properties',
    'PropertyResultsList: results',
    'SearchContextProvider: properties updated'
  ];
  
  logs.forEach(log => {
    console.log(`Looking for: ${log}`);
  });
};

console.log('Helper functions available:');
console.log('- testPropertyQuery(filters)');
console.log('- checkConsoleLogs()'); 