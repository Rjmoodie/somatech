import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  FileText,
  Download,
  DollarSign,
  AlertTriangle,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreForeclosureRecord {
  id: string;
  ownerName: string;
  propertyAddress: string;
  mailingAddress?: string;
  lenderName: string;
  loanAmount: number;
  defaultAmount: number;
  auctionDate?: string;
  caseNumber: string;
  filingDate: string;
  status: 'lis_pendens' | 'notice_of_sale' | 'auction_scheduled' | 'cancelled';
  county: string;
  state: string;
  scrapedAt: string;
  sourceUrl: string;
  propertyValue?: number;
  equityEstimate?: number;
}

interface ScrapingConfig {
  county: string;
  state: string;
  url: string;
  method: 'puppeteer' | 'api' | 'court_records';
  selectors?: {
    tableSelector: string;
    rowSelector: string;
    ownerSelector: string;
    addressSelector: string;
    lenderSelector: string;
    amountSelector: string;
    dateSelector: string;
    caseSelector: string;
  };
  apiConfig?: {
    endpoint: string;
    apiKey?: string;
    headers?: Record<string, string>;
  };
}

const PreForeclosureScraper = () => {
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    county: 'Broward',
    state: 'Florida',
    url: 'https://www.browardclerk.org/foreclosures',
    method: 'puppeteer',
    selectors: {
      tableSelector: '.foreclosure-table',
      rowSelector: 'tr',
      ownerSelector: '.owner-name',
      addressSelector: '.property-address',
      lenderSelector: '.lender-name',
      amountSelector: '.loan-amount',
      dateSelector: '.filing-date',
      caseSelector: '.case-number'
    }
  });

  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedRecords, setScrapedRecords] = useState<PreForeclosureRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const { toast } = useToast();

  // Pre-configured scraping targets
  const scrapingTargets = [
    {
      county: 'Broward',
      state: 'Florida',
      url: 'https://www.browardclerk.org/foreclosures',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.foreclosure-table',
        rowSelector: 'tr',
        ownerSelector: '.owner-name',
        addressSelector: '.property-address',
        lenderSelector: '.lender-name',
        amountSelector: '.loan-amount',
        dateSelector: '.filing-date',
        caseSelector: '.case-number'
      }
    },
    {
      county: 'Miami-Dade',
      state: 'Florida',
      url: 'https://www.miami-dadeclerk.com/foreclosures',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.foreclosure-cases',
        rowSelector: '.case-row',
        ownerSelector: '.defendant',
        addressSelector: '.property',
        lenderSelector: '.plaintiff',
        amountSelector: '.amount',
        dateSelector: '.date',
        caseSelector: '.case'
      }
    },
    {
      county: 'Los Angeles',
      state: 'California',
      url: 'https://www.lacourt.org/foreclosures',
      method: 'court_records' as const
    },
    {
      county: 'Harris',
      state: 'Texas',
      url: 'https://www.harriscountyclerk.org/foreclosures',
      method: 'puppeteer' as const,
      selectors: {
        tableSelector: '.foreclosure-list',
        rowSelector: '.foreclosure-item',
        ownerSelector: '.owner',
        addressSelector: '.address',
        lenderSelector: '.lender',
        amountSelector: '.amount',
        dateSelector: '.date',
        caseSelector: '.case'
      }
    }
  ];

  const lenders = [
    'Bank of America',
    'Wells Fargo',
    'Chase Bank',
    'Citibank',
    'US Bank',
    'PNC Bank',
    'SunTrust',
    'Regions Bank',
    'BB&T',
    'Fifth Third Bank'
  ];

  const handleStartScraping = async () => {
    setIsScraping(true);
    setProgress(0);
    setCurrentStatus('Initializing pre-foreclosure scraper...');

    try {
      // Simulate scraping process
      await simulateScrapingProcess();
      
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${scrapedRecords.length} pre-foreclosure records`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Failed to scrape pre-foreclosure data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
      setProgress(100);
    }
  };

  const simulateScrapingProcess = async () => {
    const steps = [
      { progress: 10, status: 'Connecting to county court records...' },
      { progress: 25, status: 'Locating foreclosure filings...' },
      { progress: 40, status: 'Extracting property and owner details...' },
      { progress: 60, status: 'Processing lender information...' },
      { progress: 80, status: 'Calculating equity estimates...' },
      { progress: 95, status: 'Saving records to database...' },
      { progress: 100, status: 'Pre-foreclosure scraping completed!' }
    ];

    for (const step of steps) {
      setProgress(step.progress);
      setCurrentStatus(step.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate mock records
    const mockRecords: PreForeclosureRecord[] = Array.from({ length: 60 }, (_, i) => {
      const loanAmount = Math.floor(Math.random() * 400000) + 100000;
      const propertyValue = loanAmount + Math.floor(Math.random() * 200000);
      const defaultAmount = Math.floor(Math.random() * 50000) + 10000;
      
      return {
        id: `foreclosure-${Date.now()}-${i}`,
        ownerName: `Property Owner ${i + 1}`,
        propertyAddress: `${1000 + i} Pine St, ${scrapingConfig.county}, ${scrapingConfig.state}`,
        mailingAddress: `${2000 + i} Oak Ave, Miami, FL 33101`,
        lenderName: lenders[Math.floor(Math.random() * lenders.length)],
        loanAmount,
        defaultAmount,
        auctionDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        caseNumber: `FC-${2024}-${String(i + 1).padStart(4, '0')}`,
        filingDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['lis_pendens', 'notice_of_sale', 'auction_scheduled', 'cancelled'][Math.floor(Math.random() * 4)] as any,
        county: scrapingConfig.county,
        state: scrapingConfig.state,
        scrapedAt: new Date().toISOString(),
        sourceUrl: scrapingConfig.url,
        propertyValue,
        equityEstimate: propertyValue - loanAmount
      };
    });

    setScrapedRecords(mockRecords);
  };

  const handleExportRecords = () => {
    const csvContent = [
      ['Owner Name', 'Property Address', 'Lender', 'Loan Amount', 'Default Amount', 'Filing Date', 'Status', 'Case Number', 'Property Value', 'Equity Estimate'],
      ...scrapedRecords.map(record => [
        record.ownerName,
        record.propertyAddress,
        record.lenderName,
        record.loanAmount.toString(),
        record.defaultAmount.toString(),
        record.filingDate,
        record.status,
        record.caseNumber,
        record.propertyValue?.toString() || '',
        record.equityEstimate?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-foreclosures-${scrapingConfig.county}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Pre-foreclosure records exported to CSV",
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
      lis_pendens: "outline",
      notice_of_sale: "secondary",
      auction_scheduled: "destructive",
      cancelled: "default"
    };

    const labels: Record<string, string> = {
      lis_pendens: "Lis Pendens",
      notice_of_sale: "Notice of Sale",
      auction_scheduled: "Auction Scheduled",
      cancelled: "Cancelled"
    };

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pre-Foreclosure Scraper</h1>
          <p className="text-muted-foreground">
            Extract pre-foreclosure property data from court records and county databases
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
            <Building2 className="h-5 w-5" />
            Scraping Configuration
          </CardTitle>
          <CardDescription>
            Configure the target county and scraping method for pre-foreclosures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>County</Label>
              <Select 
                value={scrapingConfig.county}
                onValueChange={(value) => {
                  const target = scrapingTargets.find(t => t.county === value);
                  if (target) {
                    setScrapingConfig(target);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {scrapingTargets.map(target => (
                    <SelectItem key={target.county} value={target.county}>
                      {target.county}, {target.state}
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
                  <SelectItem value="court_records">Court Records</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Source URL</Label>
              <Input 
                value={scrapingConfig.url}
                onChange={(e) => setScrapingConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://county.gov/foreclosures"
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
                  <Building2 className="h-4 w-4 mr-2" />
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
              {scrapedRecords.length} pre-foreclosure records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scrapedRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{record.ownerName}</div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      {record.equityEstimate && record.equityEstimate > 0 && (
                        <Badge variant="default" className="text-green-600">
                          {formatCurrency(record.equityEstimate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {record.propertyAddress}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Lender: {record.lenderName}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Loan: {formatCurrency(record.loanAmount)} | Default: {formatCurrency(record.defaultAmount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Filed: {record.filingDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Case: {record.caseNumber}
                    </div>
                    {record.auctionDate && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Auction: {record.auctionDate}
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
                <div className="text-sm text-muted-foreground">Total Foreclosures</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(scrapedRecords.reduce((sum, r) => sum + r.loanAmount, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Loan Amount</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {scrapedRecords.filter(r => r.equityEstimate && r.equityEstimate > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Properties with Equity</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {scrapingConfig.county}
                </div>
                <div className="text-sm text-muted-foreground">County</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreForeclosureScraper; 