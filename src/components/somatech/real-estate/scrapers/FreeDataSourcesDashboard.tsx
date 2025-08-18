import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Globe,
  FileText,
  Users,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { 
  freeDataSources, 
  freeDataSourceCategories, 
  implementationPhases,
  dataQualityLevels 
} from './FreeDataSources';
import { 
  freeDataSourcesImplementation, 
  FreeDataResult, 
  ProcessedProperty 
} from '../../../services/free-data-sources-implementation';

interface DashboardState {
  isRunning: boolean;
  currentPhase: 'IMMEDIATE' | 'PHASE_2' | 'PHASE_3' | null;
  results: FreeDataResult[];
  totalProperties: number;
  successRate: number;
  processingTime: number;
  errors: string[];
}

const FreeDataSourcesDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    isRunning: false,
    currentPhase: null,
    results: [],
    totalProperties: 0,
    successRate: 0,
    processingTime: 0,
    errors: []
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'results'>('summary');

  const { toast } = useToast();

  // Get implementation status
  const implementationStatus = freeDataSourcesImplementation.getImplementationStatus();
  const dataSourceStats = freeDataSourcesImplementation.getDataSourceStats();

  // Filter data sources based on selections
  const filteredSources = freeDataSources.filter(source => {
    if (selectedCategory !== 'all' && source.category !== selectedCategory) return false;
    if (selectedPhase !== 'all' && source.implementation !== selectedPhase) return false;
    if (selectedQuality !== 'all' && source.dataQuality !== selectedQuality) return false;
    return true;
  });

  // Execute immediate sources
  const executeImmediateSources = async () => {
    setState(prev => ({ ...prev, isRunning: true, currentPhase: 'IMMEDIATE' }));
    
    try {
      const results = await freeDataSourcesImplementation.executeImmediateSources();
      
      const totalProperties = results.reduce((sum, result) => sum + result.recordCount, 0);
      const successfulResults = results.filter(r => r.success);
      const successRate = results.length > 0 ? (successfulResults.length / results.length) * 100 : 0;
      const processingTime = results.reduce((sum, result) => sum + result.processingTime, 0);
      const errors = results.flatMap(r => r.errors);

      setState(prev => ({
        ...prev,
        results: [...prev.results, ...results],
        totalProperties: prev.totalProperties + totalProperties,
        successRate: (prev.successRate + successRate) / 2,
        processingTime: prev.processingTime + processingTime,
        errors: [...prev.errors, ...errors],
        isRunning: false,
        currentPhase: null
      }));

      toast({
        title: "Immediate Sources Complete",
        description: `Processed ${totalProperties} properties with ${successRate.toFixed(1)}% success rate`,
        variant: successRate > 80 ? "default" : "destructive"
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentPhase: null,
        errors: [...prev.errors, error.message]
      }));

      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Execute Phase 2 sources
  const executePhase2Sources = async () => {
    setState(prev => ({ ...prev, isRunning: true, currentPhase: 'PHASE_2' }));
    
    try {
      const results = await freeDataSourcesImplementation.executePhase2Sources();
      
      const totalProperties = results.reduce((sum, result) => sum + result.recordCount, 0);
      const successfulResults = results.filter(r => r.success);
      const successRate = results.length > 0 ? (successfulResults.length / results.length) * 100 : 0;
      const processingTime = results.reduce((sum, result) => sum + result.processingTime, 0);
      const errors = results.flatMap(r => r.errors);

      setState(prev => ({
        ...prev,
        results: [...prev.results, ...results],
        totalProperties: prev.totalProperties + totalProperties,
        successRate: (prev.successRate + successRate) / 2,
        processingTime: prev.processingTime + processingTime,
        errors: [...prev.errors, ...errors],
        isRunning: false,
        currentPhase: null
      }));

      toast({
        title: "Phase 2 Sources Complete",
        description: `Processed ${totalProperties} properties with ${successRate.toFixed(1)}% success rate`,
        variant: successRate > 80 ? "default" : "destructive"
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentPhase: null,
        errors: [...prev.errors, error.message]
      }));

      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Execute Phase 3 sources
  const executePhase3Sources = async () => {
    setState(prev => ({ ...prev, isRunning: true, currentPhase: 'PHASE_3' }));
    
    try {
      const results = await freeDataSourcesImplementation.executePhase3Sources();
      
      const totalProperties = results.reduce((sum, result) => sum + result.recordCount, 0);
      const successfulResults = results.filter(r => r.success);
      const successRate = results.length > 0 ? (successfulResults.length / results.length) * 100 : 0;
      const processingTime = results.reduce((sum, result) => sum + result.processingTime, 0);
      const errors = results.flatMap(r => r.errors);

      setState(prev => ({
        ...prev,
        results: [...prev.results, ...results],
        totalProperties: prev.totalProperties + totalProperties,
        successRate: (prev.successRate + successRate) / 2,
        processingTime: prev.processingTime + processingTime,
        errors: [...prev.errors, ...errors],
        isRunning: false,
        currentPhase: null
      }));

      toast({
        title: "Phase 3 Sources Complete",
        description: `Processed ${totalProperties} properties with ${successRate.toFixed(1)}% success rate`,
        variant: successRate > 80 ? "default" : "destructive"
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentPhase: null,
        errors: [...prev.errors, error.message]
      }));

      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Execute all sources
  const executeAllSources = async () => {
    await executeImmediateSources();
    await executePhase2Sources();
    await executePhase3Sources();
  };

  // Clear results
  const clearResults = () => {
    setState(prev => ({
      ...prev,
      results: [],
      totalProperties: 0,
      successRate: 0,
      processingTime: 0,
      errors: []
    }));
  };

  // Export results
  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      summary: {
        totalProperties: state.totalProperties,
        successRate: state.successRate,
        processingTime: state.processingTime,
        totalSources: state.results.length
      },
      results: state.results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `free-data-sources-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Data has been exported to JSON file",
    });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tax Delinquent': return <DollarSign className="h-4 w-4" />;
      case 'Code Violations': return <AlertTriangle className="h-4 w-4" />;
      case 'Pre-Foreclosures': return <Building2 className="h-4 w-4" />;
      case 'Probate Properties': return <FileText className="h-4 w-4" />;
      case 'Vacant Properties': return <MapPin className="h-4 w-4" />;
      case 'Absentee Owners': return <Users className="h-4 w-4" />;
      case 'Eviction Filings': return <FileText className="h-4 w-4" />;
      case 'Divorce Properties': return <FileText className="h-4 w-4" />;
      case 'Rental Registration': return <Database className="h-4 w-4" />;
      case 'Environmental Violations': return <AlertTriangle className="h-4 w-4" />;
      case 'Demolition Lists': return <Building2 className="h-4 w-4" />;
      case 'Utility Shutoffs': return <AlertTriangle className="h-4 w-4" />;
      case 'Senior-Owned Properties': return <Users className="h-4 w-4" />;
      case 'Bank-Owned (REO)': return <Building2 className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  // Get quality badge variant
  const getQualityBadgeVariant = (quality: string) => {
    switch (quality) {
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  // Get phase badge variant
  const getPhaseBadgeVariant = (phase: string) => {
    switch (phase) {
      case 'IMMEDIATE': return 'default';
      case 'PHASE_2': return 'secondary';
      case 'PHASE_3': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Free Data Sources Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor free data source implementation across all 7 categories
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearResults}
            disabled={state.isRunning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Results
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportResults}
            disabled={state.results.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Execution Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Execution Controls
          </CardTitle>
          <CardDescription>
            Execute data source processing by phase or all at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={executeImmediateSources}
              disabled={state.isRunning}
              className="h-12"
            >
              {state.isRunning && state.currentPhase === 'IMMEDIATE' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Execute Immediate
              <Badge variant="outline" className="ml-2">
                {implementationStatus.immediate.total}
              </Badge>
            </Button>

            <Button
              onClick={executePhase2Sources}
              disabled={state.isRunning}
              variant="secondary"
              className="h-12"
            >
              {state.isRunning && state.currentPhase === 'PHASE_2' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
              Execute Phase 2
              <Badge variant="outline" className="ml-2">
                {implementationStatus.phase2.total}
              </Badge>
            </Button>

            <Button
              onClick={executePhase3Sources}
              disabled={state.isRunning}
              variant="outline"
              className="h-12"
            >
              {state.isRunning && state.currentPhase === 'PHASE_3' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              Execute Phase 3
              <Badge variant="outline" className="ml-2">
                {implementationStatus.phase3.total}
              </Badge>
            </Button>

            <Button
              onClick={executeAllSources}
              disabled={state.isRunning}
              variant="default"
              className="h-12"
            >
              {state.isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Execute All
              <Badge variant="outline" className="ml-2">
                {dataSourceStats.totalSources}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                <p className="text-2xl font-bold">{dataSourceStats.totalSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Properties Found</p>
                <p className="text-2xl font-bold">{state.totalProperties.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{state.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold">{(state.processingTime / 1000).toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {/* Implementation Status */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
              <CardDescription>
                Current status of data source implementation by phase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Immediate</span>
                    <Badge variant="default">
                      {implementationStatus.immediate.implemented}/{implementationStatus.immediate.total}
                    </Badge>
                  </div>
                  <Progress 
                    value={(implementationStatus.immediate.implemented / implementationStatus.immediate.total) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Phase 2</span>
                    <Badge variant="secondary">
                      {implementationStatus.phase2.implemented}/{implementationStatus.phase2.total}
                    </Badge>
                  </div>
                  <Progress 
                    value={(implementationStatus.phase2.implemented / implementationStatus.phase2.total) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Phase 3</span>
                    <Badge variant="outline">
                      {implementationStatus.phase3.implemented}/{implementationStatus.phase3.total}
                    </Badge>
                  </div>
                  <Progress 
                    value={(implementationStatus.phase3.implemented / implementationStatus.phase3.total) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Source Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Data Source Categories</CardTitle>
              <CardDescription>
                Distribution of data sources by category and quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">By Category</h4>
                  <div className="space-y-2">
                    {Object.entries(dataSourceStats.byCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <span className="text-sm">{category}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">By Quality</h4>
                  <div className="space-y-2">
                    {Object.entries(dataSourceStats.byQuality).map(([quality, count]) => (
                      <div key={quality} className="flex items-center justify-between">
                        <span className="text-sm">{quality}</span>
                        <Badge variant={getQualityBadgeVariant(quality)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Data Source Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    {freeDataSourceCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Phase</label>
                  <select
                    value={selectedPhase}
                    onChange={(e) => setSelectedPhase(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Phases</option>
                    {implementationPhases.map(phase => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Quality</label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Qualities</option>
                    {dataQualityLevels.map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources List */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sources ({filteredSources.length})</CardTitle>
              <CardDescription>
                Detailed view of all configured data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSources.map(source => (
                  <div key={source.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getCategoryIcon(source.category)}
                          <h4 className="font-medium">{source.name}</h4>
                          <Badge variant={getQualityBadgeVariant(source.dataQuality)}>
                            {source.dataQuality}
                          </Badge>
                          <Badge variant={getPhaseBadgeVariant(source.implementation)}>
                            {source.implementation}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {source.method.toUpperCase()}
                          </span>
                          <span className="flex items-center">
                            <Database className="h-3 w-3 mr-1" />
                            {source.dataType}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {/* Results Summary */}
          {state.results.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Execution Results</CardTitle>
                <CardDescription>
                  Results from data source processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <h4 className="font-medium">{result.sourceName}</h4>
                          <Badge variant={getQualityBadgeVariant(result.dataQuality)}>
                            {result.dataQuality}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.recordCount} properties • {(result.processingTime / 1000).toFixed(1)}s
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span>{result.category}</span>
                        <span>•</span>
                        <span>{new Date(result.timestamp).toLocaleString()}</span>
                      </div>

                      {result.errors.length > 0 && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {result.errors.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  Execute data sources to see results here
                </p>
              </CardContent>
            </Card>
          )}

          {/* Errors */}
          {state.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  Errors ({state.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreeDataSourcesDashboard;
