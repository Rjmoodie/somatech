import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calculator,
  BarChart3,
  Building2,
  PiggyBank,
  TrendingUp,
  Users,
  Bookmark,
  Clock,
  FileText
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: 'tool' | 'project' | 'help' | 'feature';
  category: string;
  description: string;
  path?: string;
  icon: React.ComponentType<any>;
}

interface GlobalSearchProps {
  onNavigate: (path: string) => void;
}

const GlobalSearch = ({ onNavigate }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchData: SearchResult[] = [
    // Tools
    { id: '1', title: 'DCF Analysis', type: 'tool', category: 'Valuation', description: 'Discounted cash flow valuation tool', path: '/somatech?module=stock-analysis', icon: BarChart3 },
    { id: '2', title: 'Cash Flow Simulator', type: 'tool', category: 'Planning', description: 'Model business cash flows', path: '/somatech?module=cash-flow', icon: TrendingUp },
    { id: '3', title: 'Retirement Planning', type: 'tool', category: 'Personal Finance', description: 'Plan your retirement', path: '/somatech?module=retirement-planning', icon: PiggyBank },
    { id: '4', title: 'Real Estate Calculator', type: 'tool', category: 'Investment', description: 'Analyze property investments', path: '/somatech?module=real-estate', icon: Building2 },
    { id: '5', title: 'Business Valuation', type: 'tool', category: 'Valuation', description: 'Value entire businesses', path: '/somatech?module=business-valuation', icon: Calculator },
    { id: '6', title: 'Funding Campaigns', type: 'tool', category: 'Funding', description: 'Manage funding campaigns', path: '/somatech?module=funding-campaigns', icon: Users },
    
    // Features
    { id: '7', title: 'Subscription Management', type: 'feature', category: 'Account', description: 'Manage your subscription plan', icon: Calculator },
    { id: '8', title: 'Export Reports', type: 'feature', category: 'Reports', description: 'Export your analyses as PDF', icon: FileText },
    { id: '9', title: 'Save Projects', type: 'feature', category: 'Storage', description: 'Save and organize your work', icon: Bookmark },
    
    // Help
    { id: '10', title: 'Getting Started', type: 'help', category: 'Tutorial', description: 'Learn how to use SomaTech', icon: Calculator },
    { id: '11', title: 'Premium Features', type: 'help', category: 'Subscription', description: 'Learn about premium features', icon: Calculator },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      onNavigate(result.path);
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'help': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools, features, help..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <>
          <Card className="absolute top-full mt-2 w-full z-50 shadow-lg max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {results.length === 0 && query.length >= 2 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="divide-y">
                  {results.map((result) => {
                    const Icon = result.icon;
                    return (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 text-primary" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{result.title}</span>
                              <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.description}</p>
                            <p className="text-xs text-muted-foreground font-medium">{result.category}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overlay to close search when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setResults([]);
            }}
          />
        </>
      )}
    </div>
  );
};

export default GlobalSearch;