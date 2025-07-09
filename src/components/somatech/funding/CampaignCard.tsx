import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Heart, Settings } from "lucide-react";
import { FundingCampaign } from "../types";

interface CampaignCardProps {
  campaign: FundingCampaign;
  onClick: () => void;
  showManageButton?: boolean;
}

const CampaignCard = ({ campaign, onClick, showManageButton = false }: CampaignCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline: string | undefined) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      car: 'bg-blue-500',
      education: 'bg-green-500',
      business: 'bg-purple-500',
      medical: 'bg-red-500',
      emergency: 'bg-orange-500',
      housing: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const progress = calculateProgress(campaign.current_amount, campaign.target_amount);
  const daysLeft = getDaysLeft(campaign.deadline);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
            <Badge 
              variant="secondary" 
              className={`mt-2 text-white ${getCategoryBadgeColor(campaign.category)}`}
            >
              {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
            </Badge>
          </div>
          {showManageButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open manage dialog
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Campaign Image */}
        {campaign.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={campaign.image_url} 
              alt={campaign.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {formatCurrency(campaign.current_amount)}
            </span>
            <span className="text-muted-foreground">
              {formatCurrency(campaign.target_amount)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {progress.toFixed(1)}% funded
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>{formatCurrency(campaign.target_amount)} goal</span>
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {daysLeft === 0 ? 'Ends today' : `${daysLeft} days left`}
              </span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        {campaign.status !== 'active' && (
          <Badge 
            variant={campaign.status === 'completed' ? 'default' : 'destructive'}
            className="mt-2 text-xs"
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;