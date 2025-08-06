import React, { useRef, useEffect, useState } from "react";
import { useSearchContext } from "./context";
// NOTE: You must install mapbox-gl and @types/mapbox-gl, and set VITE_MAPBOX_TOKEN in your .env file
import * as mapboxgl from "mapbox-gl";
import { LoadingSpinner } from "./Microinteractions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, DollarSign, Home } from "lucide-react";
import { environment } from "@/config/environment";

export const MapEngine = () => {
  const { state, dispatch } = useSearchContext();
  const [mapContainerElement, setMapContainerElement] = useState<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [containerReady, setContainerReady] = useState(false);

  // Get the Mapbox token
  const mapboxToken = environment.MAPBOX_TOKEN;
  
  console.log('MapEngine Debug:', {
    mapboxToken: mapboxToken ? 'Token exists' : 'No token',
    tokenLength: mapboxToken?.length,
    containerElement: mapContainerElement ? 'Container exists' : 'No container',
    propertiesCount: state.results?.length || 0,
    properties: state.results?.slice(0, 3) || [],
    loading: state.loading,
    error: state.error,
    containerReady,
    isMapLoading,
    propertiesWithCoordinates: state.results?.filter(p => p.latitude && p.longitude).length || 0,
    propertiesWithoutCoordinates: state.results?.filter(p => !p.latitude || !p.longitude).length || 0
  });

  // Effect to handle map initialization when container is ready
  useEffect(() => {
    console.log('MapEngine useEffect triggered');
    
    if (!mapboxToken) {
      console.log('No Mapbox token available');
      setMapError("Mapbox token not configured");
      setIsMapLoading(false);
      return;
    }

    if (mapRef.current) {
      console.log('Map already exists');
      return;
    }

    // Function to initialize the map
    const initializeMap = () => {
      if (!mapContainerElement) {
        console.log('Container not ready yet, retrying...');
        return false;
      }

      try {
        console.log('Setting up Mapbox access token');
        // Set the access token
        (window as any).mapboxgl = mapboxgl;
        (window as any).mapboxgl.accessToken = mapboxToken;
        
        console.log('Creating Mapbox map');
        mapRef.current = new mapboxgl.Map({
          container: mapContainerElement,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [environment.DEFAULT_MAP_CENTER.lng, environment.DEFAULT_MAP_CENTER.lat],
          zoom: environment.DEFAULT_MAP_ZOOM,
        });

        console.log('Map created, setting up load handler');
        
        mapRef.current.on("load", () => {
          console.log('Map loaded successfully');
          setIsMapLoading(false);
          setContainerReady(true);
          
          // Add property markers after map loads
          addPropertyMarkers();
        });

        mapRef.current.on("error", (e) => {
          console.error("Mapbox error:", e);
          setMapError("Map loading failed");
          setIsMapLoading(false);
        });

        return true;
      } catch (error) {
        console.error("Error creating map:", error);
        setMapError("Failed to create map");
        setIsMapLoading(false);
        return false;
      }
    };

    // Function to add property markers to the map
    const addPropertyMarkers = () => {
      if (!mapRef.current) {
        console.log('No map available for markers');
        return;
      }

      // Use state results or fallback to test data
      const propertiesToShow = state.results && state.results.length > 0 
        ? state.results 
        : [
            {
              id: "test-1",
              address: "123 Test St",
              city: "New York",
              state: "NY",
              zip: "10001",
              latitude: 40.7128,
              longitude: -74.0060,
              owner_name: "Test Owner",
              estimated_value: 400000,
              equity_percent: 75,
              bedrooms: 3,
              bathrooms: 2
            },
            {
              id: "test-2", 
              address: "456 Test Ave",
              city: "Los Angeles",
              state: "CA",
              zip: "90210",
              latitude: 34.0522,
              longitude: -118.2437,
              owner_name: "Test Owner 2",
              estimated_value: 650000,
              equity_percent: 60,
              bedrooms: 4,
              bathrooms: 3
            }
          ];

      console.log(`Adding ${propertiesToShow.length} property markers to map`);
      console.log('Properties to show:', propertiesToShow);

      // Clear existing markers
      const existingMarkers = document.querySelectorAll('.property-marker');
      existingMarkers.forEach(marker => marker.remove());

      propertiesToShow.forEach((property, index) => {
        if (!property.latitude || !property.longitude) {
          console.log(`Property ${property.id} missing coordinates:`, property);
          return;
        }

        console.log(`Creating marker for property ${property.id} at ${property.latitude}, ${property.longitude}`);

        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'property-marker';
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.background = '#3b82f6';
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '2px solid white';
        markerEl.style.cursor = 'pointer';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';
        markerEl.style.color = 'white';
        markerEl.style.fontSize = '12px';
        markerEl.style.fontWeight = 'bold';
        markerEl.innerHTML = '$';

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${property.address}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">${property.city}, ${property.state} ${property.zip}</p>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-size: 12px; color: #6b7280;">Owner:</span>
              <span style="font-size: 12px; font-weight: 500;">${property.owner_name || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="font-size: 12px; color: #6b7280;">Value:</span>
              <span style="font-size: 12px; font-weight: 500;">$${property.estimated_value?.toLocaleString() || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="font-size: 12px; color: #6b7280;">Equity:</span>
              <span style="font-size: 12px; font-weight: 500;">${property.equity_percent || 0}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="font-size: 12px; color: #6b7280;">Beds/Baths:</span>
              <span style="font-size: 12px; font-weight: 500;">${property.bedrooms || 0}/${property.bathrooms || 0}</span>
            </div>
          </div>
        `);

        // Create and add marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([property.longitude, property.latitude])
          .setPopup(popup)
          .addTo(mapRef.current);

        console.log(`Marker added for property ${property.id}`);

        // Add click handler
        markerEl.addEventListener('click', () => {
          console.log('Property clicked:', property);
          // Dispatch action to select property by ID
          dispatch({ type: 'SELECT_PROPERTY', payload: property.id });
        });
      });

      // Fit map to show all markers if there are properties
      if (propertiesToShow.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        propertiesToShow.forEach(property => {
          if (property.latitude && property.longitude) {
            bounds.extend([property.longitude, property.latitude]);
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log('Fitting map to bounds:', bounds);
          mapRef.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        }
      }
    };

    // Try to initialize immediately
    if (!initializeMap()) {
      // If container not ready, retry after a short delay
      const timer = setTimeout(() => {
        console.log('Retrying map initialization...');
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mapContainerElement, mapboxToken]);

  // Effect to update markers when properties change
  useEffect(() => {
    if (mapRef.current && containerReady && state.results) {
      console.log('Properties updated, refreshing markers');
      console.log('Total properties:', state.results.length);
      console.log('Properties with coordinates:', state.results.filter(p => p.latitude && p.longitude).length);
      console.log('Sample properties:', state.results.slice(0, 3));
      addPropertyMarkers();
    }
  }, [state.results, containerReady]);

  // Effect to handle container element changes
  useEffect(() => {
    if (mapContainerElement && mapboxToken && !mapRef.current) {
      console.log('Container is now available, triggering map initialization');
      // This will trigger the main useEffect
    }
  }, [mapContainerElement, mapboxToken]);

  // Show loading state
  if (isMapLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-yellow-100 border-2 border-yellow-500">
        <div className="text-center">
          <LoadingSpinner />
          <span className="ml-2">Loading map...</span>
          <div className="text-xs text-gray-600 mt-2">
            Properties: {state.results?.length || 0}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {mapError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
            >
              Get Mapbox Token
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fallback simple map if Mapbox fails
  if (!mapboxToken) {
    return (
      <div className="relative h-full w-full">
        <div className="h-full w-full bg-gray-100 rounded-lg p-4">
          <div className="text-center mb-4">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Simple Property Map</h3>
            <p className="text-sm text-gray-500">Mapbox not configured - showing properties as grid</p>
          </div>
          
          {/* Simple property grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {state.results && state.results.length > 0 ? (
              state.results.slice(0, 6).map((property, index) => (
                <div key={property.id || index} className="bg-white p-3 rounded border shadow-sm">
                  <div className="font-medium text-sm">{property.address}</div>
                  <div className="text-xs text-gray-500">{property.city}, {property.state}</div>
                  <div className="text-xs text-blue-600 font-medium">
                    ${property.estimated_value?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              // Test properties
              [
                { id: "test-1", address: "123 Test St", city: "New York", state: "NY", estimated_value: 400000 },
                { id: "test-2", address: "456 Test Ave", city: "Los Angeles", state: "CA", estimated_value: 650000 },
                { id: "test-3", address: "789 Test Blvd", city: "Houston", state: "TX", estimated_value: 300000 }
              ].map((property) => (
                <div key={property.id} className="bg-white p-3 rounded border shadow-sm">
                  <div className="font-medium text-sm">{property.address}</div>
                  <div className="text-xs text-gray-500">{property.city}, {property.state}</div>
                  <div className="text-xs text-blue-600 font-medium">
                    ${property.estimated_value?.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500">
              {state.results?.length || 0} properties found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div 
        ref={(el) => {
          console.log('MapEngine: ref callback called with:', el);
          setMapContainerElement(el);
        }}
        className="h-full w-full rounded-lg overflow-hidden" 
        data-testid="map-container"
      />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg border">
        <div className="text-xs font-medium text-gray-700">
          {state.results?.length || 0} Properties
        </div>
        {state.results && state.results.length > 0 && (
          <div className="text-xs text-gray-500">
            {state.results.filter(p => p.latitude && p.longitude).length} with coordinates
          </div>
        )}
        {(!state.results || state.results.length === 0) && (
          <div className="text-xs text-orange-600 font-medium">
            Using test data
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {state.loading && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <LoadingSpinner />
            <div className="text-sm font-medium text-gray-700 mt-2">Loading properties...</div>
          </div>
        </div>
      )}

      {/* No Properties Message */}
      {(!state.results || state.results.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg border">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your search filters to find properties in this area.
            </p>
            <div className="text-xs text-gray-400">
              Properties with coordinates will appear as markers on the map
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapEngine; 