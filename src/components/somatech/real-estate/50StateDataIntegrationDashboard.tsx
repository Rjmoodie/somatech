// 50-State Data Integration Dashboard
// Provides UI for monitoring and controlling comprehensive data integration

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Play,
  Pause,
  Square, 
  RefreshCw, 
  Download, 
  Database, 
  Globe, 
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fiftyStateDataIntegration, IntegrationStatus, IntegrationResult } from "@/services/50-state-data-integration";

interface DashboardState {
  isRunning: boolean;
  status: IntegrationStatus | null;
  result: IntegrationResult | null;
  errors: string[];
}

const FiftyStateDataIntegrationDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    isRunning: false,
    status: null,
    result: null,
    errors: []
  });
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Initialize dashboard
    updateStatus();
    
    // Set up periodic status updates
    const interval = setInterval(updateStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async () => {
    try {
      const status = fiftyStateDataIntegration.getStatus();
      setState(prev => ({
        ...prev,
        status,
        isRunning: status.phase !== 'complete' && status.progress < 100
      }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const startIntegration = async () => {
    try {
      setState(prev => ({ ...prev, isRunning: true, errors: [] }));
      
      toast({
        title: "Starting 50-State Integration",
        description: "Beginning comprehensive data integration across all 50 states...",
      });
      
      const result = await fiftyStateDataIntegration.startIntegration();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        result,
        errors: result.errors
      }));
      
      if (result.success) {
        toast({
          title: "Integration Complete",
          description: `Successfully processed ${result.validProperties} properties across all 50 states.`,
        });
      } else {
        toast({
          title: "Integration Failed",
          description: "Data integration encountered errors. Check the logs for details.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Integration failed:', error);
      setState(prev => ({
        ...prev,
        isRunning: false,
        errors: [...prev.errors, error.message]
      }));
      
      toast({
        title: "Integration Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stopIntegration = () => {
    fiftyStateDataIntegration.stopIntegration();
    setState(prev => ({ ...prev, isRunning: false }));
    
    toast({
      title: "Integration Stopped",
      description: "Data integration has been stopped by user.",
    });
  };

  const downloadResults = async (format: 'csv' | 'json' | 'geojson') => {
    if (!state.result?.exportData) {
      toast({
        title: "No Data Available",
        description: "No export data is available. Run the integration first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const data = state.result.exportData[format];
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `50-state-properties.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: `Data exported successfully in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'discovery': return <Globe className="h-4 w-4" />;
      case 'scraping': return <Database className="h-4 w-4" />;
      case 'processing': return <BarChart3 className="h-4 w-4" />;
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'discovery': return 'bg-blue-500';
      case 'scraping': return 'bg-yellow-500';
      case 'processing': return 'bg-green-500';
      case 'complete': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">50-State Data Integration</h1>
          <p className="text-muted-foreground">
            Comprehensive property data integration across all 50 states
          </p>
        </div>
        
        <div className="flex gap-2">
          {!state.isRunning ? (
            <Button onClick={startIntegration} disabled={state.isRunning}>
              <Play className="h-4 w-4 mr-2" />
              Start Integration
            </Button>
                     ) : (
             <Button onClick={stopIntegration} variant="destructive">
               <Square className="h-4 w-4 mr-2" />
               Stop Integration
             </Button>
           )}
          
          <Button variant="outline" onClick={updateStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {state.status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPhaseIcon(state.status.phase)}
              Integration Status
            </CardTitle>
            <CardDescription>
              Current phase: {state.status.phase.charAt(0).toUpperCase() + state.status.phase.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{state.status.progress}%</span>
                </div>
                <Progress value={state.status.progress} className="h-2" />
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{state.status.totalCounties}</div>
                  <div className="text-sm text-muted-foreground">Total Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{state.status.discoveredCounties}</div>
                  <div className="text-sm text-muted-foreground">Discovered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{state.status.scrapedCounties}</div>
                  <div className="text-sm text-muted-foreground">Scraped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{state.status.validProperties}</div>
                  <div className="text-sm text-muted-foreground">Valid Properties</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Federal Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Federal Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>US Census Bureau</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>FEMA Flood Zones</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EPA Environmental</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HUD REO Properties</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* County Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  County Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Total Counties</span>
                    <span className="font-bold">3,142</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discovered Sources</span>
                    <span className="font-bold">{state.status?.discoveredCounties || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Sources</span>
                    <span className="font-bold text-green-600">
                      {Math.round((state.status?.discoveredCounties || 0) * 0.8)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coverage Rate</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(((state.status?.discoveredCounties || 0) / 3142) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          {state.result ? (
            <div className="space-y-4">
              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Data Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{state.result.validProperties}</div>
                      <div className="text-sm text-muted-foreground">Valid Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{state.result.geocodedProperties}</div>
                      <div className="text-sm text-muted-foreground">Geocoded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{state.result.enrichedProperties}</div>
                      <div className="text-sm text-muted-foreground">Enriched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{state.result.dataQuality.qualityScore.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Processing Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Properties</TableCell>
                        <TableCell>{state.result.totalProperties}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Processed</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Valid Properties</TableCell>
                        <TableCell>{state.result.validProperties}</TableCell>
                        <TableCell>
                          <Badge variant="default">Valid</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Geocoded Properties</TableCell>
                        <TableCell>{state.result.geocodedProperties}</TableCell>
                        <TableCell>
                          <Badge variant="default">Geocoded</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Enriched Properties</TableCell>
                        <TableCell>{state.result.enrichedProperties}</TableCell>
                        <TableCell>
                          <Badge variant="default">Enriched</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Processing Time</TableCell>
                        <TableCell>{(state.result.processingTime / 1000).toFixed(1)}s</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Complete</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No results available. Run the integration to see results.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-4">
          {(state.errors.length > 0 || state.status?.errors.length) ? (
            <div className="space-y-4">
              {[...(state.errors || []), ...(state.status?.errors || [])].map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No errors reported.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download processed property data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => downloadResults('csv')}
                  disabled={!state.result?.exportData}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button 
                  onClick={() => downloadResults('json')}
                  disabled={!state.result?.exportData}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button 
                  onClick={() => downloadResults('geojson')}
                  disabled={!state.result?.exportData}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Export GeoJSON
                </Button>
              </div>
              
              {!state.result?.exportData && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No export data available. Complete the integration first.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FiftyStateDataIntegrationDashboard; 