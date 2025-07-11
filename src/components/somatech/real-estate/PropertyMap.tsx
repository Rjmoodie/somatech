import React from 'react';
import EnhancedPropertyMap from './EnhancedPropertyMap';

interface PropertyMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null;
  onAddressChange?: (address: string) => void;
  initialAddress?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = (props) => {
  return <EnhancedPropertyMap {...props} />;
};

export default PropertyMap;