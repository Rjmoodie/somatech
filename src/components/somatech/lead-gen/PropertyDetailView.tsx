import React, { useState, useEffect } from "react";
import { useSearchContext } from "./context";
import { useAuth } from "@/components/somatech/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { EnhancedTooltip, PropertyTooltip } from "./EnhancedTooltip";
import { 
  InteractiveCard, 
  AnimatedButton, 
  HoverLift, 
  LoadingSpinner,
  SmoothTransition 
} from "./Microinteractions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  User, 
  DollarSign, 
  MapPin, 
  Tag, 
  Star, 
  Save, 
  ExternalLink,
  Calendar,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Phone,
  Mail,
  FileText,
  Settings,
  X,
  Plus,
  Edit,
  Trash2,
  Flag,
  Timer,
  Building2,
  Car,
  TreePine,
  Wifi,
  ParkingCircle,
  UtensilsCrossed,
  Dumbbell,
  School,
  ShoppingBag,
  Bus,
  Train
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TAG_OPTIONS = [
  "Distressed", "Vacant", "Flip", "Rental", "Auction", "Foreclosure",
  "Probate", "Divorce", "Estate", "Investment", "Owner-Occupied"
];

const FOLDER_OPTIONS = [
  "Hot Leads", "Follow Up", "Under Contract", "Closed", "Archive",
  "High Equity", "Out of State", "Absentee", "Distressed"
];

