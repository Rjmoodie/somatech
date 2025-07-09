import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Target, Users, DollarSign, Calendar, Zap } from "lucide-react";

interface CampaignProjectionInputFormProps {
  targetAmount: string;
  setTargetAmount: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  averageDonation: string;
  setAverageDonation: (value: string) => void;
  donationFrequency: number[];
  setDonationFrequency: (value: number[]) => void;
  networkSize: string;
  setNetworkSize: (value: string) => void;
  participationRate: number[];
  setParticipationRate: (value: number[]) => void;
  onCalculate: () => void;
}

const CampaignProjectionInputForm = ({
  targetAmount,
  setTargetAmount,
  timeframe,
  setTimeframe,
  averageDonation,
  setAverageDonation,
  donationFrequency,
  setDonationFrequency,
  networkSize,
  setNetworkSize,
  participationRate,
  setParticipationRate,
  onCalculate
}: CampaignProjectionInputFormProps) => {
  const canCalculate = targetAmount && timeframe && averageDonation && networkSize;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Campaign Projection Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target-amount" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Target Amount ($)
          </Label>
          <Input
            id="target-amount"
            type="number"
            placeholder="10000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeframe" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Campaign Duration (weeks)
          </Label>
          <Input
            id="timeframe"
            type="number"
            placeholder="12"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avg-donation" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Average Donation ($)
          </Label>
          <Input
            id="avg-donation"
            type="number"
            placeholder="25"
            value={averageDonation}
            onChange={(e) => setAverageDonation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="network-size" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Network Size (potential donors)
          </Label>
          <Input
            id="network-size"
            type="number"
            placeholder="100"
            value={networkSize}
            onChange={(e) => setNetworkSize(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Donation Frequency (per week): {donationFrequency[0]}x
          </Label>
          <Slider
            value={donationFrequency}
            onValueChange={setDonationFrequency}
            max={5}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0.1x</span>
            <span>5x</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participation Rate: {participationRate[0]}%
          </Label>
          <Slider
            value={participationRate}
            onValueChange={setParticipationRate}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1%</span>
            <span>100%</span>
          </div>
        </div>

        <Button 
          onClick={onCalculate} 
          disabled={!canCalculate}
          className="w-full"
        >
          Calculate Projection
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignProjectionInputForm;