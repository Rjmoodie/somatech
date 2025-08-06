import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseDebug: React.FC = () => {
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      
      // Get all properties without any filters
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setError(`Database error: ${error.message}`);
        return;
      }

      setAllProperties(data || []);
      console.log('🔍 All properties in database:', data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSearch = async (searchTerm: string) => {
    try {
      console.log(`🔍 Testing search for: "${searchTerm}"`);
      
      // Test different search approaches
      const { data: exactMatch, error: exactError } = await supabase
        .from('properties')
        .select('*')
        .eq('city', searchTerm.toLowerCase());

      const { data: containsMatch, error: containsError } = await supabase
        .from('properties')
        .select('*')
        .ilike('city', `%${searchTerm}%`);

      const { data: addressMatch, error: addressError } = await supabase
        .from('properties')
        .select('*')
        .ilike('address', `%${searchTerm}%`);

      console.log('Exact city match:', exactMatch?.length || 0, exactMatch);
      console.log('Contains city match:', containsMatch?.length || 0, containsMatch);
      console.log('Address match:', addressMatch?.length || 0, addressMatch);
      
    } catch (err) {
      console.error('Search test error:', err);
    }
  };

  if (loading) return <div className="p-4">Loading database contents...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Debug - All Properties</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Quick Search Tests</h2>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => testSearch('philadelphia')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Test "philadelphia"
          </button>
          <button 
            onClick={() => testSearch('new york')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Test "new york"
          </button>
          <button 
            onClick={() => testSearch('123')}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Test "123"
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          All Properties in Database ({allProperties.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Address</th>
                <th className="border p-2 text-left">City</th>
                <th className="border p-2 text-left">State</th>
                <th className="border p-2 text-left">Owner</th>
                <th className="border p-2 text-left">Value</th>
                <th className="border p-2 text-left">Coordinates</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {allProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="border p-2">{prop.id}</td>
                  <td className="border p-2">{prop.address}</td>
                  <td className="border p-2">{prop.city}</td>
                  <td className="border p-2">{prop.state}</td>
                  <td className="border p-2">{prop.owner_name}</td>
                  <td className="border p-2">${prop.assessed_value?.toLocaleString() || 'N/A'}</td>
                  <td className="border p-2">
                    {prop.latitude && prop.longitude 
                      ? `${prop.latitude}, ${prop.longitude}`
                      : '❌ Missing'
                    }
                  </td>
                  <td className="border p-2">{prop.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Database Schema</h2>
        <div className="p-3 bg-gray-100 rounded font-mono text-sm">
          <p>Table: properties</p>
          <p>Total records: {allProperties.length}</p>
          <p>Fields with data: {allProperties.length > 0 ? Object.keys(allProperties[0]).join(', ') : 'None'}</p>
        </div>
      </div>

      <button 
        onClick={fetchAllProperties}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default DatabaseDebug; 