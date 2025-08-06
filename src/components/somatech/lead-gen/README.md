# Real Estate Lead Generation System

## Overview
This module provides a comprehensive real estate lead generation system with interactive mapping, property search, and data visualization capabilities.

## Features

### 🗺️ Interactive Property Map
- **Mapbox Integration**: Real-time property mapping with custom markers
- **Property Markers**: Interactive markers showing property prices and details
- **Auto-Loading**: Properties automatically load when the map initializes
- **Click Interactions**: Click markers to select properties and view details
- **Responsive Design**: Works on desktop and mobile devices

### 🔍 Advanced Search & Filtering
- **Search Bar**: Address, city, and ZIP code search with autocomplete
- **Filter Sidebar**: Comprehensive filtering by location, property type, owner type, and financial criteria
- **Real-time Results**: Instant updates as you modify search criteria
- **Saved Searches**: Save and reuse search configurations

### 📊 Property Data
- **Comprehensive Details**: Address, owner info, property specs, financial data
- **Property Cards**: Detailed property information with save/unsave functionality
- **Property Details**: Full property analysis and contact information
- **Export Capabilities**: Export search results to CSV

### 🎯 Lead Management
- **Saved Leads**: Save interesting properties for later review
- **Lead Tracking**: Track your saved properties and notes
- **Campaign Management**: Organize leads into campaigns
- **Export Tools**: Export leads for external CRM systems

## Components

### Core Components
- `SimpleMapTest.tsx` - Main interactive map component
- `PropertyResultsList.tsx` - Property list sidebar
- `SearchBar.tsx` - Search interface with autocomplete
- `FilterSidebar.tsx` - Advanced filtering controls
- `PropertyCard.tsx` - Individual property display cards
- `PropertyDetailView.tsx` - Detailed property information

### Data Management
- `usePropertyLeads.ts` - Data fetching hook with filtering
- `context.tsx` - Global state management for search and results
- `types.ts` - TypeScript type definitions

## Map Features

### Property Markers
- **Visual Design**: Clean, modern marker design with property icons
- **Price Display**: Shows estimated property value on each marker
- **Selection State**: Selected properties are highlighted
- **Hover Effects**: Smooth animations and visual feedback

### Map Controls
- **Navigation**: Zoom, pan, and rotate controls
- **Geolocation**: Find user's current location
- **Auto-fit**: Automatically fits map to show all properties
- **Responsive**: Adapts to different screen sizes

## Data Structure

### Property Data Fields
```typescript
interface PropertyLead {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  owner_name: string;
  owner_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
  assessed_value: number;
  estimated_value: number;
  equity_percent: number;
  mortgage_status: string;
  lien_status: string;
  tags: string[];
  status: string;
  last_updated: string;
}
```

## Usage

### Basic Map Display
The map automatically loads and displays properties when the component mounts. No additional configuration required.

### Search Properties
1. Use the search bar to find properties by address, city, or ZIP
2. Apply filters in the sidebar to narrow results
3. Click on map markers to select properties
4. View detailed information in the property cards

### Save Properties
1. Click the save button on any property card
2. Saved properties are tracked per user
3. Access saved leads from the sidebar

## Technical Implementation

### Mapbox Integration
- Uses Mapbox GL JS for interactive mapping
- Custom marker styling with CSS
- Real-time property data integration
- Responsive design for all devices

### State Management
- React Context for global state
- React Query for data fetching
- Optimistic updates for better UX

### Performance
- Debounced search inputs
- Efficient marker rendering
- Lazy loading of property details
- Memoized components for better performance

## Future Enhancements

### Planned Features
- [ ] Heat map visualization
- [ ] Property clustering for dense areas
- [ ] Advanced analytics dashboard
- [ ] Integration with external data sources
- [ ] Mobile-optimized interface
- [ ] Offline capability

### Database Integration
- [ ] Real properties table creation
- [ ] Data import/export tools
- [ ] Automated data updates
- [ ] User permission management

## Troubleshooting

### Map Not Loading
- Check Mapbox token configuration
- Verify internet connection
- Check browser console for errors

### No Properties Showing
- Ensure search filters are not too restrictive
- Check that properties have valid coordinates
- Verify data source is accessible

### Performance Issues
- Reduce number of visible markers
- Implement property clustering
- Use pagination for large datasets 