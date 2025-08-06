import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Map, 
  School, 
  Mail, 
  Building, 
  Layers, 
  Eye, 
  EyeOff,
  Download,
  Info,
  Settings,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoundaryLayer {
  id: string;
  name: string;
  type: 'school_district' | 'zip_code' | 'county' | 'city' | 'census_tract';
  visible: boolean;
  color: string;
  opacity: number;
  data?: any[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface MapBoundaryOverlaysProps {
  isVisible: boolean;
  onToggleLayer: (layerId: string, visible: boolean) => void;
  onLayerSettingsChange: (layerId: string, settings: Partial<BoundaryLayer>) => void;
  onClose: () => void;
}

export const MapBoundaryOverlays: React.FC<MapBoundaryOverlaysProps> = ({
  isVisible,
  onToggleLayer,
  onLayerSettingsChange,
  onClose
}) => {
  const [layers, setLayers] = useState<BoundaryLayer[]>([
    {
      id: 'school_districts',
      name: 'School Districts',
      type: 'school_district',
      visible: false,
      color: '#3B82F6',
      opacity: 0.6
    },
    {
      id: 'zip_codes',
      name: 'ZIP Codes',
      type: 'zip_code',
      visible: false,
      color: '#10B981',
      opacity: 0.5
    },
    {
      id: 'counties',
      name: 'Counties',
      type: 'county',
      visible: false,
      color: '#F59E0B',
      opacity: 0.4
    },
    {
      id: 'cities',
      name: 'Cities',
      type: 'city',
      visible: false,
      color: '#8B5CF6',
      opacity: 0.5
    },
    {
      id: 'census_tracts',
      name: 'Census Tracts',
      type: 'census_tract',
      visible: false,
      color: '#EF4444',
      opacity: 0.3
    }
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockBoundaryData = {
    school_districts: [
      { id: 'sd_001', name: 'New York City School District', properties: 1250, avg_value: 450000 },
      { id: 'sd_002', name: 'Brooklyn School District', properties: 890, avg_value: 380000 },
      { id: 'sd_003', name: 'Queens School District', properties: 1100, avg_value: 420000 }
    ],
    zip_codes: [
      { id: '10001', name: '10001 - Manhattan', properties: 450, avg_value: 520000 },
      { id: '10002', name: '10002 - Lower East Side', properties: 320, avg_value: 480000 },
      { id: '10003', name: '10003 - East Village', properties: 280, avg_value: 550000 }
    ],
    counties: [
      { id: 'nyc', name: 'New York County', properties: 2500, avg_value: 480000 },
      { id: 'kings', name: 'Kings County', properties: 1800, avg_value: 420000 },
      { id: 'queens', name: 'Queens County', properties: 2200, avg_value: 380000 }
    ],
    cities: [
      { id: 'manhattan', name: 'Manhattan', properties: 2500, avg_value: 520000 },
      { id: 'brooklyn', name: 'Brooklyn', properties: 1800, avg_value: 420000 },
      { id: 'queens', name: 'Queens', properties: 2200, avg_value: 380000 }
    ],
    census_tracts: [
      { id: 'ct_001', name: 'Census Tract 001', properties: 150, avg_value: 450000 },
      { id: 'ct_002', name: 'Census Tract 002', properties: 120, avg_value: 480000 },
      { id: 'ct_003', name: 'Census Tract 003', properties: 180, avg_value: 420000 }
    ]
  };

  const handleLayerToggle = useCallback((layerId: string) => {
    const updatedLayers = layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    );
    setLayers(updatedLayers);
    
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onToggleLayer(layerId, !layer.visible);
    }
  }, [layers, onToggleLayer]);

  const handleLayerSettingsChange = useCallback((layerId: string, settings: Partial<BoundaryLayer>) => {
    const updatedLayers = layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, ...settings }
        : layer
    );
    setLayers(updatedLayers);
    onLayerSettingsChange(layerId, settings);
  }, [layers, onLayerSettingsChange]);

  const loadBoundaryData = useCallback(async (layerType: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = mockBoundaryData[layerType as keyof typeof mockBoundaryData] || [];
      
      const updatedLayers = layers.map(layer => 
        layer.type === layerType 
          ? { ...layer, data }
          : layer
      );
      setLayers(updatedLayers);
    } catch (error) {
      console.error('Error loading boundary data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [layers]);

  const exportBoundaryData = useCallback((layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer?.data) return;

    const csvData = [
      ['Boundary', 'Properties', 'Average Value'],
      ...layer.data.map((item: any) => [
        item.name,
        item.properties,
        `$${item.avg_value.toLocaleString()}`
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layer.name.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [layers]);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'school_district':
        return <School className="h-4 w-4" />;
      case 'zip_code':
        return <Mail className="h-4 w-4" />;
      case 'county':
        return <Building className="h-4 w-4" />;
      case 'city':
        return <Map className="h-4 w-4" />;
      case 'census_tract':
        return <Layers className="h-4 w-4" />;
      default:
        return <Map className="h-4 w-4" />;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed top-4 right-4 w-80 max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Boundary Overlays</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Administrative boundaries
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8"
          >
            ×
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 space-y-4">
          {/* Layer Controls */}
          <div className="space-y-3">
            {layers.map((layer) => (
              <Card key={layer.id} className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getLayerIcon(layer.type)}
                        <div>
                          <div className="font-medium text-sm">{layer.name}</div>
                          <div className="text-xs text-gray-500">
                            {layer.data ? `${layer.data.length} boundaries` : 'No data loaded'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={layer.visible}
                        onCheckedChange={() => handleLayerToggle(layer.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Layer Settings */}
                  <AnimatePresence>
                    {selectedLayer === layer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Color
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <div 
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: layer.color }}
                              />
                              <Select
                                value={layer.color}
                                onValueChange={(value) => handleLayerSettingsChange(layer.id, { color: value })}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="#3B82F6">Blue</SelectItem>
                                  <SelectItem value="#10B981">Green</SelectItem>
                                  <SelectItem value="#F59E0B">Orange</SelectItem>
                                  <SelectItem value="#8B5CF6">Purple</SelectItem>
                                  <SelectItem value="#EF4444">Red</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Opacity
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={layer.opacity}
                              onChange={(e) => handleLayerSettingsChange(layer.id, { opacity: parseFloat(e.target.value) })}
                              className="w-full mt-1"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(layer.opacity * 100)}%
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadBoundaryData(layer.type)}
                            disabled={isLoading}
                            className="flex-1 text-xs"
                          >
                            {isLoading ? 'Loading...' : 'Load Data'}
                          </Button>
                          {layer.data && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportBoundaryData(layer.id)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedLayers = layers.map(layer => ({ ...layer, visible: true }));
                  setLayers(updatedLayers);
                  layers.forEach(layer => onToggleLayer(layer.id, true));
                }}
                className="w-full justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show All Layers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedLayers = layers.map(layer => ({ ...layer, visible: false }));
                  setLayers(updatedLayers);
                  layers.forEach(layer => onToggleLayer(layer.id, false));
                }}
                className="w-full justify-start"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Hide All Layers
              </Button>
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Boundary Data</p>
                  <p>Administrative boundaries help identify market areas, school quality, and demographic patterns for investment analysis.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 