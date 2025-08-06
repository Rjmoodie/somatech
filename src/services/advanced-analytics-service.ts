import { supabase } from '@/integrations/supabase/client';
import { redisCache, CacheKeys, Cached } from '@/services/redis-cache-service';

export interface MarketAnalytics {
  totalProperties: number;
  averagePrice: number;
  averagePricePerSqFt: number;
  averageDaysOnMarket: number;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
  marketActivity: 'high' | 'medium' | 'low';
  investmentOpportunities: number;
  topPerformingAreas: Array<{
    area: string;
    avgReturn: number;
    propertyCount: number;
  }>;
  marketPredictions: {
    nextMonth: {
      priceChange: number;
      confidence: number;
    };
    nextQuarter: {
      priceChange: number;
      confidence: number;
    };
  };
}

export interface InvestmentAnalytics {
  propertyId: string;
  investmentScore: number;
  cashOnCashReturn: number;
  capRate: number;
  totalReturn: number;
  breakEvenTime: number;
  riskScore: number;
  marketComparison: {
    percentile: number;
    similarProperties: number;
  };
  recommendations: string[];
}

export interface PredictiveModel {
  modelId: string;
  modelType: 'price_prediction' | 'investment_score' | 'market_trend';
  accuracy: number;
  lastTrained: Date;
  features: string[];
  predictions: Array<{
    propertyId: string;
    predictedValue: number;
    confidence: number;
    timestamp: Date;
  }>;
}

