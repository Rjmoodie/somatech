# Property Query Testing Guide

## Overview
This document outlines how to test the property query functionality in the real estate lead generation system.

## Test Components

### 1. PropertyQueryTest Component
Located at: `PropertyQueryTest.tsx`
- **Purpose**: Comprehensive testing interface for property queries
- **Access**: Click "Test Queries" button in the header
- **Features**:
  - Manual filter controls
  - Quick test buttons
  - Real-time results display
  - Debug information panel

### 2. Console Test Script
Located at: `test-property-queries.js`
- **Purpose**: Browser console testing utilities
- **Usage**: Copy and paste into browser console
- **Features**:
  - Environment checks
  - Component verification
  - Helper functions

## Testing Checklist

### ✅ Basic Functionality Tests

#### 1. Map Loading
- [ ] Map displays correctly
- [ ] Mapbox token is configured
- [ ] No console errors related to Mapbox

#### 2. Property Data Loading
- [ ] Properties appear on map as markers
- [ ] Property cards show in sidebar
- [ ] Console shows "usePropertyLeads: Using mock data for testing"

#### 3. Auto-Search Trigger
- [ ] Properties load automatically when map initializes
- [ ] Console shows "SimpleMapTest: Auto-triggering search to show properties"
- [ ] Map fits to show all properties

#### 4. Property Markers
- [ ] Markers display with property prices
- [ ] Markers are clickable
- [ ] Selected markers are highlighted
- [ ] Hover effects work

### ✅ Query Functionality Tests

#### 1. Filter Tests
Test these filters in the PropertyQueryTest component:

- [ ] **All Properties**: Should show 5 properties
- [ ] **NY Properties**: Should show 1 property (New York)
- [ ] **Absentee Owners**: Should show 2 properties
- [ ] **Active Status**: Should show 5 properties
- [ ] **Los Angeles**: Should show 1 property

#### 2. Search Bar Tests
- [ ] Search bar accepts input
- [ ] Autocomplete suggestions appear
- [ ] Search results update map markers
- [ ] Property cards update with search

#### 3. Filter Sidebar Tests
- [ ] Filter controls are functional
- [ ] Filters update property results
- [ ] Map markers update with filters
- [ ] Clear filters button works

### ✅ Integration Tests

#### 1. Context Integration
- [ ] SearchContextProvider manages state correctly
- [ ] Property selection works across components
- [ ] Filter changes propagate to all components

#### 2. Map Integration
- [ ] Property markers sync with search results
- [ ] Clicking markers selects properties
- [ ] Map bounds adjust to show all properties

#### 3. Data Flow
- [ ] usePropertyLeads hook returns correct data
- [ ] Mock data structure is valid
- [ ] Filtering logic works correctly

## Expected Console Output

When working correctly, you should see these console logs:

```
SimpleMapTest: Component mounted
SimpleMapTest: Container ref: [object HTMLDivElement]
SimpleMapTest: Token: pk.eyJ1Ijoicm9kenJqIiwiYSI6ImNtZGZibGtvdjBjMHIybG85aTlyYWExNncifQ.EUrooIX34z2SPRrR1WvnAQ
SimpleMapTest: Creating map...
SimpleMapTest: Map loaded successfully!
SimpleMapTest: Auto-triggering search to show properties
usePropertyLeads: Using mock data for testing
SearchContextProvider: properties updated [Array]
SearchContextProvider: mapped properties [Array]
SearchContextProvider: loading state false
PropertyResultsList: results [Array]
PropertyResultsList: selectedPropertyId undefined
```

## Test Data Verification

### Mock Properties Available
1. **New York Property**
   - Address: 123 Main St, New York, NY 10001
   - Value: $400k
   - Owner: Individual
   - Tags: distressed, vacant

2. **Los Angeles Property**
   - Address: 456 Oak Ave, Los Angeles, CA 90210
   - Value: $650k
   - Owner: Absentee
   - Tags: high_equity

3. **Houston Property**
   - Address: 789 Elm St, Houston, TX 77001
   - Value: $300k
   - Owner: LLC
   - Tags: llc_owned

4. **Miami Property**
   - Address: 321 Beach Blvd, Miami, FL 33139
   - Value: $550k
   - Owner: Absentee
   - Tags: absentee

5. **Phoenix Property**
   - Address: 654 Palm Dr, Phoenix, AZ 85001
   - Value: $750k
   - Owner: Corporation
   - Tags: high_value

## Troubleshooting

### Common Issues

#### 1. Map Not Loading
**Symptoms**: Blank map area, console errors
**Solutions**:
- Check Mapbox token configuration
- Verify internet connection
- Check browser console for errors

#### 2. No Properties Showing
**Symptoms**: Empty map, no markers
**Solutions**:
- Check console for "usePropertyLeads" logs
- Verify auto-search trigger is working
- Check filter settings

#### 3. Property Markers Not Interactive
**Symptoms**: Markers visible but not clickable
**Solutions**:
- Check CSS styles are injected
- Verify event listeners are attached
- Check for JavaScript errors

#### 4. Search Not Working
**Symptoms**: Search bar doesn't update results
**Solutions**:
- Check SearchContextProvider is wrapping components
- Verify dispatch functions are working
- Check filter logic in usePropertyLeads

### Debug Steps

1. **Open Browser Console**
   - Press F12 to open developer tools
   - Check for errors in Console tab

2. **Run Console Test Script**
   ```javascript
   // Copy and paste the test script from test-property-queries.js
   ```

3. **Check Component State**
   - Use React DevTools to inspect component state
   - Verify context values are correct

4. **Test Individual Components**
   - Use the PropertyQueryTest component
   - Test each filter individually

## Performance Testing

### Load Time
- [ ] Map loads within 3 seconds
- [ ] Properties appear within 1 second of map load
- [ ] No memory leaks during filter changes

### Responsiveness
- [ ] Map responds smoothly to zoom/pan
- [ ] Markers update quickly when filters change
- [ ] UI remains responsive during heavy operations

## Browser Compatibility

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Testing

Test on mobile devices:
- [ ] Map loads correctly on mobile
- [ ] Touch interactions work
- [ ] Property cards are readable
- [ ] Search bar is usable

## Success Criteria

The property query system is working correctly when:

1. ✅ Map displays with Mapbox integration
2. ✅ Properties appear as interactive markers
3. ✅ Search and filters update results in real-time
4. ✅ Property selection works across components
5. ✅ Mock data structure is valid and complete
6. ✅ No console errors related to property queries
7. ✅ Performance is acceptable on all target devices
8. ✅ UI is responsive and user-friendly

## Next Steps

Once testing is complete:

1. **Database Integration**: Replace mock data with real database queries
2. **Performance Optimization**: Implement property clustering for large datasets
3. **Advanced Features**: Add heat maps, analytics, and export functionality
4. **User Testing**: Gather feedback from real users
5. **Production Deployment**: Deploy to production environment 