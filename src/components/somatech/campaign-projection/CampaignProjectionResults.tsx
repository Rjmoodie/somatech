import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Users, Calendar, Percent } from "lucide-react";

interface CampaignProjectionResultsProps {
  result: {
    targetAmount: number;
    projectedAmount: number;
    expectedDonors: number;
    totalDonations: number;
    weeklyTarget: number;
    weeklyProjected: number;
    optimisticAmount: number;
    pessimisticAmount: number;
    weeksToComplete: number;
    successProbability: number;
    onTrack: boolean;
  };
}

const CampaignProjectionResults = ({ result }: CampaignProjectionResultsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Projection Results
          </CardTitle>
          <Badge variant={result.onTrack ? "default" : "destructive"}>
            {result.onTrack ? "On Track" : "Needs Adjustment"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Target Amount
            </div>
            <div className="text-2xl font-bold">{formatCurrency(result.targetAmount)}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Projected Amount
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(result.projectedAmount)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Expected Donors
            </div>
            <div className="text-lg font-semibold">{result.expectedDonors}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Total Donations
            </div>
            <div className="text-lg font-semibold">{result.totalDonations}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Weekly Target
            </div>
            <div className="text-lg font-semibold">{formatCurrency(result.weeklyTarget)}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Weekly Projected
            </div>
            <div className="text-lg font-semibold text-primary">{formatCurrency(result.weeklyProjected)}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Scenarios</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-primary">
                <TrendingUp className="h-4 w-4" />
                Optimistic
              </div>
              <div className="text-lg font-semibold text-primary">
                {formatCurrency(result.optimisticAmount)}
              </div>
            </div>
            <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <TrendingDown className="h-4 w-4" />
                Pessimistic
              </div>
              <div className="text-lg font-semibold text-destructive">
                {formatCurrency(result.pessimisticAmount)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Weeks to Complete
            </div>
            <div className="text-lg font-semibold">{result.weeksToComplete}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" />
              Success Probability
            </div>
            <div className="text-lg font-semibold">{result.successProbability}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProjectionResults;