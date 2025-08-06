import React, { useState, useEffect } from 'react';
import { 
  advancedAnalyticsService, 
  MarketAnalytics, 
  InvestmentAnalytics, 
  PredictiveModel, 
  MarketInsights 
} from '@/services/advanced-analytics-service';
import { etlPipelineManager } from '@/services/etl-pipeline';

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'investment' | 'predictive' | 'insights'>('market');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null);
  const [investmentAnalytics, setInvestmentAnalytics] = useState<InvestmentAnalytics | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const [cacheStats, setCacheStats] = useState<{ size: number; keys: string[] }>({ size: 0, keys: [] });

  // Sample areas for demonstration
  const sampleAreas = ['Phoenix', 'Dallas', 'Miami', 'Atlanta', 'Las Vegas', 'Los Angeles', 'San Diego'];
  const samplePropertyIds = [
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002'
  ];

  useEffect(() => {
    loadData();
    updateCacheStats();
  }, [activeTab, selectedArea, selectedPropertyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'market':
          const marketData = await advancedAnalyticsService.getMarketAnalytics(selectedArea);
          setMarketAnalytics(marketData);
          break;
        case 'investment':
          if (selectedPropertyId) {
            const investmentData = await advancedAnalyticsService.getInvestmentAnalytics(selectedPropertyId);
            setInvestmentAnalytics(investmentData);
          }
          break;
        case 'predictive':
          const modelData = await advancedAnalyticsService.getPredictiveModel('price_prediction');
          setPredictiveModel(modelData);
          break;
        case 'insights':
          const insightsData = await advancedAnalyticsService.getMarketInsights(selectedArea || 'default');
          setMarketInsights(insightsData);
          break;
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCacheStats = () => {
    const stats = advancedAnalyticsService.getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = () => {
    advancedAnalyticsService.clearCache();
    updateCacheStats();
  };

  const handleRunCountyPipeline = async () => {
    try {
      setLoading(true);
      const result = await etlPipelineManager.runPipeline('county_assessor');
      console.log('County assessor pipeline result:', result);
      // Refresh data after pipeline run
      await loadData();
    } catch (error) {
      console.error('Error running county pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderMarketAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Market Analytics</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Areas</option>
            {sampleAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <button
            onClick={handleRunCountyPipeline}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Update County Data'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : marketAnalytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Key Metrics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Properties</h4>
            <p className="text-2xl font-bold text-gray-900">{marketAnalytics.totalProperties.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Average Price</h4>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketAnalytics.averagePrice)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Price per Sq Ft</h4>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketAnalytics.averagePricePerSqFt)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Days on Market</h4>
            <p className="text-2xl font-bold text-gray-900">{Math.round(marketAnalytics.averageDaysOnMarket)}</p>
          </div>

          {/* Market Trends */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price Trend</p>
                <p className={`text-lg font-semibold ${getTrendColor(marketAnalytics.priceTrend)}`}>
                  {marketAnalytics.priceTrend.charAt(0).toUpperCase() + marketAnalytics.priceTrend.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Activity</p>
                <p className={`text-lg font-semibold ${getActivityColor(marketAnalytics.marketActivity)}`}>
                  {marketAnalytics.marketActivity.charAt(0).toUpperCase() + marketAnalytics.marketActivity.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Investment Opportunities</h4>
            <p className="text-2xl font-bold text-green-600">{marketAnalytics.investmentOpportunities}</p>
          </div>

          {/* Top Performing Areas */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Areas</h4>
            <div className="space-y-3">
              {marketAnalytics.topPerformingAreas.map((area, index) => (
                <div key={area.area} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                    <span className="text-sm text-gray-700">{area.area}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{formatPercentage(area.avgReturn)}</p>
                    <p className="text-xs text-gray-500">{area.propertyCount} properties</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Predictions */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Predictions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Next Month</p>
                <p className={`text-lg font-semibold ${marketAnalytics.marketPredictions.nextMonth.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(marketAnalytics.marketPredictions.nextMonth.priceChange)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(marketAnalytics.marketPredictions.nextMonth.confidence * 100)} confidence
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Next Quarter</p>
                <p className={`text-lg font-semibold ${marketAnalytics.marketPredictions.nextQuarter.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(marketAnalytics.marketPredictions.nextQuarter.priceChange)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(marketAnalytics.marketPredictions.nextQuarter.confidence * 100)} confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No market data available</div>
      )}
    </div>
  );

  const renderInvestmentAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Investment Analytics</h3>
        <select
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Property</option>
          {samplePropertyIds.map(id => (
            <option key={id} value={id}>Property {id.slice(-8)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : investmentAnalytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Investment Score */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Investment Score</h4>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900">{investmentAnalytics.investmentScore}/10</p>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${investmentAnalytics.investmentScore * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Cash on Cash Return */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Cash on Cash Return</h4>
            <p className={`text-2xl font-bold ${investmentAnalytics.cashOnCashReturn >= 8 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(investmentAnalytics.cashOnCashReturn)}
            </p>
          </div>

          {/* Cap Rate */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Cap Rate</h4>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(investmentAnalytics.capRate)}</p>
          </div>

          {/* Total Return */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Total Return</h4>
            <p className="text-2xl font-bold text-green-600">{formatPercentage(investmentAnalytics.totalReturn)}</p>
          </div>

          {/* Break Even Time */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Break Even (Months)</h4>
            <p className="text-2xl font-bold text-gray-900">{Math.round(investmentAnalytics.breakEvenTime)}</p>
          </div>

          {/* Risk Score */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-500">Risk Score</h4>
            <p className={`text-2xl font-bold ${investmentAnalytics.riskScore <= 3 ? 'text-green-600' : investmentAnalytics.riskScore <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
              {investmentAnalytics.riskScore}/10
            </p>
          </div>

          {/* Market Comparison */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Comparison</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Percentile</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(investmentAnalytics.marketComparison.percentile)}th</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Similar Properties</p>
                <p className="text-lg font-semibold text-gray-900">{investmentAnalytics.marketComparison.similarProperties}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
            <div className="space-y-2">
              {investmentAnalytics.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">Select a property to view investment analytics</div>
      )}
    </div>
  );

  const renderPredictiveAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
        <button
          onClick={updateCacheStats}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Refresh Cache Stats
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : predictiveModel ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Model ID</p>
                <p className="text-sm font-medium text-gray-900">{predictiveModel.modelId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="text-sm font-medium text-gray-900">{predictiveModel.modelType.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-sm font-medium text-gray-900">{formatPercentage(predictiveModel.accuracy * 100)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Trained</p>
                <p className="text-sm font-medium text-gray-900">{predictiveModel.lastTrained.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {predictiveModel.features.map((feature, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Cache Statistics */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Cache Statistics</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cache Size</p>
                <p className="text-lg font-semibold text-gray-900">{cacheStats.size} items</p>
              </div>
              <button
                onClick={handleClearCache}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear Cache
              </button>
            </div>
            {cacheStats.keys.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Cached Keys:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {cacheStats.keys.slice(0, 6).map((key, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded truncate">
                      {key}
                    </span>
                  ))}
                  {cacheStats.keys.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{cacheStats.keys.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No predictive model data available</div>
      )}
    </div>
  );

  const renderMarketInsights = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Market Insights</h3>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Markets</option>
          {sampleAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : marketInsights ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Last updated: {marketInsights.lastUpdated.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketInsights.insights.map((insight, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      insight.type === 'trend' ? 'bg-blue-100 text-blue-800' :
                      insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                      insight.type === 'risk' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatPercentage(insight.confidence * 100)}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-gray-700">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No market insights available</div>
      )}
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Comprehensive market analysis, investment insights, and predictive modeling</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'market', label: 'Market Analytics', icon: '📊' },
              { id: 'investment', label: 'Investment Analytics', icon: '💰' },
              { id: 'predictive', label: 'Predictive Models', icon: '🔮' },
              { id: 'insights', label: 'Market Insights', icon: '💡' }
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
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'market' && renderMarketAnalytics()}
        {activeTab === 'investment' && renderInvestmentAnalytics()}
        {activeTab === 'predictive' && renderPredictiveAnalytics()}
        {activeTab === 'insights' && renderMarketInsights()}
      </div>
    </div>
  );
}; 