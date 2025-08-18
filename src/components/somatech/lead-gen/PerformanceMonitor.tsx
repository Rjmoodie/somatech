import React, { useState, useEffect } from 'react';
import { leadGenAPI } from '../../../services/lead-gen-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Settings,
  BarChart3,
  Gauge
} from 'lucide-react';

export interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  showDetails = false
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const updateMetrics = async () => {
    try {
      setLoading(true);
      
      // Get performance metrics
      const performanceMetrics = leadGenAPI.getPerformanceMetrics();
      setMetrics(performanceMetrics);
      
      // Get cache statistics
      const cacheMetrics = leadGenAPI.getCacheMetrics();
      setCacheStats(cacheMetrics);
      
      // Get system status
      const status = await leadGenAPI.getSystemStatus();
      setSystemStatus(status);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = () => {
    if (!metrics) return 'unknown';
    
    const errorRate = metrics.errorRate;
    const responseTime = metrics.averageResponseTime;
    
    if (errorRate > 0.05) return 'critical';
    if (errorRate > 0.01 || responseTime > 5000) return 'warning';
    return 'healthy';
  };

  const getCacheStatus = () => {
    if (!cacheStats) return 'unknown';
    
    const hitRate = cacheStats.hitRate;
    
    if (hitRate > 0.8) return 'excellent';
    if (hitRate > 0.6) return 'good';
    if (hitRate > 0.4) return 'fair';
    return 'poor';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'good':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'good':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!metrics && !cacheStats) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading performance data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Performance Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={updateMetrics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatDuration(metrics.averageResponseTime) : 'N/A'}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getStatusIcon(getPerformanceStatus())}
              <Badge className={getStatusColor(getPerformanceStatus())}>
                {getPerformanceStatus()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cache Hit Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cacheStats ? `${(cacheStats.hitRate * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getStatusIcon(getCacheStatus())}
              <Badge className={getStatusColor(getCacheStatus())}>
                {getCacheStatus()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.totalRequests.toLocaleString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Since {metrics?.lastReset.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.errorRate * 100).toFixed(2)}%` : 'N/A'}
            </div>
            <Progress 
              value={metrics ? metrics.errorRate * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cache Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cacheStats && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Cache Size</div>
                      <div className="font-semibold">{cacheStats.size} entries</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Memory Usage</div>
                      <div className="font-semibold">{formatBytes(cacheStats.memoryUsage)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Cache Age Range</div>
                    <div className="text-sm">
                      <div>Oldest: {cacheStats.oldestEntry.toLocaleString()}</div>
                      <div>Newest: {cacheStats.newestEntry.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Hit Rate Trend</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Improving over time</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">API Status</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">Operational</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                      <div className="font-semibold">
                        {systemStatus.api?.uptime ? formatDuration(systemStatus.api.uptime) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Service Status</div>
                    <div className="space-y-2">
                      {systemStatus.services?.map((service: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{service.name}</span>
                          <Badge className={service.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}>
                            {service.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Performance Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                leadGenAPI.clearCache();
                updateMetrics();
              }}
            >
              <Database className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                leadGenAPI.resetPerformanceMetrics();
                updateMetrics();
              }}
            >
              <Activity className="h-4 w-4 mr-2" />
              Reset Metrics
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Cache stats:', leadGenAPI.getCacheMetrics());
                console.log('Performance metrics:', leadGenAPI.getPerformanceMetrics());
              }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
