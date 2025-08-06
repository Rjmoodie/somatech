import * as mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'; // ShadCN
import { Filter, MapPin, RefreshCw } from 'lucide-react';

(window as any).mapboxgl = mapboxgl;
(window as any).mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function LeadMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    // Example pin
    new mapboxgl.Marker({ color: '#2563eb' })
      .setLngLat([-118.2437, 34.0522])
      .addTo(map);

    return () => map.remove();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 m-4 flex flex-col gap-6 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-blue-500" />
          <h2 className="font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100">Filters</h2>
        </div>
        {/* Add filter controls here, using ShadCN UI components */}
        <Button variant="outline" className="mt-auto flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Reset Filters
        </Button>
      </aside>
      {/* Map Area */}
      <main className="flex-1 flex items-center justify-center relative">
        <div
          ref={mapRef}
          className="h-[90vh] w-full max-w-6xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
        />
        {/* Floating Action Buttons */}
        <div className="absolute top-8 right-8 flex flex-col gap-3 z-10">
          <Button className="rounded-full shadow-lg" size="icon" variant="secondary">
            <MapPin className="w-5 h-5" />
          </Button>
          {/* Add more FABs for draw, zoom, etc. */}
        </div>
      </main>
    </div>
  );
} 