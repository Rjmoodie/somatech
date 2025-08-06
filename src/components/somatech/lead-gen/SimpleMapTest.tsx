import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '@/config/environment';
import { useSearchContext } from './context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Home, User, Search, BarChart3, Layers, Eye, EyeOff } from 'lucide-react';
import { MapAreaAnalytics } from './MapAreaAnalytics';
import { MapBoundaryOverlays } from './MapBoundaryOverlays';

// Add CSS styles for property markers
const markerStyles = `
  .property-marker {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .property-marker:hover {
    transform: scale(1.1);
    z-index: 1000;
  }
  
  .marker-content {
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    padding: 4px 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    min-width: 60px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #1f2937;
    transition: all 0.2s ease;
  }
  
  .marker-content:hover {
    border-color: #1d4ed8;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .marker-content.selected {
    border-color: #059669;
    background: #ecfdf5;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }
  
  .marker-icon {
    font-size: 16px;
    margin-bottom: 2px;
  }
  
  .marker-price {
    color: #059669;
    font-weight: 700;
  }

  .map-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .map-control-button {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .map-control-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .map-control-button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const SimpleMapTest = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const { state, dispatch } = useSearchContext();
  const { results, selectedPropertyId } = state;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasTriggeredSearch, setHasTriggeredSearch] = useState(false);
  
  // New state for analytics and overlays
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBoundaryOverlays, setShowBoundaryOverlays] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());

  // Inject marker styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = markerStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Auto-trigger search when component mounts
  useEffect(() => {
    if (!hasTriggeredSearch) {
      console.log('SimpleMapTest: Auto-triggering search to show properties');
      dispatch({ 
        type: "SET_FILTERS", 
        payload: { 
          status: "active" // Show all active properties
        } 
      });
      setHasTriggeredSearch(true);
    }
  }, [dispatch, hasTriggeredSearch]);

  useEffect(() => {
    console.log('SimpleMapTest: Component mounted');
    console.log('SimpleMapTest: Container ref:', mapContainer.current);
    console.log('SimpleMapTest: Token:', environment.MAPBOX_TOKEN);

    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      mapboxgl.accessToken = environment.MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.006, 40.7128], // NYC
        zoom: 10,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.current.on('load', () => {
        console.log('SimpleMapTest: Map loaded successfully');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('SimpleMapTest: Map error:', e);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Clear and add markers when results change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    console.log('SimpleMapTest: Updating markers, results count:', results.length);

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (results.length === 0) {
      console.log('SimpleMapTest: No results to display');
      return;
    }

    // Add new markers
    results.forEach((property) => {
      if (!property.coordinates || !property.coordinates[0] || !property.coordinates[1]) {
        console.log('SimpleMapTest: Skipping property without coordinates:', property.address);
        return;
      }

      const [lng, lat] = property.coordinates;
      
      // Create custom HTML marker
      const markerElement = document.createElement('div');
      markerElement.className = 'property-marker';
      
      const isSelected = selectedPropertyId === property.id;
      const markerContent = `
        <div class="marker-content ${isSelected ? 'selected' : ''}">
          <div class="marker-icon">🏠</div>
          <div class="marker-price">$${(property.estimated_value || 0).toLocaleString()}</div>
        </div>
      `;
      
      markerElement.innerHTML = markerContent;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        console.log('SimpleMapTest: Property clicked:', property.address);
        dispatch({ type: "SELECT_PROPERTY", payload: property.id });
      });

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (results.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      results.forEach((property) => {
        if (property.coordinates && property.coordinates[0] && property.coordinates[1]) {
          bounds.extend(property.coordinates as [number, number]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current!.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }
  }, [results, selectedPropertyId, mapLoaded, dispatch]);

  // Handle area selection for analytics
  const handleAreaSelection = (area: any) => {
    setSelectedArea(area);
    setShowAnalytics(true);
  };

  // Handle layer toggles for boundary overlays
  const handleLayerToggle = (layerId: string, visible: boolean) => {
    const newActiveLayers = new Set(activeLayers);
    if (visible) {
      newActiveLayers.add(layerId);
    } else {
      newActiveLayers.delete(layerId);
    }
    setActiveLayers(newActiveLayers);
    
    // Here you would typically update the map layers
    console.log('SimpleMapTest: Layer toggle:', layerId, visible);
  };

  const handleLayerSettingsChange = (layerId: string, settings: any) => {
    console.log('SimpleMapTest: Layer settings changed:', layerId, settings);
    // Here you would typically update the map layer styling
  };

  const triggerDefaultSearch = () => {
    console.log('SimpleMapTest: Triggering default search');
    dispatch({ 
      type: "SET_FILTERS", 
      payload: { 
        status: "active"
      } 
    });
  };

  if (!environment.MAPBOX_TOKEN) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <div className="text-red-500 mb-4">
            <Search className="h-12 w-12 mx-auto mb-2" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please configure your Mapbox access token to display the interactive map.
          </p>
          <Button onClick={triggerDefaultSearch} variant="outline">
            Continue Without Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="map-controls">
        <button
          className={`map-control-button ${showAnalytics ? 'active' : ''}`}
          onClick={() => setShowAnalytics(!showAnalytics)}
          title="Area Analytics"
        >
          <BarChart3 className="h-4 w-4" />
        </button>
        
        <button
          className={`map-control-button ${showBoundaryOverlays ? 'active' : ''}`}
          onClick={() => setShowBoundaryOverlays(!showBoundaryOverlays)}
          title="Boundary Overlays"
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}

      {/* Area Analytics Panel */}
      <MapAreaAnalytics
        isVisible={showAnalytics}
        selectedArea={selectedArea}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Boundary Overlays Panel */}
      <MapBoundaryOverlays
        isVisible={showBoundaryOverlays}
        onToggleLayer={handleLayerToggle}
        onLayerSettingsChange={handleLayerSettingsChange}
        onClose={() => setShowBoundaryOverlays(false)}
      />
    </div>
  );
};

export default SimpleMapTest; 