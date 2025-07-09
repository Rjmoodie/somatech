import { useState } from "react";
import CampaignProjectionInputForm from "./campaign-projection/CampaignProjectionInputForm";
import CampaignProjectionResults from "./campaign-projection/CampaignProjectionResults";
import CampaignProjectionVisualization from "./campaign-projection/CampaignProjectionVisualization";

const CampaignProjection = () => {
  const [targetAmount, setTargetAmount] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [averageDonation, setAverageDonation] = useState("");
  const [donationFrequency, setDonationFrequency] = useState([1]); // per week
  const [networkSize, setNetworkSize] = useState("");
  const [participationRate, setParticipationRate] = useState([20]); // percentage
  const [projectionResult, setProjectionResult] = useState<any>(null);

  const calculateProjection = () => {
    if (!targetAmount || !timeframe || !averageDonation || !networkSize) return;

    const target = parseFloat(targetAmount);
    const weeks = parseInt(timeframe);
    const avgDonation = parseFloat(averageDonation);
    const frequency = donationFrequency[0];
    const network = parseInt(networkSize);
    const participation = participationRate[0] / 100;

    // Calculate expected donors
    const expectedDonors = Math.floor(network * participation);
    
    // Calculate total donations over timeframe
    const totalDonations = expectedDonors * frequency * weeks;
    const projectedAmount = totalDonations * avgDonation;
    
    // Calculate weekly targets
    const weeklyTarget = target / weeks;
    const weeklyProjected = projectedAmount / weeks;
    
    // Calculate scenarios
    const optimisticAmount = projectedAmount * 1.5; // 50% more
    const pessimisticAmount = projectedAmount * 0.6; // 40% less
    
    // Calculate completion time
    const weeksToComplete = projectedAmount >= target ? weeks : (target / weeklyProjected);
    
    // Success probability
    const successProbability = Math.min((projectedAmount / target) * 100, 100);

    setProjectionResult({
      targetAmount: target,
      projectedAmount: Math.round(projectedAmount),
      expectedDonors,
      totalDonations,
      weeklyTarget: Math.round(weeklyTarget),
      weeklyProjected: Math.round(weeklyProjected),
      optimisticAmount: Math.round(optimisticAmount),
      pessimisticAmount: Math.round(pessimisticAmount),
      weeksToComplete: Math.round(weeksToComplete * 100) / 100,
      successProbability: Math.round(successProbability * 100) / 100,
      onTrack: projectedAmount >= target
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CampaignProjectionInputForm
          targetAmount={targetAmount}
          setTargetAmount={setTargetAmount}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          averageDonation={averageDonation}
          setAverageDonation={setAverageDonation}
          donationFrequency={donationFrequency}
          setDonationFrequency={setDonationFrequency}
          networkSize={networkSize}
          setNetworkSize={setNetworkSize}
          participationRate={participationRate}
          setParticipationRate={setParticipationRate}
          onCalculate={calculateProjection}
        />

        {projectionResult && <CampaignProjectionResults result={projectionResult} />}
      </div>

      {projectionResult && (
        <CampaignProjectionVisualization
          targetAmount={targetAmount}
          timeframe={timeframe}
          averageDonation={averageDonation}
          donationFrequency={donationFrequency}
          networkSize={networkSize}
          participationRate={participationRate}
          projectionResult={projectionResult}
        />
      )}
    </div>
  );
};

export default CampaignProjection;