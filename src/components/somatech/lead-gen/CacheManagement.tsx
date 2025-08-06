import React, { useState, useEffect } from 'react';
import { redisCache } from '@/services/redis-cache-service';
import { enhancedLeadService } from '@/services/enhanced-lead-service';
import { mlsService } from '@/services/mls-service';
import { advancedAnalyticsService } from '@/services/advanced-analytics-service';

interface CacheManagementProps {
  className?: string;
}

export const CacheManagement: React.FC<CacheManagementProps> = ({ className = '' }) => {
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);
  const [selectedCacheType, setSelectedCacheType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadCacheData();
    startAutoRefresh();
    return () => stopAutoRefresh();
  }, []);

  const loadCacheData = async () => {
    setLoading(true);
    try {
      const stats = redisCache.getStats();
      const allKeys = redisCache.keys('*');
      setCacheStats(stats);
      setCacheKeys(allKeys);
    } catch (error) {
      console.error('Error loading cache data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAutoRefresh = () => {
    const interval = setInterval(loadCacheData, 5000); // Refresh every 5 seconds
    setRefreshInterval(interval);
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  const handleClearAllCache = async () => {
    setLoading(true);
    try {
      redisCache.clear();
      await loadCacheData();
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCacheByType = async (cacheType: string) => {
    setLoading(true);
    try {
      switch (cacheType) {
        case 'property':
          await enhancedLeadService.invalidateAllPropertyCaches();
          break;
        case 'mls':
          await mlsService.invalidateAllMLSCaches();
          break;
        case 'analytics':
          await advancedAnalyticsService.invalidateAllAnalyticsCaches();
          break;
        case 'etl':
          const etlKeys = redisCache.keys('etl_pipeline:*');
          etlKeys.forEach(key => redisCache.delete(key));
          break;
        default:
          break;
      }
      await loadCacheData();
    } catch (error) {
      console.error(`Error clearing ${cacheType} cache:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSpecificKey = async (key: string) => {
    setLoading(true);
    try {
      redisCache.delete(key);
      await loadCacheData();
    } catch (error) {
      console.error('Error clearing specific key:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCacheTypeKeys = (type: string) => {
    switch (type) {
      case 'property':
        return cacheKeys.filter(key => key.startsWith('property:') || key.startsWith('property_search:') || key.startsWith('geospatial:') || key.startsWith('fulltext:'));
      case 'mls':
        return cacheKeys.filter(key => key.startsWith('mls_'));
      case 'analytics':
        return cacheKeys.filter(key => key.startsWith('market_analytics:') || key.startsWith('investment_analytics:') || key.startsWith('predictive_model:') || key.startsWith('market_insights:'));
      case 'etl':
        return cacheKeys.filter(key => key.startsWith('etl_pipeline:'));
      default:
        return cacheKeys;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getCacheTypeStats = (type: string) => {
    const typeKeys = getCacheTypeKeys(type);
    const totalKeys = cacheKeys.length;
    const typeCount = typeKeys.length;
    const percentage = totalKeys > 0 ? (typeCount / totalKeys) * 100 : 0;

    return {
      count: typeCount,
      percentage: percentage.toFixed(1)
    };
  };

  const cacheTypes = [
    { id: 'all', name: 'All Caches', color: 'bg-blue-500' },
    { id: 'property', name: 'Property Data', color: 'bg-green-500' },
    { id: 'mls', name: 'MLS Data', color: 'bg-purple-500' },
    { id: 'analytics', name: 'Analytics', color: 'bg-orange-500' },
    { id: 'etl', name: 'ETL Pipeline', color: 'bg-red-500' }
  ];

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cache Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={loadCacheData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleClearAllCache}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Clear All Cache
            </button>
          </div>
        </div>

        {/* Cache Statistics */}
        {cacheStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Items</h3>
              <p className="text-3xl font-bold text-blue-600">{cacheStats.size}</p>
              <p className="text-sm text-gray-500">Max: {cacheStats.maxSize}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hit Rate</h3>
              <p className="text-3xl font-bold text-green-600">{formatPercentage(cacheStats.hitRate)}</p>
              <p className="text-sm text-gray-500">Total Hits: {cacheStats.totalHits}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Requests</h3>
              <p className="text-3xl font-bold text-purple-600">{cacheStats.totalHits + cacheStats.totalMisses}</p>
              <p className="text-sm text-gray-500">Misses: {cacheStats.totalMisses}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cache Age</h3>
              <p className="text-3xl font-bold text-orange-600">
                {cacheStats.oldestItem ? Math.floor((Date.now() - cacheStats.oldestItem) / 60000) : 0}m
              </p>
              <p className="text-sm text-gray-500">Oldest item age</p>
            </div>
          </div>
        )}

        {/* Cache Type Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cache Types</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {cacheTypes.map((type) => {
                const stats = getCacheTypeStats(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCacheType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedCacheType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 ${type.color} rounded-full mb-2`}></div>
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-500">{stats.count} items</p>
                    <p className="text-xs text-gray-400">{stats.percentage}% of total</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cache Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cache Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cacheTypes.slice(1).map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleClearCacheByType(type.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Clear {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cache Keys */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cache Keys</h2>
            <p className="text-sm text-gray-500">
              Showing {getCacheTypeKeys(selectedCacheType).length} of {cacheKeys.length} total keys
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getCacheTypeKeys(selectedCacheType).map((key) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-900">{key}</p>
                    <p className="text-xs text-gray-500">
                      TTL: {redisCache.ttl(key)}s
                    </p>
                  </div>
                  <button
                    onClick={() => handleClearSpecificKey(key)}
                    disabled={loading}
                    className="ml-4 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {getCacheTypeKeys(selectedCacheType).length === 0 && (
                <p className="text-gray-500 text-center py-8">No cache keys found for this type.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 