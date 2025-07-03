import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { MarketplaceFilters } from "./types";
import MarketplaceListings from "./marketplace/MarketplaceListings";
import MarketplaceFiltersPanel from "./marketplace/MarketplaceFiltersPanel";
import CreateListingDialog from "./marketplace/CreateListingDialog";

const Marketplace = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'newest'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="elevated-card primary-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Business Marketplace</CardTitle>
              <p className="text-muted-foreground mt-2">
                Discover investment opportunities and list your business for sale
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button 
                onClick={() => setShowCreateListing(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                List My Business
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="lg:col-span-1">
            <MarketplaceFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}

        {/* Listings */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <MarketplaceListings filters={filters} />
        </div>
      </div>

      {/* Create Listing Dialog */}
      <CreateListingDialog
        open={showCreateListing}
        onOpenChange={setShowCreateListing}
      />
    </div>
  );
};

export default Marketplace;