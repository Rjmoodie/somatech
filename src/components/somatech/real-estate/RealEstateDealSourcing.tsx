import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, DollarSign, Calendar, Download, RefreshCw, Eye, Building2, User, Home, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RealEstateLead {
  id: string;
  state: string;
  county: string;
  list_type: string;
  owner_name: string;
  property_address: string;
  mailing_address: string;
  equity_estimate: number;
  property_value: number;
  last_sale_date: string;
  list_source_url: string;
  date_fetched: string;
  tags: string[];
  absentee_owner: boolean;
  llc_owned: boolean;
  distressed: boolean;
}

interface DealSourcingFilters {
  states: string[];
  counties: string[];
  listTypes: string[];
  ownerTypes: string[];
  equityRange: number[];
  propertyValueRange: number[];
  absenteeOnly: boolean;
  llcOnly: boolean;
  distressedOnly: boolean;
  searchTerm: string;
}

const RealEstateDealSourcing = () => {
  const [leads, setLeads] = useState<RealEstateLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<RealEstateLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'map' | 'cards'>('table');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter states
  const [filters, setFilters] = useState<DealSourcingFilters>({
    states: [],
    counties: [],
    listTypes: [],
    ownerTypes: [],
    equityRange: [0, 100],
    propertyValueRange: [0, 1000000],
    absenteeOnly: false,
    llcOnly: false,
    distressedOnly: false,
    searchTerm: ''
  });

  // Available data sources
  const listTypes = [
    "Tax Delinquent",
    "Code Violation", 
    "Probate",
    "Foreclosure",
    "Absentee Owner",
    "LLC Owned",
    "Pre-Foreclosure",
    "Tax Lien",
    "Code Enforcement",
    "Vacant Property"
  ];

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  // Mock data for demonstration - in real implementation, this would come from database
  const mockLeads: RealEstateLead[] = [
    {
      id: "1",
      state: "California",
      county: "Los Angeles",
      list_type: "Tax Delinquent",
      owner_name: "John Smith",
      property_address: "123 Main St, Los Angeles, CA 90210",
      mailing_address: "456 Oak Ave, Beverly Hills, CA 90211",
      equity_estimate: 250000,
      property_value: 750000,
      last_sale_date: "2020-03-15",
      list_source_url: "https://assessor.lacounty.gov",
      date_fetched: "2024-01-15",
      tags: ["distressed", "tax-delinquent"],
      absentee_owner: true,
      llc_owned: false,
      distressed: true
    },
    {
      id: "2", 
      state: "Texas",
      county: "Harris",
      list_type: "Code Violation",
      owner_name: "ABC Properties LLC",
      property_address: "789 Elm St, Houston, TX 77001",
      mailing_address: "789 Elm St, Houston, TX 77001",
      equity_estimate: 180000,
      property_value: 450000,
      last_sale_date: "2019-08-22",
      list_source_url: "https://www.houstontx.gov",
      date_fetched: "2024-01-14",
      tags: ["code-violation", "llc-owned"],
      absentee_owner: false,
      llc_owned: true,
      distressed: true
    },
    {
      id: "3",
      state: "Florida",
      county: "Miami-Dade", 
      list_type: "Probate",
      owner_name: "Maria Rodriguez",
      property_address: "321 Beach Blvd, Miami, FL 33139",
      mailing_address: "654 Palm Dr, Coral Gables, FL 33134",
      equity_estimate: 320000,
      property_value: 850000,
      last_sale_date: "2018-11-10",
      list_source_url: "https://www.miami-dadeclerk.com",
      date_fetched: "2024-01-13",
      tags: ["probate", "absentee"],
      absentee_owner: true,
      llc_owned: false,
      distressed: false
    }
  ];

  useEffect(() => {
    // Load initial data
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change
    applyFilters();
  }, [filters, leads]);

  const applyFilters = () => {
    let filtered = [...leads];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.owner_name.toLowerCase().includes(searchLower) ||
        lead.property_address.toLowerCase().includes(searchLower) ||
        lead.county.toLowerCase().includes(searchLower) ||
        lead.state.toLowerCase().includes(searchLower)
      );
    }

    // State filter
    if (filters.states.length > 0) {
      filtered = filtered.filter(lead => filters.states.includes(lead.state));
    }

    // County filter
    if (filters.counties.length > 0) {
      filtered = filtered.filter(lead => filters.counties.includes(lead.county));
    }

    // List type filter
    if (filters.listTypes.length > 0) {
      filtered = filtered.filter(lead => filters.listTypes.includes(lead.list_type));
    }

    // Owner type filter
    if (filters.ownerTypes.length > 0) {
      filtered = filtered.filter(lead => {
        if (filters.ownerTypes.includes('LLC') && lead.llc_owned) return true;
        if (filters.ownerTypes.includes('Individual') && !lead.llc_owned) return true;
        if (filters.ownerTypes.includes('Absentee') && lead.absentee_owner) return true;
        return false;
      });
    }

    // Equity range filter
    filtered = filtered.filter(lead => 
      lead.equity_estimate >= filters.equityRange[0] && 
      lead.equity_estimate <= filters.equityRange[1]
    );

    // Property value range filter
    filtered = filtered.filter(lead => 
      lead.property_value >= filters.propertyValueRange[0] && 
      lead.property_value <= filters.propertyValueRange[1]
    );

    // Boolean filters
    if (filters.absenteeOnly) {
      filtered = filtered.filter(lead => lead.absentee_owner);
    }

    if (filters.llcOnly) {
      filtered = filtered.filter(lead => lead.llc_owned);
    }

    if (filters.distressedOnly) {
      filtered = filtered.filter(lead => lead.distressed);
    }

    setFilteredLeads(filtered);
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      // In real implementation, this would fetch fresh data from APIs/database
      toast({
        title: "Data Refreshed",
        description: "Latest real estate data has been loaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['State', 'County', 'List Type', 'Owner Name', 'Property Address', 'Equity Estimate', 'Property Value', 'Last Sale Date'],
      ...filteredLeads.map(lead => [
        lead.state,
        lead.county,
        lead.list_type,
        lead.owner_name,
        lead.property_address,
        lead.equity_estimate.toString(),
        lead.property_value.toString(),
        lead.last_sale_date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `real-estate-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Data has been exported to CSV file",
    });
  };

  const handleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real Estate Deal Sourcing</h1>
          <p className="text-muted-foreground">
            Access and analyze real estate data from all 50 U.S. states
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <CardDescription>
            Filter leads by location, property type, and financial criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by owner name, address, county..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>States</Label>
              <Select
                onValueChange={(value) => {
                  if (value && !filters.states.includes(value)) {
                    setFilters(prev => ({ ...prev, states: [...prev.states, value] }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select states" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.states.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.states.map(state => (
                    <Badge key={state} variant="secondary" className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        states: prev.states.filter(s => s !== state) 
                      }))}>
                      {state} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>List Types</Label>
              <Select
                onValueChange={(value) => {
                  if (value && !filters.listTypes.includes(value)) {
                    setFilters(prev => ({ ...prev, listTypes: [...prev.listTypes, value] }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select list types" />
                </SelectTrigger>
                <SelectContent>
                  {listTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.listTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.listTypes.map(type => (
                    <Badge key={type} variant="secondary" className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        listTypes: prev.listTypes.filter(t => t !== type) 
                      }))}>
                      {type} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Owner Types</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="llc-only"
                    checked={filters.llcOnly}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, llcOnly: checked as boolean }))
                    }
                  />
                  <Label htmlFor="llc-only">LLC Owned Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="absentee-only"
                    checked={filters.absenteeOnly}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, absenteeOnly: checked as boolean }))
                    }
                  />
                  <Label htmlFor="absentee-only">Absentee Owners Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="distressed-only"
                    checked={filters.distressedOnly}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, distressedOnly: checked as boolean }))
                    }
                  />
                  <Label htmlFor="distressed-only">Distressed Properties Only</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Equity Range: ${filters.equityRange[0].toLocaleString()} - ${filters.equityRange[1].toLocaleString()}</Label>
              <Slider
                value={filters.equityRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, equityRange: value }))}
                max={1000000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Property Value Range: ${filters.propertyValueRange[0].toLocaleString()} - ${filters.propertyValueRange[1].toLocaleString()}</Label>
              <Slider
                value={filters.propertyValueRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, propertyValueRange: value }))}
                max={5000000}
                min={0}
                step={50000}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Real Estate Leads</CardTitle>
              <CardDescription>
                {filteredLeads.length} leads found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                Map
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>List Type</TableHead>
                  <TableHead>Equity</TableHead>
                  <TableHead>Property Value</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.owner_name}</div>
                        <div className="text-sm text-muted-foreground">{lead.county}, {lead.state}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{lead.property_address}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.list_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(lead.equity_estimate)}
                    </TableCell>
                    <TableCell>{formatCurrency(lead.property_value)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.absentee_owner && <Badge variant="secondary" className="text-xs">Absentee</Badge>}
                        {lead.llc_owned && <Badge variant="secondary" className="text-xs">LLC</Badge>}
                        {lead.distressed && <Badge variant="destructive" className="text-xs">Distressed</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{lead.owner_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.county}, {lead.state}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{lead.list_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium">Property Address</div>
                      <div className="text-muted-foreground">{lead.property_address}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-600">Equity</div>
                        <div className="text-lg font-bold">{formatCurrency(lead.equity_estimate)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Property Value</div>
                        <div className="text-lg">{formatCurrency(lead.property_value)}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {lead.absentee_owner && <Badge variant="secondary" className="text-xs">Absentee</Badge>}
                      {lead.llc_owned && <Badge variant="secondary" className="text-xs">LLC</Badge>}
                      {lead.distressed && <Badge variant="destructive" className="text-xs">Distressed</Badge>}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        Last sale: {formatDate(lead.last_sale_date)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === 'map' && (
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Map View</h3>
                <p className="text-muted-foreground">Interactive map view coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Will show {filteredLeads.length} properties on map
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Source Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Data Sources & Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">50</div>
              <div className="text-sm text-muted-foreground">States Covered</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">10+</div>
              <div className="text-sm text-muted-foreground">List Types</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Daily</div>
              <div className="text-sm text-muted-foreground">Data Updates</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Data is sourced from public county records, tax assessor databases, and government agencies.</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstateDealSourcing; 