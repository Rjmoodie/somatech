import React, { useEffect, useState } from 'react';
import { environment } from '@/config/environment';

const MapTest = () => {
  const [testResult, setTestResult] = useState<string>('Testing...');

  useEffect(() => {
    console.log('MapTest: Environment check');
    console.log('MapTest: MAPBOX_TOKEN =', environment.MAPBOX_TOKEN);
    console.log('MapTest: Token length =', environment.MAPBOX_TOKEN?.length);
    
    if (environment.MAPBOX_TOKEN && environment.MAPBOX_TOKEN.length > 0) {
      setTestResult('✅ Mapbox token is configured');
    } else {
      setTestResult('❌ Mapbox token is missing');
    }
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Map Test</h3>
      <p className="text-sm text-gray-600">{testResult}</p>
      <p className="text-xs text-gray-500 mt-2">
        Token: {environment.MAPBOX_TOKEN ? `${environment.MAPBOX_TOKEN.substring(0, 20)}...` : 'None'}
      </p>
    </div>
  );
};

export default MapTest; 