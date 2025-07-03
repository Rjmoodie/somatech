import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RetirementResult {
  totalSavingsAtRetirement: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  inflationAdjustedSpending: number;
  annualIncomeGap: number;
  surplusOrShortfall: number;
  requiredReturnToMeetGoal: number;
  yearsWillLast: number;
  onTrack: boolean;
}

interface RetirementResultsProps {
  result: RetirementResult;
}

const RetirementResults = ({ result }: RetirementResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Retirement Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              ${result.totalSavingsAtRetirement.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Savings at Retirement</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Years to retirement:</span>
              <span className="font-semibold">{result.yearsToRetirement}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Years in retirement:</span>
              <span className="font-semibold">{result.yearsInRetirement}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Annual income gap:</span>
              <span className="font-semibold">${result.annualIncomeGap.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Funds will last:</span>
              <span className="font-semibold">{result.yearsWillLast} years</span>
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Surplus/Shortfall:</span>
              <span className={`font-bold ${result.surplusOrShortfall >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(result.surplusOrShortfall).toLocaleString()} 
                {result.surplusOrShortfall >= 0 ? ' surplus' : ' shortfall'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Required return to meet goal:</span>
              <span className="font-semibold">{result.requiredReturnToMeetGoal}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
            <span className="font-medium">On track:</span>
            <span className={`font-bold ${result.onTrack ? 'text-green-600' : 'text-red-600'}`}>
              {result.onTrack ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetirementResults;