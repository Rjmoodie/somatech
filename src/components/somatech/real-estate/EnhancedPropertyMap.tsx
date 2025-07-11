import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Navigation, Layers } from 'lucide-react';
import { useError } from '../ErrorProvider';
import { usePerformance } from '../PerformanceProvider';
import { toast } from '@/hooks/use-toast';

interface PropertyMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { reportError } = useError();
  const { trackPerformance, debounce } = usePerformance();

  // Fetch Mapbox token from Supabase Edge Function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const response = await fetch('/functions/v1/get-mapbox-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMapboxToken(data.token);
        } else {
          // Token fetch failed, show input for manual entry
          console.warn('Failed to fetch Mapbox token from edge function');
        }
      } catch (error) {
        console.warn('Error fetching Mapbox token:', error);
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    trackPerformance('mapInitialization', async () => {
      try {
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-74.006, 40.7128], // NYC default
          zoom: 10,
          attributionControl: true,
        });

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add geolocate control
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        });
        map.current.addControl(geolocate, 'top-right');

        // Map click handler
        map.current.on('click', async (e) => {
          const { lng, lat } = e.lngLat;
          await handleLocationSelect(lng, lat);
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          
          // Add property markers layer for future use
          map.current?.addSource('properties', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          map.current?.addLayer({
            id: 'property-markers',
            type: 'circle',
            source: 'properties',
            paint: {
              'circle-radius': 8,
              'circle-color': '#3b82f6',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });
        });

      } catch (error) {
        reportError(error as Error, 'map-initialization');
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [mapboxToken, trackPerformance, reportError]);

  // Update marker when selected location changes
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    marker.current = new mapboxgl.Marker({
      color: '#3b82f6',
      draggable: true,
    })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map.current);

    // Handle marker drag
    marker.current.on('dragend', async () => {
      if (!marker.current) return;
      const lngLat = marker.current.getLngLat();
      await handleLocationSelect(lngLat.lng, lngLat.lat);
    });

    // Fly to location
    map.current.flyTo({
      center: [selectedLocation.lng, selectedLocation.lat],
      zoom: 15,
      duration: 1000,
    });
  }, [selectedLocation]);

  const handleLocationSelect = async (lng: number, lat: number) => {
    if (!onLocationSelect) return;

    setLoading(true);
    try {
      // Reverse geocoding
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=address`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({
          lat,
          lng,
          address,
        });

        toast({
          title: "Location Selected",
          description: address,
          variant: "default",
        });
      }
    } catch (error) {
      reportError(error as Error, 'location-select');
      // Fallback to coordinates
      onLocationSelect({
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = debounce(async (query: string) => {
    if (!query.trim() || !mapboxToken) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=US&types=address,poi`
      );
      
      if (response.ok) {
        const data = await response.json();
        const firstResult = data.features[0];
        
        if (firstResult) {
          const [lng, lat] = firstResult.center;
          await handleLocationSelect(lng, lat);
        } else {
          toast({
            title: "Location Not Found",
            description: "Try a different search term or click on the map.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      reportError(error as Error, 'location-search');
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  if (!mapboxToken) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Location Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To use the map feature, please enter your Mapbox public token below. 
            You can get one for free at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token (pk.)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your token is stored locally and not sent to our servers.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location Map
        </CardTitle>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for an address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !searchQuery.trim()}>
            <Navigation className="h-4 w-4" />
          </Button>
        </form>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapContainer} 
          className="w-full h-64 rounded-b-lg relative"
          style={{ minHeight: '256px' }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-b-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-5 w-5 animate-pulse" />
                <span>Loading map...</span>
              </div>
            </div>
          )}
        </div>
        {selectedLocation && (
          <div className="p-3 border-t bg-muted/30">
            <p className="text-sm font-medium">Selected Location:</p>
            <p className="text-xs text-muted-foreground">{selectedLocation.address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyMap;