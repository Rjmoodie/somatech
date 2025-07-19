import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Database, 
  Globe, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  Pause,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DataSource {
  id: string;
  name: string;
  state: string;
  county: string;
  type: 'api' | 'scraper' | 'manual' | 'third_party';
  url: string;
  last_update: string;
  status: 'active' | 'inactive' | 'error';
  record_count: number;
  update_frequency: 'daily' | 'weekly' | 'monthly';
  api_key?: string;
  credentials?: string;
}

interface DataIngestionJob {
  id: string;
  source_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  records_processed: number;
  records_added: number;
  records_updated: number;
  error_message?: string;
  progress: number;
}

const DealSourcingDataManager = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [ingestionJobs, setIngestionJobs] = useState<DataIngestionJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockDataSources: DataSource[] = [
    {
      id: "1",
      name: "Los Angeles County Tax Assessor",
      state: "California",
      county: "Los Angeles",
      type: "api",
      url: "https://assessor.lacounty.gov/api",
      last_update: "2024-01-15T10:30:00Z",
      status: "active",
      record_count: 25000,
      update_frequency: "daily"
    },
    {
      id: "2",
      name: "Harris County Property Records",
      state: "Texas",
      county: "Harris",
      type: "scraper",
      url: "https://www.hcad.org",
      last_update: "2024-01-14T15:45:00Z",
      status: "active",
      record_count: 18000,
      update_frequency: "weekly"
    },
    {
      id: "3",
      name: "Miami-Dade Clerk Records",
      state: "Florida",
      county: "Miami-Dade",
      type: "manual",
      url: "https://www.miami-dadeclerk.com",
      last_update: "2024-01-13T09:15:00Z",
      status: "active",
      record_count: 12000,
      update_frequency: "monthly"
    }
  ];

  const mockIngestionJobs: DataIngestionJob[] = [
    {
      id: "1",
      source_id: "1",
      status: "completed",
      started_at: "2024-01-15T10:00:00Z",
      completed_at: "2024-01-15T10:30:00Z",
      records_processed: 25000,
      records_added: 1500,
      records_updated: 800,
      progress: 100
    },
    {
      id: "2",
      source_id: "2",
      status: "running",
      started_at: "2024-01-15T11:00:00Z",
      records_processed: 12000,
      records_added: 800,
      records_updated: 400,
      progress: 65
    },
    {
      id: "3",
      source_id: "3",
      status: "failed",
      started_at: "2024-01-15T12:00:00Z",
      error_message: "API rate limit exceeded",
      records_processed: 5000,
      records_added: 200,
      records_updated: 100,
      progress: 25
    }
  ];

  useEffect(() => {
    setDataSources(mockDataSources);
    setIngestionJobs(mockIngestionJobs);
  }, []);

  const handleAddDataSource = async (formData: any) => {
    setLoading(true);
    try {
      // In real implementation, this would save to database
      const newSource: DataSource = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        record_count: 0,
        last_update: new Date().toISOString()
      };
      
      setDataSources(prev => [...prev, newSource]);
      
      toast({
        title: "Data Source Added",
        description: "New data source has been configured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add data source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartIngestion = async (sourceId: string) => {
    setLoading(true);
    try {
      // In real implementation, this would trigger a background job
      const newJob: DataIngestionJob = {
        id: Date.now().toString(),
        source_id: sourceId,
        status: 'running',
        started_at: new Date().toISOString(),
        records_processed: 0,
        records_added: 0,
        records_updated: 0,
        progress: 0
      };
      
      setIngestionJobs(prev => [...prev, newJob]);
      
      toast({
        title: "Ingestion Started",
        description: "Data ingestion job has been initiated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start ingestion job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopIngestion = async (jobId: string) => {
    setIngestionJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'failed', completed_at: new Date().toISOString() }
          : job
      )
    );
    
    toast({
      title: "Ingestion Stopped",
      description: "Data ingestion job has been stopped",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      completed: "default",
      running: "secondary",
      pending: "outline",
      failed: "destructive",
      error: "destructive",
      inactive: "outline"
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">
            Manage data sources, ingestion jobs, and API integrations
          </p>
        </div>
        <Button onClick={() => setActiveTab('sources')}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Sources
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="jobs">Ingestion Jobs</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Data Sources Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Sources
              </CardTitle>
              <CardDescription>
                Configure and manage data sources for real estate leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">{source.url}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {source.county}, {source.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {source.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(source.status)}
                          {getStatusBadge(source.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {source.record_count.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(source.last_update).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartIngestion(source.id)}
                            disabled={loading}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add New Data Source */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Data Source</CardTitle>
              <CardDescription>
                Configure a new data source for real estate leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source Name</Label>
                  <Input placeholder="e.g., Los Angeles County Tax Assessor" />
                </div>
                <div className="space-y-2">
                  <Label>Source Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API Integration</SelectItem>
                      <SelectItem value="scraper">Web Scraper</SelectItem>
                      <SelectItem value="manual">Manual Upload</SelectItem>
                      <SelectItem value="third_party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {["California", "Texas", "Florida", "New York", "Illinois"].map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input placeholder="e.g., Los Angeles" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Source URL</Label>
                  <Input placeholder="https://example.com/api" />
                </div>
                <div className="space-y-2">
                  <Label>Update Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key (if required)</Label>
                  <Input placeholder="Enter API key" type="password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Configuration Notes</Label>
                <Textarea 
                  placeholder="Additional configuration details, field mappings, etc."
                  rows={3}
                />
              </div>

              <Button onClick={() => handleAddDataSource({})} disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                Add Data Source
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {/* Ingestion Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Ingestion Jobs
              </CardTitle>
              <CardDescription>
                Monitor and manage data ingestion jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingestionJobs.map((job) => {
                    const source = dataSources.find(s => s.id === job.source_id);
                    const startTime = new Date(job.started_at);
                    const endTime = job.completed_at ? new Date(job.completed_at) : new Date();
                    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{job.id.slice(-8)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{source?.name || 'Unknown'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            {getStatusBadge(job.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={job.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {job.progress}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Processed: {job.records_processed.toLocaleString()}</div>
                            <div>Added: {job.records_added.toLocaleString()}</div>
                            <div>Updated: {job.records_updated.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {duration}s
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {job.status === 'running' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStopIngestion(job.id)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure API keys and credentials for data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">County APIs</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Los Angeles County</div>
                        <div className="text-sm text-muted-foreground">assessor.lacounty.gov</div>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Harris County</div>
                        <div className="text-sm text-muted-foreground">hcad.org</div>
                      </div>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Third Party APIs</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">PropStream</div>
                        <div className="text-sm text-muted-foreground">Property data provider</div>
                      </div>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">ATTOM Data</div>
                        <div className="text-sm text-muted-foreground">Real estate data</div>
                      </div>
                      <Badge variant="outline">Not Connected</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">API Rate Limits & Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,250</div>
                    <div className="text-sm text-muted-foreground">API calls today</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Success rate</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">2.3s</div>
                    <div className="text-sm text-muted-foreground">Avg response time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealSourcingDataManager; 