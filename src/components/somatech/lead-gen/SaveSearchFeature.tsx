import React, { useState, useEffect } from 'react';
import { useSearchContext } from './context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Loader2, 
  Search, 
  Clock, 
  Trash2, 
  Edit3, 
  Bookmark,
  Filter,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  filters: any;
  advancedFilters?: any;
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
}

export const SaveSearchFeature = () => {
  const { state, dispatch } = useSearchContext();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = () => {
    try {
      const saved = localStorage.getItem('savedSearches');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: search.lastUsed ? new Date(search.lastUsed) : undefined
        })));
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const saveSearchToStorage = (searches: SavedSearch[]) => {
    try {
      localStorage.setItem('savedSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving searches:', error);
    }
  };

  const getCurrentFilters = () => {
    const filters = { ...state.filters };
    const advancedFilters = state.advancedFilters;
    
    // Clean up empty values
    Object.keys(filters).forEach(key => {
      if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    });

    return { filters, advancedFilters };
  };

  const hasActiveFilters = () => {
    const { filters, advancedFilters } = getCurrentFilters();
    return Object.keys(filters).length > 0 || (advancedFilters && advancedFilters.conditions.length > 0);
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a search name');
      return;
    }

    if (!hasActiveFilters()) {
      toast.error('No active filters to save');
      return;
    }

    setLoading(true);
    try {
      const { filters, advancedFilters } = getCurrentFilters();
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: searchName.trim(),
        description: searchDescription.trim() || undefined,
        filters,
        advancedFilters,
        createdAt: new Date(),
        useCount: 0
      };

      const updatedSearches = [...savedSearches, newSearch];
      setSavedSearches(updatedSearches);
      saveSearchToStorage(updatedSearches);

      toast.success(`Search "${searchName}" saved successfully`);
      setIsSaveDialogOpen(false);
      setSearchName('');
      setSearchDescription('');
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSearch = (search: SavedSearch) => {
    try {
      // Apply the saved filters
      if (search.filters && Object.keys(search.filters).length > 0) {
        dispatch({ type: 'SET_FILTERS', payload: search.filters });
      }
      
      if (search.advancedFilters) {
        dispatch({ type: 'SET_ADVANCED_FILTERS', payload: search.advancedFilters });
      }

      // Update usage stats
      const updatedSearches = savedSearches.map(s => 
        s.id === search.id 
          ? { ...s, lastUsed: new Date(), useCount: s.useCount + 1 }
          : s
      );
      setSavedSearches(updatedSearches);
      saveSearchToStorage(updatedSearches);

      toast.success(`Loaded search "${search.name}"`);
      setIsLoadDialogOpen(false);
    } catch (error) {
      console.error('Error loading search:', error);
      toast.error('Failed to load search');
    }
  };

  const handleDeleteSearch = (searchId: string) => {
    const updatedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSearches);
    saveSearchToStorage(updatedSearches);
    toast.success('Search deleted');
  };

  const handleEditSearch = (search: SavedSearch) => {
    setEditingSearch(search);
    setSearchName(search.name);
    setSearchDescription(search.description || '');
    setIsSaveDialogOpen(true);
  };

  const handleUpdateSearch = async () => {
    if (!editingSearch || !searchName.trim()) {
      toast.error('Please enter a search name');
      return;
    }

    setLoading(true);
    try {
      const { filters, advancedFilters } = getCurrentFilters();
      const updatedSearch: SavedSearch = {
        ...editingSearch,
        name: searchName.trim(),
        description: searchDescription.trim() || undefined,
        filters,
        advancedFilters
      };

      const updatedSearches = savedSearches.map(s => 
        s.id === editingSearch.id ? updatedSearch : s
      );
      setSavedSearches(updatedSearches);
      saveSearchToStorage(updatedSearches);

      toast.success(`Search "${searchName}" updated successfully`);
      setIsSaveDialogOpen(false);
      setSearchName('');
      setSearchDescription('');
      setEditingSearch(null);
    } catch (error) {
      console.error('Error updating search:', error);
      toast.error('Failed to update search');
    } finally {
      setLoading(false);
    }
  };

  const formatFilterSummary = (search: SavedSearch) => {
    const filters = search.filters || {};
    const conditions = [];
    
    if (filters.state) conditions.push(`State: ${filters.state}`);
    if (filters.city) conditions.push(`City: ${filters.city}`);
    if (filters.status) conditions.push(`Status: ${filters.status}`);
    if (filters.owner_type) conditions.push(`Owner: ${filters.owner_type}`);
    if (filters.address) conditions.push(`Address: ${filters.address}`);
    if (filters.zip) conditions.push(`ZIP: ${filters.zip}`);
    
    if (search.advancedFilters?.conditions?.length > 0) {
      conditions.push(`${search.advancedFilters.conditions.length} advanced conditions`);
    }
    
    return conditions.length > 0 ? conditions.join(', ') : 'Basic filters';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Save Search Button */}
      <div className="flex items-center gap-2">
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!hasActiveFilters()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Search
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSearch ? 'Update Saved Search' : 'Save Current Search'}
              </DialogTitle>
              <DialogDescription>
                Save your current filter combination for quick access later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">Search Name *</Label>
                <Input
                  id="search-name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., High Equity Properties"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="search-description">Description (Optional)</Label>
                <Input
                  id="search-description"
                  value={searchDescription}
                  onChange={(e) => setSearchDescription(e.target.value)}
                  placeholder="Brief description of this search"
                  className="mt-1"
                />
              </div>
              {hasActiveFilters() && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {formatFilterSummary({ filters: getCurrentFilters().filters, advancedFilters: getCurrentFilters().advancedFilters } as SavedSearch)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSaveDialogOpen(false);
                  setSearchName('');
                  setSearchDescription('');
                  setEditingSearch(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingSearch ? handleUpdateSearch : handleSaveSearch}
                disabled={loading || !searchName.trim()}
                className="flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingSearch ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Load Saved Searches Button */}
        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={savedSearches.length === 0}
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Load Saved ({savedSearches.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Load Saved Search</DialogTitle>
              <DialogDescription>
                Select a saved search to apply its filters.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                <AnimatePresence>
                  {savedSearches.map((search) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <h4 className="font-medium">{search.name}</h4>
                                {search.useCount > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Used {search.useCount}x
                                  </Badge>
                                )}
                              </div>
                              {search.description && (
                                <p className="text-sm text-muted-foreground">
                                  {search.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatFilterSummary(search)}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Created {formatDate(search.createdAt)}
                                </span>
                                {search.lastUsed && (
                                  <span className="flex items-center gap-1">
                                    <Filter className="h-3 w-3" />
                                    Used {formatDate(search.lastUsed)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditSearch(search)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSearch(search.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <Button
                              size="sm"
                              onClick={() => handleLoadSearch(search)}
                              className="w-full"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Load This Search
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {savedSearches.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No saved searches yet</p>
                    <p className="text-sm">Save your first search to get started</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Access to Recent Searches */}
      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
          <div className="flex flex-wrap gap-2">
            {savedSearches
              .sort((a, b) => (b.lastUsed?.getTime() || b.createdAt.getTime()) - (a.lastUsed?.getTime() || a.createdAt.getTime()))
              .slice(0, 3)
              .map((search) => (
                <Button
                  key={search.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadSearch(search)}
                  className="text-xs h-7"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {search.name}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}; 