export interface MarketInsights {
  marketId: string;
  insights: Array<{
    type: 'trend' | 'opportunity' | 'risk' | 'comparison';
    title: string;
    description: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    dataPoints: any[];
  }>;
  lastUpdated: Date;
}

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;

  private constructor() {}

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  // Market Analytics
  @Cached(900000, (area?: string) => CacheKeys.marketAnalytics(area || 'all'))
  async getMarketAnalytics(area?: string): Promise<MarketAnalytics> {

    try {
      let query = supabase
        .from('properties')
        .select('*');

      if (area) {
        query = query.eq('city', area);
      }

      const { data: properties, error } = await query;

      if (error) throw error;

      const analytics = this.calculateMarketAnalytics(properties || []);
      return analytics;
    } catch (error) {
      console.error('Error fetching market analytics:', error);
      return this.getDefaultMarketAnalytics();
    }
  }

  private calculateMarketAnalytics(properties: any[]): MarketAnalytics {
    if (properties.length === 0) {
      return this.getDefaultMarketAnalytics();
    }

    const totalProperties = properties.length;
    const averagePrice = properties.reduce((sum, p) => sum + (p.estimated_value || 0), 0) / totalProperties;
    const averagePricePerSqFt = properties.reduce((sum, p) => {
      const price = p.estimated_value || 0;
      const sqft = p.square_feet || 1;
      return sum + (price / sqft);
    }, 0) / totalProperties;

    const averageDaysOnMarket = properties.reduce((sum, p) => sum + (p.days_on_market || 0), 0) / totalProperties;

    // Calculate price trend
    const recentProperties = properties.filter(p => p.last_updated > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const olderProperties = properties.filter(p => p.last_updated <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const recentAvg = recentProperties.reduce((sum, p) => sum + (p.estimated_value || 0), 0) / Math.max(recentProperties.length, 1);
    const olderAvg = olderProperties.reduce((sum, p) => sum + (p.estimated_value || 0), 0) / Math.max(olderProperties.length, 1);
    
    const priceChange = ((recentAvg - olderAvg) / olderAvg) * 100;
    const priceTrend = priceChange > 2 ? 'increasing' : priceChange < -2 ? 'decreasing' : 'stable';

    // Calculate market activity
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const activityPercentage = (activeProperties / totalProperties) * 100;
    const marketActivity = activityPercentage > 30 ? 'high' : activityPercentage > 15 ? 'medium' : 'low';

    // Calculate investment opportunities
    const investmentOpportunities = properties.filter(p => 
      (p.investment_score || 0) > 7 && 
      (p.equity_percent || 0) > 20
    ).length;

    // Calculate top performing areas
    const areaStats = this.calculateAreaPerformance(properties);
    const topPerformingAreas = Object.entries(areaStats)
      .sort(([,a], [,b]) => b.avgReturn - a.avgReturn)
      .slice(0, 5)
      .map(([area, stats]) => ({
        area,
        avgReturn: stats.avgReturn,
        propertyCount: stats.propertyCount
      }));

    // Market predictions (simplified)
    const marketPredictions = {
      nextMonth: {
        priceChange: priceChange * 0.8, // Assume trend continues at 80% rate
        confidence: 0.75
      },
      nextQuarter: {
        priceChange: priceChange * 2.4, // Assume trend continues at 240% rate
        confidence: 0.6
      }
    };

    return {
      totalProperties,
      averagePrice,
      averagePricePerSqFt,
      averageDaysOnMarket,
      priceTrend,
      marketActivity,
      investmentOpportunities,
      topPerformingAreas,
      marketPredictions
    };
  }

  private calculateAreaPerformance(properties: any[]): { [area: string]: { avgReturn: number; propertyCount: number } } {
    const areaMap = new Map<string, { returns: number[]; count: number }>();

    properties.forEach(property => {
      const area = property.city || 'Unknown';
      const returnRate = this.calculatePropertyReturn(property);
      
      if (!areaMap.has(area)) {
        areaMap.set(area, { returns: [], count: 0 });
      }
      
      const areaData = areaMap.get(area)!;
      areaData.returns.push(returnRate);
      areaData.count++;
    });

    const result: { [area: string]: { avgReturn: number; propertyCount: number } } = {};
    
    areaMap.forEach((data, area) => {
      result[area] = {
        avgReturn: data.returns.reduce((sum, r) => sum + r, 0) / data.returns.length,
        propertyCount: data.count
      };
    });

    return result;
  }

  private calculatePropertyReturn(property: any): number {
    const estimatedValue = property.estimated_value || 0;
    const assessedValue = property.assessed_value || 0;
    const equityPercent = property.equity_percent || 0;
    
    if (estimatedValue === 0 || assessedValue === 0) return 0;
    
    // Simplified return calculation
    const valueAppreciation = (estimatedValue - assessedValue) / assessedValue;
    const equityReturn = equityPercent / 100;
    
    return (valueAppreciation + equityReturn) * 100;
  }

  private getDefaultMarketAnalytics(): MarketAnalytics {
    return {
      totalProperties: 0,
      averagePrice: 0,
      averagePricePerSqFt: 0,
      averageDaysOnMarket: 0,
      priceTrend: 'stable',
      marketActivity: 'low',
      investmentOpportunities: 0,
      topPerformingAreas: [],
      marketPredictions: {
        nextMonth: { priceChange: 0, confidence: 0 },
        nextQuarter: { priceChange: 0, confidence: 0 }
      }
    };
  }

  // Investment Analytics
  @Cached(600000, (propertyId: string) => CacheKeys.investmentAnalytics(propertyId))
  async getInvestmentAnalytics(propertyId: string): Promise<InvestmentAnalytics> {

    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;

      const analytics = this.calculateInvestmentAnalytics(property);
      return analytics;
    } catch (error) {
      console.error('Error fetching investment analytics:', error);
      return this.getDefaultInvestmentAnalytics(propertyId);
    }
  }

  private calculateInvestmentAnalytics(property: any): InvestmentAnalytics {
    const investmentScore = property.investment_score || 0;
    const estimatedValue = property.estimated_value || 0;
    const assessedValue = property.assessed_value || 0;
    const equityPercent = property.equity_percent || 0;
    const rentalEstimate = property.rental_estimate || 0;

    // Calculate cash on cash return
    const downPayment = estimatedValue * 0.25; // Assume 25% down
    const annualRent = rentalEstimate * 12;
    const annualExpenses = annualRent * 0.4; // Assume 40% expenses
    const cashOnCashReturn = ((annualRent - annualExpenses) / downPayment) * 100;

    // Calculate cap rate
    const capRate = ((annualRent - annualExpenses) / estimatedValue) * 100;

    // Calculate total return
    const valueAppreciation = (estimatedValue - assessedValue) / assessedValue;
    const totalReturn = (valueAppreciation + (cashOnCashReturn / 100)) * 100;

    // Calculate break even time
    const monthlyCashFlow = (annualRent - annualExpenses) / 12;
    const breakEvenTime = downPayment / monthlyCashFlow;

    // Calculate risk score (simplified)
    const riskScore = Math.max(0, 10 - investmentScore);

    // Market comparison
    const marketComparison = {
      percentile: Math.min(100, Math.max(0, investmentScore * 10)),
      similarProperties: Math.floor(Math.random() * 50) + 10 // Mock data
    };

    // Generate recommendations
    const recommendations: string[] = [];
    if (investmentScore < 5) {
      recommendations.push('Consider lower offer price to improve investment potential');
    }
    if (cashOnCashReturn < 8) {
      recommendations.push('Cash on cash return below market average - negotiate better terms');
    }
    if (equityPercent > 50) {
      recommendations.push('High equity position - consider cash-out refinance for additional investments');
    }
    if (recommendations.length === 0) {
      recommendations.push('Property shows strong investment potential');
    }

    return {
      propertyId: property.id,
      investmentScore,
      cashOnCashReturn,
      capRate,
      totalReturn,
      breakEvenTime,
      riskScore,
      marketComparison,
      recommendations
    };
  }

  private getDefaultInvestmentAnalytics(propertyId: string): InvestmentAnalytics {
    return {
      propertyId,
      investmentScore: 0,
      cashOnCashReturn: 0,
      capRate: 0,
      totalReturn: 0,
      breakEvenTime: 0,
      riskScore: 10,
      marketComparison: { percentile: 0, similarProperties: 0 },
      recommendations: ['Insufficient data for analysis']
    };
  }

  // Predictive Modeling
  @Cached(1800000, (modelType: string) => CacheKeys.predictiveModel(modelType))
  async getPredictiveModel(modelType: string): Promise<PredictiveModel> {
    const cacheKey = `predictive_model_${modelType}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Mock predictive model data
      const model: PredictiveModel = {
        modelId: `${modelType}_${Date.now()}`,
        modelType: modelType as any,
        accuracy: 0.85,
        lastTrained: new Date(),
        features: ['price', 'sqft', 'bedrooms', 'bathrooms', 'year_built', 'location'],
        predictions: []
      };

      this.setCachedData(cacheKey, model);
      return model;
    } catch (error) {
      console.error('Error fetching predictive model:', error);
      throw error;
    }
  }

  async generatePredictions(modelType: string, propertyIds: string[]): Promise<Array<{ propertyId: string; predictedValue: number; confidence: number }>> {
    try {
      const predictions = propertyIds.map(propertyId => ({
        propertyId,
        predictedValue: Math.random() * 500000 + 200000, // Mock prediction
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      }));

      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      return [];
    }
  }

  // Market Insights
  @Cached(1200000, (marketId: string) => CacheKeys.marketInsights(marketId))
  async getMarketInsights(marketId: string): Promise<MarketInsights> {
    const cacheKey = `market_insights_${marketId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const insights: MarketInsights = {
        marketId,
        insights: [
          {
            type: 'trend',
            title: 'Price Appreciation Trend',
            description: 'Property values in this market are showing consistent upward movement',
            confidence: 0.85,
            impact: 'high',
            dataPoints: []
          },
          {
            type: 'opportunity',
            title: 'Investment Opportunity',
            description: 'High equity properties available with strong rental potential',
            confidence: 0.78,
            impact: 'medium',
            dataPoints: []
          },
          {
            type: 'risk',
            title: 'Market Risk Assessment',
            description: 'Moderate risk due to recent price volatility',
            confidence: 0.72,
            impact: 'medium',
            dataPoints: []
          }
        ],
        lastUpdated: new Date()
      };

      this.setCachedData(cacheKey, insights);
      return insights;
    } catch (error) {
      console.error('Error fetching market insights:', error);
      throw error;
    }
  }

  // Cache management
  // Cache management methods
  clearCache(): void {
    const analyticsKeys = redisCache.keys('market_analytics:*');
    const investmentKeys = redisCache.keys('investment_analytics:*');
    const predictiveKeys = redisCache.keys('predictive_model:*');
    const insightsKeys = redisCache.keys('market_insights:*');

    [...analyticsKeys, ...investmentKeys, ...predictiveKeys, ...insightsKeys].forEach(key => {
      redisCache.delete(key);
    });
  }

  getCacheStats(): { size: number; keys: string[] } {
    const stats = redisCache.getStats();
    const analyticsKeys = redisCache.keys('market_analytics:*');
    const investmentKeys = redisCache.keys('investment_analytics:*');
    const predictiveKeys = redisCache.keys('predictive_model:*');
    const insightsKeys = redisCache.keys('market_insights:*');

    return {
      size: stats.size,
      keys: [...analyticsKeys, ...investmentKeys, ...predictiveKeys, ...insightsKeys]
    };
  }

  // Cache invalidation methods
  async invalidateMarketAnalyticsCache(area?: string): Promise<void> {
    redisCache.delete(CacheKeys.marketAnalytics(area || 'all'));
  }

  async invalidateInvestmentAnalyticsCache(propertyId: string): Promise<void> {
    redisCache.delete(CacheKeys.investmentAnalytics(propertyId));
  }

  async invalidatePredictiveModelCache(modelType: string): Promise<void> {
    redisCache.delete(CacheKeys.predictiveModel(modelType));
  }

  async invalidateMarketInsightsCache(marketId: string): Promise<void> {
    redisCache.delete(CacheKeys.marketInsights(marketId));
  }

  async invalidateAllAnalyticsCaches(): Promise<void> {
    const analyticsKeys = redisCache.keys('market_analytics:*');
    const investmentKeys = redisCache.keys('investment_analytics:*');
    const predictiveKeys = redisCache.keys('predictive_model:*');
    const insightsKeys = redisCache.keys('market_insights:*');

    [...analyticsKeys, ...investmentKeys, ...predictiveKeys, ...insightsKeys].forEach(key => {
      redisCache.delete(key);
    });
  }
}

export const advancedAnalyticsService = AdvancedAnalyticsService.getInstance(); 