const PropertyDetailView: React.FC = () => {
  const { state, dispatch } = useSearchContext();
  const { selectedPropertyId, results } = state;
  const { user } = useAuth();
  
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [folder, setFolder] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Find the selected property
  const property = results.find(p => p.id === selectedPropertyId);

  // Close modal if no property is selected
  const isOpen = !!selectedPropertyId && !!property;

  const handleClose = () => {
    dispatch({ type: "SELECT_PROPERTY", payload: null });
  };

  // Calculate owner intelligence metrics
  const highMotivation = property?.tags?.includes('distressed') || property?.tags?.includes('vacant') || false;
  const ownerTypeLabel = property?.owner_type === 'absentee' ? 'Absentee Owner' : 'Owner Occupied';
  const yearsOwned = property?.years_owned || null;
  const isOutOfState = property?.owner_state && property?.owner_state !== property?.state;
  const isAbsentee = property?.owner_type === 'absentee';
  const isLongTermOwner = yearsOwned && yearsOwned > 10;
  const isDistressed = property?.tags?.includes('distressed');
  const isVacant = property?.tags?.includes('vacant');

  console.log('PropertyDetailView: selectedPropertyId', selectedPropertyId);
  console.log('PropertyDetailView: property', property);
  console.log('PropertyDetailView: isOpen', isOpen);

  const handleSaveProperty = async () => {
    if (!user || !property) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_leads')
        .upsert({
          user_id: user.id,
          property_id: property.id,
          notes,
          tags,
          folder,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      setSaved(true);
      console.log('PropertyDetailView: Property saved successfully');
    } catch (error) {
      console.error('PropertyDetailView: Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFolderChange = (value: string) => {
    setFolder(value);
  };

  const getEquityColor = (equity: number) => {
    if (equity >= 70) return "text-green-600 dark:text-green-400";
    if (equity >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "sold":
        return "text-blue-600 dark:text-blue-400";
      case "off_market":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Mock amenities data
  const amenities = [
    { icon: Wifi, label: "High-Speed Internet", available: true },
    { icon: ParkingCircle, label: "Parking", available: true },
    { icon: Car, label: "Garage", available: false },
    { icon: TreePine, label: "Garden", available: true },
    { icon: UtensilsCrossed, label: "Kitchen", available: true },
    { icon: Dumbbell, label: "Gym", available: false },
    { icon: School, label: "Near Schools", available: true },
    { icon: ShoppingBag, label: "Shopping", available: true },
    { icon: Bus, label: "Public Transport", available: true },
    { icon: Train, label: "Train Station", available: false }
  ];

  if (!isOpen || !property) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 pb-4 sm:pb-8 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {property.address}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {property.city}, {property.state} {property.zip}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveProperty}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : saved ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // Scroll to calculator section and populate with property data
                      const calculatorSection = document.querySelector('[data-calculator-section]');
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({ behavior: 'smooth' });
                      }
                      // Dispatch custom event to populate calculator
                      window.dispatchEvent(new CustomEvent('populate-calculator', {
                        detail: property
                      }));
                    }}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Analyze
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <PropertyDetailContent
                property={property}
                notes={notes}
                setNotes={setNotes}
                tags={tags}
                handleTagChange={handleTagChange}
                folder={folder}
                handleFolderChange={handleFolderChange}
                saved={saved}
                loading={loading}
                onSave={handleSaveProperty}
                highMotivation={highMotivation}
                ownerTypeLabel={ownerTypeLabel}
                yearsOwned={yearsOwned}
                isOutOfState={isOutOfState}
                isAbsentee={isAbsentee}
                isLongTermOwner={isLongTermOwner}
                isDistressed={isDistressed}
                isVacant={isVacant}
                getEquityColor={getEquityColor}
                getStatusColor={getStatusColor}
                amenities={amenities}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PropertyDetailContentProps {
  property: any;
  notes: string;
  setNotes: (notes: string) => void;
  tags: string[];
  handleTagChange: (tag: string) => void;
  folder: string;
  handleFolderChange: (folder: string) => void;
  saved: boolean;
  loading: boolean;
  onSave: () => void;
  highMotivation: boolean;
  ownerTypeLabel: string;
  yearsOwned: number | null;
  isOutOfState: boolean;
  isAbsentee: boolean;
  isLongTermOwner: boolean;
  isDistressed: boolean;
  isVacant: boolean;
  getEquityColor: (equity: number) => string;
  getStatusColor: (status: string) => string;
  amenities: Array<{ icon: any; label: string; available: boolean }>;
}

const PropertyDetailContent: React.FC<PropertyDetailContentProps> = ({
  property,
  notes,
  setNotes,
  tags,
  handleTagChange,
  folder,
  handleFolderChange,
  saved,
  loading,
  onSave,
  highMotivation,
  ownerTypeLabel,
  yearsOwned,
  isOutOfState,
  isAbsentee,
  isLongTermOwner,
  isDistressed,
  isVacant,
  getEquityColor,
  getStatusColor,
  amenities
}) => {
  console.log('PropertyDetailContent: Received props', {
    isAbsentee,
    isLongTermOwner,
    isDistressed,
    isVacant
  });

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Price</span>
              <span className="font-semibold">${property.purchase_price?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Value</span>
              <span className="font-semibold">${property.arv?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Equity %</span>
              <span className={cn("font-semibold", getEquityColor(property.equity_percent || 0))}>
                {property.equity_percent || 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Profit Potential</span>
              <span className="font-semibold text-green-600">
                ${((property.arv || 0) - (property.purchase_price || 0)).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Owner Intelligence */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Owner Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Owner Type</span>
              <span className="font-semibold">{ownerTypeLabel}</span>
            </div>
            {yearsOwned && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Years Owned</span>
                <span className="font-semibold">{yearsOwned} years</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Out of State</span>
              <span className={cn("font-semibold", isOutOfState ? "text-orange-600" : "text-gray-600")}>
                {isOutOfState ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Motivation</span>
              <span className={cn("font-semibold", highMotivation ? "text-red-600" : "text-gray-600")}>
                {highMotivation ? "High" : "Unknown"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Property Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              Property Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className={cn("font-semibold", getStatusColor(property.status || ""))}>
                {property.status || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Property Type</span>
              <span className="font-semibold">{property.property_type || "Residential"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
              <span className="font-semibold">
                {property.last_updated ? new Date(property.last_updated).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tags</span>
              <div className="flex gap-1">
                {property.tags?.slice(0, 2).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {property.tags?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owner Intelligence Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Owner Intelligence Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={cn(
              "p-3 rounded-lg border-2 text-center",
              isAbsentee 
                ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-200 bg-gray-50 dark:bg-gray-800"
            )}>
              <User className={cn("h-6 w-6 mx-auto mb-2", isAbsentee ? "text-blue-600" : "text-gray-400")} />
              <div className="text-sm font-medium">Absentee Owner</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isAbsentee ? "Yes" : "No"}
              </div>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg border-2 text-center",
              isLongTermOwner 
                ? "border-green-200 bg-green-50 dark:bg-green-900/20" 
                : "border-gray-200 bg-gray-50 dark:bg-gray-800"
            )}>
              <Timer className={cn("h-6 w-6 mx-auto mb-2", isLongTermOwner ? "text-green-600" : "text-gray-400")} />
              <div className="text-sm font-medium">Long-term Owner</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isLongTermOwner ? "Yes" : "No"}
              </div>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg border-2 text-center",
              isDistressed 
                ? "border-red-200 bg-red-50 dark:bg-red-900/20" 
                : "border-gray-200 bg-gray-50 dark:bg-gray-800"
            )}>
              <AlertCircle className={cn("h-6 w-6 mx-auto mb-2", isDistressed ? "text-red-600" : "text-gray-400")} />
              <div className="text-sm font-medium">Distressed</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isDistressed ? "Yes" : "No"}
              </div>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg border-2 text-center",
              isVacant 
                ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20" 
                : "border-gray-200 bg-gray-50 dark:bg-gray-800"
            )}>
              <Building className={cn("h-6 w-6 mx-auto mb-2", isVacant ? "text-yellow-600" : "text-gray-400")} />
              <div className="text-sm font-medium">Vacant</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {isVacant ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add your notes about this property..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              Tags & Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TAG_OPTIONS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Folder</Label>
              <Select value={folder} onValueChange={handleFolderChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {FOLDER_OPTIONS.map((folderOption) => (
                    <SelectItem key={folderOption} value={folderOption}>
                      {folderOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="h-5 w-5 text-green-600" />
            Property Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <amenity.icon className={cn(
                  "h-4 w-4",
                  amenity.available 
                    ? "text-green-600" 
                    : "text-gray-400"
                )} />
                <span className={cn(
                  "text-sm",
                  amenity.available 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailView; 