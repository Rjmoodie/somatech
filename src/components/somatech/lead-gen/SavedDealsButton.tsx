import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, FolderOpen, Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SavedDeal {
  id: string;
  name: string;
  propertyAddress: string;
  purchasePrice: number;
  monthlyRent: number;
  arv: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface SavedDealsButtonProps {
  onLoadDeal?: (deal: SavedDeal) => void;
}

export const SavedDealsButton: React.FC<SavedDealsButtonProps> = ({ onLoadDeal }) => {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([
    {
      id: "1",
      name: "123 Main St - BRRRR Deal",
      propertyAddress: "123 Main St, New York, NY 10001",
      purchasePrice: 150000,
      monthlyRent: 1800,
      arv: 220000,
      notes: "Great potential for BRRRR strategy. Property needs cosmetic updates.",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "456 Oak Ave - Cash Flow Deal",
      propertyAddress: "456 Oak Ave, Brooklyn, NY 11201",
      purchasePrice: 200000,
      monthlyRent: 2200,
      arv: 250000,
      notes: "Strong cash flow potential. Property is tenant-occupied.",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-14"
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: "",
    propertyAddress: "",
    purchasePrice: "",
    monthlyRent: "",
    arv: "",
    notes: ""
  });

  const handleLoadDeal = (deal: SavedDeal) => {
    onLoadDeal?.(deal);
    setIsOpen(false);
  };

  const handleCreateDeal = () => {
    const deal: SavedDeal = {
      id: Date.now().toString(),
      name: newDeal.name,
      propertyAddress: newDeal.propertyAddress,
      purchasePrice: parseFloat(newDeal.purchasePrice) || 0,
      monthlyRent: parseFloat(newDeal.monthlyRent) || 0,
      arv: parseFloat(newDeal.arv) || 0,
      notes: newDeal.notes,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setSavedDeals(prev => [deal, ...prev]);
    setNewDeal({
      name: "",
      propertyAddress: "",
      purchasePrice: "",
      monthlyRent: "",
      arv: "",
      notes: ""
    });
    setShowCreateForm(false);
  };

  const handleDeleteDeal = (id: string) => {
    setSavedDeals(prev => prev.filter(deal => deal.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Saved Deals
          <Badge variant="secondary" className="ml-1 text-xs">
            {savedDeals.length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Saved Deals
          </DialogTitle>
          <DialogDescription>
            Manage your saved investment deals and analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Create New Deal Button */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Deal
            </Button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Deal</CardTitle>
                <CardDescription>Save a new investment deal for future analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deal-name">Deal Name</Label>
                    <Input
                      id="deal-name"
                      value={newDeal.name}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., 123 Main St - BRRRR Deal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="property-address">Property Address</Label>
                    <Input
                      id="property-address"
                      value={newDeal.propertyAddress}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, propertyAddress: e.target.value }))}
                      placeholder="123 Main St, City, State ZIP"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="purchase-price">Purchase Price</Label>
                    <Input
                      id="purchase-price"
                      type="number"
                      value={newDeal.purchasePrice}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, purchasePrice: e.target.value }))}
                      placeholder="150000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-rent">Monthly Rent</Label>
                    <Input
                      id="monthly-rent"
                      type="number"
                      value={newDeal.monthlyRent}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, monthlyRent: e.target.value }))}
                      placeholder="1800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="arv">ARV</Label>
                    <Input
                      id="arv"
                      type="number"
                      value={newDeal.arv}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, arv: e.target.value }))}
                      placeholder="220000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newDeal.notes}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this deal..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateDeal} className="flex-1">
                    Save Deal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Deals List */}
          <div className="space-y-3">
            {savedDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{deal.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {deal.purchasePrice > 0 ? `$${deal.purchasePrice.toLocaleString()}` : 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {deal.propertyAddress}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Rent: ${deal.monthlyRent.toLocaleString()}/mo</span>
                        <span>ARV: ${deal.arv.toLocaleString()}</span>
                        <span>Created: {deal.createdAt}</span>
                      </div>
                      {deal.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                          "{deal.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadDeal(deal)}
                        className="h-8 w-8 p-0"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {savedDeals.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved deals yet</p>
              <p className="text-sm">Create your first deal to get started</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 