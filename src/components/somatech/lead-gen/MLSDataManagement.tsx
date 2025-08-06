import React, { useState, useEffect } from 'react';
import { mlsService, MLSFilters, MLSListing, MLSDataSource, MLSSyncLog } from '@/services/mls-service';
import { etlPipelineManager } from '@/services/etl-pipeline';

interface MLSDataManagementProps {
  className?: string;
}

export const MLSDataManagement: React.FC<MLSDataManagementProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'analytics' | 'sources' | 'sync'>('listings');
  const [listings, setListings] = useState<MLSListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dataSources, setDataSources] = useState<MLSDataSource[]>([]);
  const [syncLogs, setSyncLogs] = useState<MLSSyncLog[]>([]);
  const [filters, setFilters] = useState<MLSFilters>({});
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, [activeTab, currentPage, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'listings':
          const listingsData = await mlsService.getMLSListings(filters, currentPage, pageSize);
          setListings(listingsData.listings);
          setTotalListings(listingsData.total);
          break;
        case 'analytics':
          const analyticsData = await mlsService.getMLSAnalytics();
          setAnalytics(analyticsData);
          break;
        case 'sources':
          const sourcesData = await mlsService.getMLSDataSources();
          setDataSources(sourcesData);
          break;
        case 'sync':
          const logsData = await mlsService.getRecentSyncLogs(20);
          setSyncLogs(logsData);
          break;
      }
    } catch (error) {
      console.error('Error loading MLS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof MLSFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSyncSource = async (sourceName: string) => {
    setSyncStatus(`Syncing ${sourceName}...`);
    try {
      const result = await etlPipelineManager.runPipeline(sourceName);
      setSyncStatus(`${sourceName} sync completed: ${result.propertiesProcessed} properties processed`);
      await loadData(); // Refresh data
    } catch (error) {
      setSyncStatus(`Error syncing ${sourceName}: ${error}`);
    }
  };

  const handleSyncAll = async () => {
    setSyncStatus('Syncing all MLS sources...');
    try {
      const results = await etlPipelineManager.runAllPipelines();
      const totalProcessed = results.reduce((sum, result) => sum + result.propertiesProcessed, 0);
      setSyncStatus(`All sources synced: ${totalProcessed} properties processed`);
      await loadData(); // Refresh data
    } catch (error) {
      setSyncStatus(`Error syncing all sources: ${error}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderListingsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MLS Source</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.mls_source || ''}
              onChange={(e) => handleFilterChange('mls_source', e.target.value || undefined)}
            >
              <option value="">All Sources</option>
              <option value="rentspree">RentSpree</option>
              <option value="realtymole">RealtyMole</option>
              <option value="mlsgrid">MLS Grid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.listing_status?.[0] || ''}
              onChange={(e) => handleFilterChange('listing_status', e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.price_min || ''}
                onChange={(e) => handleFilterChange('price_min', e.target.value ? Number(e.target.value) : undefined)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.price_max || ''}
                onChange={(e) => handleFilterChange('price_max', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.bedrooms_min || ''}
                onChange={(e) => handleFilterChange('bedrooms_min', e.target.value ? Number(e.target.value) : undefined)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.bedrooms_max || ''}
                onChange={(e) => handleFilterChange('bedrooms_max', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">MLS Listings ({totalListings})</h3>
            <div className="flex space-x-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={`${filters.sort_by || 'created_at'}-${filters.sort_order || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sort_by', sortBy);
                  handleFilterChange('sort_order', sortOrder);
                }}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="listing_price-desc">Price High to Low</option>
                <option value="listing_price-asc">Price Low to High</option>
                <option value="days_on_market-asc">Days on Market</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <div className="divide-y">
            {listings.map((listing) => (
              <div key={listing.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold">{listing.property_description || 'No Description'}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.listing_status === 'active' ? 'bg-green-100 text-green-800' :
                        listing.listing_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        listing.listing_status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.listing_status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Price:</span> {formatCurrency(listing.listing_price)}
                      </div>
                      <div>
                        <span className="font-medium">Beds/Baths:</span> {listing.bedrooms || 0}/{listing.bathrooms || 0}
                      </div>
                      <div>
                        <span className="font-medium">Sq Ft:</span> {listing.square_feet?.toLocaleString() || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">MLS Source:</span> {listing.mls_source}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Listed: {formatDate(listing.listing_date)} | 
                      Agent: {listing.listing_agent || 'N/A'} | 
                      Office: {listing.listing_office || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalListings > pageSize && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalListings)} of {totalListings} listings
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= totalListings}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {analytics ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalListings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.activeListings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Avg Days on Market</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.averageDaysOnMarket}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Avg Listing Price</h3>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(analytics.averageListingPrice)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Top MLS Sources</h3>
              <div className="space-y-3">
                {analytics.topMLSSources.map((source: any) => (
                  <div key={source.source} className="flex justify-between items-center">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-gray-600">{source.count} listings</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Listings by Status</h3>
              <div className="space-y-3">
                {analytics.listingsByStatus.map((status: any) => (
                  <div key={status.status} className="flex justify-between items-center">
                    <span className="font-medium capitalize">{status.status}</span>
                    <span className="text-gray-600">{status.count} listings</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      )}
    </div>
  );

  const renderSourcesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">MLS Data Sources</h3>
            <button
              onClick={handleSyncAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sync All Sources
            </button>
          </div>
        </div>
        <div className="divide-y">
          {dataSources.map((source) => (
            <div key={source.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold">{source.source_name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      source.sync_status === 'active' ? 'bg-green-100 text-green-800' :
                      source.sync_status === 'error' ? 'bg-red-100 text-red-800' :
                      source.sync_status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {source.sync_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {source.source_type}
                    </div>
                    <div>
                      <span className="font-medium">Coverage:</span> {source.coverage_areas.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Rate Limit:</span> {source.rate_limit_requests_per_minute}/min
                    </div>
                    <div>
                      <span className="font-medium">Last Sync:</span> {source.last_sync_date ? formatDate(source.last_sync_date) : 'Never'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSyncSource(source.source_name)}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Sync Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSyncTab = () => (
    <div className="space-y-6">
      {syncStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">{syncStatus}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Sync Logs</h3>
        </div>
        <div className="divide-y">
          {syncLogs.map((log) => (
            <div key={log.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold">Sync #{log.id.slice(0, 8)}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.sync_status === 'completed' ? 'bg-green-100 text-green-800' :
                      log.sync_status === 'failed' ? 'bg-red-100 text-red-800' :
                      log.sync_status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.sync_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Started:</span> {formatDate(log.sync_start_time)}
                    </div>
                    <div>
                      <span className="font-medium">Processed:</span> {log.properties_processed}
                    </div>
                    <div>
                      <span className="font-medium">Added:</span> {log.properties_added}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span> {log.properties_updated}
                    </div>
                  </div>
                  {log.errors.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Errors:</span> {log.errors.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MLS Data Management</h1>
          <p className="mt-2 text-gray-600">Manage MLS listings, analytics, and data synchronization</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'listings', label: 'Listings' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'sources', label: 'Data Sources' },
              { id: 'sync', label: 'Sync Logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' && renderListingsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'sources' && renderSourcesTab()}
        {activeTab === 'sync' && renderSyncTab()}
      </div>
    </div>
  );
}; 