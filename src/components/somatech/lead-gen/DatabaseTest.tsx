import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseTest: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      setLoading(true);
      
      // Get all properties
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        return;
      }

      setProperties(data || []);
      console.log('🔍 All properties in database:', data);
      
      // Test search for philadelphia
      const { data: searchData, error: searchError } = await supabase
        .from('properties')
        .select('*')
        .ilike('city', '%philadelphia%');

      console.log('🔍 Search for "philadelphia" results:', searchData);
      
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Properties in Database ({properties.length})
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
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="border p-2">{prop.id}</td>
                  <td className="border p-2">{prop.address}</td>
                  <td className="border p-2">{prop.city}</td>
                  <td className="border p-2">{prop.state}</td>
                  <td className="border p-2">{prop.owner_name}</td>
                  <td className="border p-2">${prop.assessed_value?.toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={testDatabase}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  );
};

export default DatabaseTest; 