// Real Data Sources Manager Component
// This component allows users to manage and test real data sources

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Key, 
  TestTube, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';
import RealDataIntegrationService, { DataSourceStatus } from '@/services/real-data-integration';
import { REAL_DATA_SOURCES, DataSourceConfig, getDataSourceById, calculateDataSourceScore } from '@/config/data-sources';
import LiveDataTest from './LiveDataTest';

interface RealDataSourcesManagerProps {
  className?: string;
}

export default function RealDataSourcesManager({ className }: RealDataSourcesManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataSourceStatuses, setDataSourceStatuses] = useState<DataSourceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [sourceId: string]: any }>({});
  const [apiKeys, setApiKeys] = useState<{ [sourceId: string]: string }>({});
  const [testAddress, setTestAddress] = useState('1234 Oak Street, Phoenix, AZ 85001');

  const realDataService = RealDataIntegrationService.getInstance();

  useEffect(() => {
    loadDataSourceStatuses();
    loadApiKeys();
  }, []);

  const loadDataSourceStatuses = async () => {
    setIsLoading(true);
    try {
      const statuses = await realDataService.getDataSourceStatus();
      setDataSourceStatuses(statuses);
    } catch (error) {
      console.error('Error loading data source statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApiKeys = () => {
    const keys: { [sourceId: string]: string } = {};
    REAL_DATA_SOURCES.forEach(source => {
      if (realDataService.hasApiKey(source.id)) {
        keys[source.id] = '••••••••••••••••';
      }
    });
    setApiKeys(keys);
  };

  const handleApiKeyChange = (sourceId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [sourceId]: value }));
  };

  const testDataSource = async (sourceId: string) => {
    setIsLoading(true);
    try {
      const [address, city, state, zip] = testAddress.split(',').map(s => s.trim());
      
      let result;
      switch (sourceId) {
        case 'attom':
          result = await realDataService.getATTOMPropertyData({ address, city, state, zip });
          break;
        case 'corelogic':
          result = await realDataService.getCoreLogicPropertyData({ address, city, state, zip });
          break;
        case 'rentspree':
          result = await realDataService.getRentSpreeData({ address, city, state, zip });
          break;
        case 'realtymole':
          result = await realDataService.getRealtyMoleData({ address, city, state, zip });
          break;
        case 'mlsgrid':
          result = await realDataService.getMLSGridData({ address, city, state, zip });
          break;
        default:
          result = { success: false, error: 'Unknown data source' };
      }

      setTestResults(prev => ({ ...prev, [sourceId]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [sourceId]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAllDataSources = async () => {
    setIsLoading(true);
    try {
      const [address, city, state, zip] = testAddress.split(',').map(s => s.trim());
      const results = await realDataService.getMultiSourceData(address, city, state, zip);
      setTestResults(results);
    } catch (error) {
      console.error('Error testing all data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real Data Sources Manager</h2>
          <p className="text-muted-foreground">
            Manage and test integration with real property data sources
          </p>
        </div>
        <Button onClick={loadDataSourceStatuses} disabled={isLoading}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="livedata">Live Data Test</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REAL_DATA_SOURCES.map((source) => {
              const status = dataSourceStatuses.find(s => s.sourceId === source.id);
              const score = calculateDataSourceScore(source);
              
              return (
                <Card key={source.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      {getStatusIcon(status?.status || 'offline')}
                    </div>
                    <CardDescription>{source.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Quality</span>
                      <Badge variant="secondary">{Math.round(score * 100)}%</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span>{Math.round(source.dataQuality.accuracy * 100)}%</span>
                      </div>
                      <Progress value={source.dataQuality.accuracy * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completeness</span>
                        <span>{Math.round(source.dataQuality.completeness * 100)}%</span>
                      </div>
                      <Progress value={source.dataQuality.completeness * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Freshness</span>
                        <span>{Math.round(source.dataQuality.freshness * 100)}%</span>
                      </div>
                      <Progress value={source.dataQuality.freshness * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(status?.status || 'offline')}>
                        {status?.status || 'offline'}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">${source.cost.monthlyFee}/mo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Configuration</CardTitle>
              <CardDescription>
                Configure API keys for real data sources. Keys are stored securely and never exposed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {REAL_DATA_SOURCES.filter(source => source.apiKeyRequired).map((source) => (
                <div key={source.id} className="space-y-2">
                  <Label htmlFor={`api-key-${source.id}`}>{source.name}</Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`api-key-${source.id}`}
                      type="password"
                      placeholder="Enter API key"
                      value={apiKeys[source.id] || ''}
                      onChange={(e) => handleApiKeyChange(source.id, e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  {realDataService.hasApiKey(source.id) && (
                    <Badge variant="secondary" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Sources</CardTitle>
              <CardDescription>
                Test real data sources with sample addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-address">Test Address</Label>
                <Input
                  id="test-address"
                  value={testAddress}
                  onChange={(e) => setTestAddress(e.target.value)}
                  placeholder="Enter address to test"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={testAllDataSources} disabled={isLoading}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test All Sources
                </Button>
                <Button variant="outline" onClick={loadDataSourceStatuses}>
                  <Activity className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </div>

              <div className="space-y-4">
                {REAL_DATA_SOURCES.map((source) => {
                  const result = testResults[source.id];
                  
                  return (
                    <Card key={source.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{source.name}</h4>
                        <Button
                          size="sm"
                          onClick={() => testDataSource(source.id)}
                          disabled={isLoading}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                      </div>
                      
                      {result && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm font-medium">
                              {result.success ? 'Success' : 'Error'}
                            </span>
                            {result.requestTime && (
                              <span className="text-xs text-muted-foreground">
                                ({result.requestTime}ms)
                              </span>
                            )}
                          </div>
                          
                          {result.error && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{result.error}</AlertDescription>
                            </Alert>
                          )}
                          
                          {result.data && (
                            <div className="text-xs bg-muted p-2 rounded">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livedata" className="space-y-4">
          <LiveDataTest />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Source Costs</CardTitle>
                <CardDescription>Monthly costs for all data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {REAL_DATA_SOURCES.map((source) => (
                    <div key={source.id} className="flex justify-between">
                      <span className="text-sm">{source.name}</span>
                      <span className="text-sm font-medium">
                        ${source.cost.monthlyFee}/mo
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Monthly Cost</span>
                      <span>${REAL_DATA_SOURCES.reduce((sum, source) => sum + source.cost.monthlyFee, 0)}/mo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coverage Analysis</CardTitle>
                <CardDescription>Data source coverage by state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['AZ', 'TX', 'FL', 'CA', 'NY'].map((state) => (
                    <div key={state} className="flex justify-between">
                      <span className="text-sm">{state}</span>
                      <span className="text-sm text-muted-foreground">
                        {REAL_DATA_SOURCES.filter(source => 
                          source.status === 'active' && 
                          (source.coverage.states.includes('all') || source.coverage.states.includes(state))
                        ).length} sources
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 