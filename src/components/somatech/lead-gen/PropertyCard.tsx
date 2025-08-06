import React, { useState } from "react";
import { useSearchContext } from "./context";
import { motion } from "framer-motion";
import { 
  Eye, 
  Heart, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Building, 
  User, 
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { dispatch } = useSearchContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleViewDetails = () => {
    console.log('PropertyCard: View details clicked for property:', property.id);
    dispatch({ type: "SELECT_PROPERTY", payload: property.id });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
  };

  // Calculate property metrics
  const equityPercent = property.equity_percent || 0;
  const purchasePrice = property.purchase_price || 0;
  const arv = property.arv || 0;
  const profitPotential = arv - purchasePrice;
  
  // Determine property status and priority
  const isHighEquity = equityPercent > 70;
  const isDistressed = property.tags?.includes('distressed');
  const isVacant = property.tags?.includes('vacant');
  const isAbsentee = property.owner_type === 'absentee';

  const getPriorityColor = () => {
    if (isHighEquity && isDistressed) return 'bg-red-100 text-red-700 border-red-200';
    if (isHighEquity) return 'bg-green-100 text-green-700 border-green-200';
    if (isDistressed) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityIcon = () => {
    if (isHighEquity && isDistressed) return <AlertTriangle className="h-3 w-3" />;
    if (isHighEquity) return <TrendingUp className="h-3 w-3" />;
    if (isDistressed) return <AlertTriangle className="h-3 w-3" />;
    return <Home className="h-3 w-3" />;
  };

  return (
    <motion.div
      className={cn(
        "relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        isHovered ? "border-blue-300 dark:border-blue-600" : "border-gray-200 dark:border-gray-700"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Priority Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant="outline" 
          className={cn("text-xs font-medium", getPriorityColor())}
        >
          {getPriorityIcon()}
          <span className="ml-1">
            {isHighEquity && isDistressed ? 'Hot Deal' : 
             isHighEquity ? 'High Equity' : 
             isDistressed ? 'Distressed' : 'Standard'}
          </span>
        </Badge>
      </div>

      {/* Save Button */}
      <motion.button
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          handleSave();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-colors",
            isSaved ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
          )} 
        />
      </motion.button>

      {/* Property Image Placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-t-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="h-12 w-12 text-blue-600 dark:text-blue-400 opacity-60" />
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {property.city}, {property.state}
          </Badge>
        </div>
      </div>

      {/* Property Content */}
      <div className="p-4">
        {/* Address */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
            {property.address}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Price</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              ${(purchasePrice / 1000).toFixed(0)}k
            </span>
          </div>
          
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Equity</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {equityPercent}%
            </span>
          </div>
        </div>

        {/* Property Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {isAbsentee && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <User className="h-3 w-3 mr-1" />
              Absentee
            </Badge>
          )}
          {isVacant && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              <Building className="h-3 w-3 mr-1" />
              Vacant
            </Badge>
          )}
          {profitPotential > 0 && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              +${(profitPotential / 1000).toFixed(0)}k
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Focus map on this property
              console.log('Focus map on property:', property.address);
              // TODO: Implement map focus functionality
              // This would typically dispatch an action to center the map on this property's coordinates
              // For now, we'll just select the property to show it's working
              dispatch({
                type: "SELECT_PROPERTY",
                payload: property.id
              });
            }}
          >
            <Target className="h-3 w-3" />
          </Button>
        </div>

        {/* Property Status */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Added 2 days ago</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">High Priority</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default PropertyCard; 