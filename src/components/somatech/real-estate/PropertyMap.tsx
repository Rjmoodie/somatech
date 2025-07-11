import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyMapProps {
  onAddressChange?: (address: string) => void;
  initialAddress?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ onAddressChange, initialAddress = "" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;

    // Initialize map with US centered view
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Fetch Mapbox token from Supabase secrets
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          throw error;
        }
        
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          throw new Error('No Mapbox token received');
        }
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
        setError('Failed to load map configuration. Please check your Mapbox token setup.');
      }
    };

    fetchMapboxToken();
  }, []);

  const geocodeAddress = async (searchAddress: string) => {
    if (!searchAddress.trim() || !mapboxToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=${mapboxToken}&country=US&types=address`
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const placeName = data.features[0].place_name;

        // Update map center and zoom
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true
        });

        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker({
          color: '#3b82f6'
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<div class="p-2"><strong>${placeName}</strong></div>`)
          )
          .addTo(map.current!);

        toast({
          title: "Address Found",
          description: `Successfully located: ${placeName}`,
        });

        onAddressChange?.(placeName);
      } else {
        setError('Address not found. Please try a different address.');
        toast({
          title: "Address Not Found",
          description: "Please check the address and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Failed to search for address. Please try again.');
      toast({
        title: "Search Error",
        description: "Failed to search for address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress(address);
  };

  // Show token input if no token is available
  if (!mapboxToken) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Label className="text-lg font-semibold">Property Location Map</Label>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Mapbox token required for map functionality. Please configure your Mapbox public token in the project settings.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.your-mapbox-token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get your token at{" "}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Label className="text-lg font-semibold">Property Location</Label>
          </div>

          <form onSubmit={handleAddressSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter property address (e.g., 123 Main St, New York, NY)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={loading || !address.trim()}
              size="icon"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <div 
              ref={mapContainer} 
              className="w-full h-80 rounded-lg border bg-muted"
              style={{ minHeight: '320px' }}
            />
            {loading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Use the controls to zoom, pan, and switch between map styles. Enter an address above to center the map on a specific property.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;