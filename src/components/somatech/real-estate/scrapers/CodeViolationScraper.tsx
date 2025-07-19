import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  FileText,
  Download,
  Building2,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeViolationRecord {
  id: string;
  ownerName: string;
  propertyAddress: string;
  violationType: string;
  violationDescription: string;
  fineAmount: number;
  violationDate: string;
  status: 'open' | 'closed' | 'pending';
  city: string;
  state: string;
  scrapedAt: string;
  sourceUrl: string;
  caseNumber?: string;
  inspector?: string;
}

interface ScrapingConfig {
  city: string;
  state: string;
  url: string;
  method: 'puppeteer' | 'api' | 'csv';
  selectors?: {
    tableSelector: string;
    rowSelector: string;
    ownerSelector: string;
    addressSelector: string;
    violationSelector: string;
    fineSelector: string;
    dateSelector: string;
    statusSelector: string;
  };
  apiConfig?: {
    endpoint: string;
    apiKey?: string;
    headers?: Record<string, string>;
  };
}

const CodeViolationScraper = () => {
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    city: 'Chicago',
    state: 'Illinois',
    url: 'https://data.cityofchicago.org/code-violations',
    method: 'api',
    apiConfig: {
      endpoint: 'https://data.cityofchicago.org/resource/code-violations.json',
      apiKey: 'your-api-key-here'
    }
  });

  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedRecords, setScrapedRecords] = useState<CodeViolationRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const { toast } = useToast();

  // Pre-configured scraping targets
  const scrapingTargets = [
    {
      city: 'Chicago',
      state: 'Illinois',
      url: 'https://data.cityofchicago.org/code-violations',
      method: 'api' as const,
      apiConfig: {
        endpoint: 'https://data.cityofchicago.org/resource/code-violations.json',
        apiKey: 'your-api-key-here'
      }
    },
    {
      city: 'Los Angeles',
      state: 'California',
      url: 'https://www.ladbsservices2.lacity.org/',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.violations-table',
        rowSelector: 'tr',
        ownerSelector: '.owner-name',
        addressSelector: '.property-address',
        violationSelector: '.violation-type',
        fineSelector: '.fine-amount',
        dateSelector: '.violation-date',
        statusSelector: '.status'
      }
    },
    {
      city: 'Houston',
      state: 'Texas',
      url: 'https://www.houstontx.gov/code-enforcement',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.code-violations',
        rowSelector: '.violation-row',
        ownerSelector: '.owner',
        addressSelector: '.address',
        violationSelector: '.violation',
        fineSelector: '.fine',
        dateSelector: '.date',
        statusSelector: '.status'
      }
    },
    {
      city: 'Miami',
      state: 'Florida',
      url: 'https://www.miamidade.gov/code-enforcement',
      method: 'csv' as const
    }
  ];

  const violationTypes = [
    'Building Code Violation',
    'Zoning Violation',
    'Health Code Violation',
    'Fire Code Violation',
    'Property Maintenance Violation',
    'Environmental Violation',
    'Safety Violation',
    'Occupancy Violation'
  ];

  const handleStartScraping = async () => {
    setIsScraping(true);
    setProgress(0);
    setCurrentStatus('Initializing code violation scraper...');

    try {
      // Simulate scraping process
      await simulateScrapingProcess();
      
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${scrapedRecords.length} code violation records`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Failed to scrape code violation data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
      setProgress(100);
    }
  };

  const simulateScrapingProcess = async () => {
    const steps = [
      { progress: 10, status: 'Connecting to city code enforcement database...' },
      { progress: 25, status: 'Locating code violation records...' },
      { progress: 40, status: 'Extracting violation details...' },
      { progress: 60, status: 'Processing owner information...' },
      { progress: 80, status: 'Validating violation data...' },
      { progress: 95, status: 'Saving records to database...' },
      { progress: 100, status: 'Code violation scraping completed!' }
    ];

    for (const step of steps) {
      setProgress(step.progress);
      setCurrentStatus(step.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate mock records
    const mockRecords: CodeViolationRecord[] = Array.from({ length: 75 }, (_, i) => ({
      id: `violation-${Date.now()}-${i}`,
      ownerName: `Property Owner ${i + 1}`,
      propertyAddress: `${1000 + i} Oak St, ${scrapingConfig.city}, ${scrapingConfig.state}`,
      violationType: violationTypes[Math.floor(Math.random() * violationTypes.length)],
      violationDescription: `Code violation for property at ${1000 + i} Oak St`,
      fineAmount: Math.floor(Math.random() * 5000) + 500,
      violationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: ['open', 'closed', 'pending'][Math.floor(Math.random() * 3)] as any,
      city: scrapingConfig.city,
      state: scrapingConfig.state,
      scrapedAt: new Date().toISOString(),
      sourceUrl: scrapingConfig.url,
      caseNumber: `CV-${2024}-${String(i + 1).padStart(4, '0')}`,
      inspector: `Inspector ${Math.floor(Math.random() * 10) + 1}`
    }));

    setScrapedRecords(mockRecords);
  };

  const handleExportRecords = () => {
    const csvContent = [
      ['Owner Name', 'Property Address', 'Violation Type', 'Description', 'Fine Amount', 'Violation Date', 'Status', 'Case Number'],
      ...scrapedRecords.map(record => [
        record.ownerName,
        record.propertyAddress,
        record.violationType,
        record.violationDescription,
        record.fineAmount.toString(),
        record.violationDate,
        record.status,
        record.caseNumber || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-violations-${scrapingConfig.city}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Code violation records exported to CSV",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      closed: "default",
      pending: "secondary"
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Code Violation Scraper</h1>
          <p className="text-muted-foreground">
            Extract code violation property data from city enforcement databases
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Logs
          </Button>
          <Button onClick={handleExportRecords} disabled={scrapedRecords.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Scraping Configuration
          </CardTitle>
          <CardDescription>
            Configure the target city and scraping method for code violations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Select 
                value={scrapingConfig.city}
                onValueChange={(value) => {
                  const target = scrapingTargets.find(t => t.city === value);
                  if (target) {
                    setScrapingConfig(target);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {scrapingTargets.map(target => (
                    <SelectItem key={target.city} value={target.city}>
                      {target.city}, {target.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scraping Method</Label>
              <Select 
                value={scrapingConfig.method}
                onValueChange={(value) => setScrapingConfig(prev => ({ ...prev, method: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puppeteer">Web Scraping (Puppeteer)</SelectItem>
                  <SelectItem value="api">API Integration</SelectItem>
                  <SelectItem value="csv">CSV Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Source URL</Label>
              <Input 
                value={scrapingConfig.url}
                onChange={(e) => setScrapingConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://city.gov/code-violations"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Method: <Badge variant="outline">{scrapingConfig.method}</Badge>
            </div>
            <Button 
              onClick={handleStartScraping} 
              disabled={isScraping}
              className="min-w-[120px]"
            >
              {isScraping ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isScraping && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {currentStatus}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {scrapedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Scraped Records
            </CardTitle>
            <CardDescription>
              {scrapedRecords.length} code violation records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scrapedRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{record.ownerName}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {formatCurrency(record.fineAmount)}
                      </Badge>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.propertyAddress}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {record.violationType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Violation Date: {record.violationDate}
                    </div>
                    {record.caseNumber && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Case: {record.caseNumber}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {scrapedRecords.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Showing first 10 of {scrapedRecords.length} records
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {scrapedRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {scrapedRecords.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Violations</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(scrapedRecords.reduce((sum, r) => sum + r.fineAmount, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Fines</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {scrapedRecords.filter(r => r.status === 'open').length}
                </div>
                <div className="text-sm text-muted-foreground">Open Violations</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {scrapingConfig.city}
                </div>
                <div className="text-sm text-muted-foreground">City</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeViolationScraper; 