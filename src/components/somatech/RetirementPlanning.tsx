import { useState } from "react";
import RetirementInputForm from "./retirement/RetirementInputForm";
import RetirementResults from "./retirement/RetirementResults";
import RetirementVisualization from "./retirement/RetirementVisualization";

const RetirementPlanning = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState([7]);
  const [retirementSpending, setRetirementSpending] = useState("");
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [otherIncome, setOtherIncome] = useState("");
  const [retirementResult, setRetirementResult] = useState<any>(null);

  const calculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentSavings || !monthlyContribution || !retirementSpending) return;

    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const lifeExp = parseInt(lifeExpectancy);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const returnRate = expectedReturn[0] / 100;
    const annualSpending = parseFloat(retirementSpending);
    const inflation = inflationRate[0] / 100;
    const otherAnnualIncome = parseFloat(otherIncome) || 0;

    const yearsToRetirement = retAge - age;
    const yearsInRetirement = lifeExp - retAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = returnRate / 12;

    // Future value at retirement
    const totalSavingsAtRetirement = savings * Math.pow(1 + returnRate, yearsToRetirement) +
      contribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

    // Adjust spending for inflation
    const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflation, yearsToRetirement);
    const netAnnualNeed = inflationAdjustedSpending - otherAnnualIncome;
    
    // Calculate how long funds will last
    let remainingFunds = totalSavingsAtRetirement;
    let yearsLasted = 0;
    for (let year = 0; year < yearsInRetirement; year++) {
      const yearlySpendingNeed = netAnnualNeed * Math.pow(1 + inflation, year);
      if (remainingFunds >= yearlySpendingNeed) {
        remainingFunds = remainingFunds * (1 + returnRate) - yearlySpendingNeed;
        yearsLasted++;
      } else {
        break;
      }
    }

    // Calculate total needed at retirement for full coverage
    const totalNeeded = netAnnualNeed * yearsInRetirement * 1.05; // 5% buffer
    const surplusOrShortfall = totalSavingsAtRetirement - totalNeeded;
    
    // Required return rate to meet goal
    const requiredReturn = surplusOrShortfall < 0 ? 
      Math.pow((totalNeeded - savings) / (contribution * 12 * yearsToRetirement), 1/yearsToRetirement) - 1 : 
      returnRate;

    setRetirementResult({
      totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
      yearsToRetirement,
      yearsInRetirement,
      inflationAdjustedSpending: Math.round(inflationAdjustedSpending),
      annualIncomeGap: Math.round(Math.max(0, netAnnualNeed)),
      surplusOrShortfall: Math.round(surplusOrShortfall),
      requiredReturnToMeetGoal: Math.round(requiredReturn * 100 * 100) / 100,
      yearsWillLast: yearsLasted,
      onTrack: surplusOrShortfall >= 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RetirementInputForm
          currentAge={currentAge}
          setCurrentAge={setCurrentAge}
          retirementAge={retirementAge}
          setRetirementAge={setRetirementAge}
          lifeExpectancy={lifeExpectancy}
          setLifeExpectancy={setLifeExpectancy}
          currentSavings={currentSavings}
          setCurrentSavings={setCurrentSavings}
          monthlyContribution={monthlyContribution}
          setMonthlyContribution={setMonthlyContribution}
          expectedReturn={expectedReturn}
          setExpectedReturn={setExpectedReturn}
          retirementSpending={retirementSpending}
          setRetirementSpending={setRetirementSpending}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          otherIncome={otherIncome}
          setOtherIncome={setOtherIncome}
          onCalculate={calculateRetirement}
        />

        {retirementResult && <RetirementResults result={retirementResult} />}
      </div>

      {retirementResult && (
        <RetirementVisualization
          currentAge={currentAge}
          retirementAge={retirementAge}
          lifeExpectancy={lifeExpectancy}
          currentSavings={currentSavings}
          monthlyContribution={monthlyContribution}
          expectedReturn={expectedReturn}
          retirementSpending={retirementSpending}
          inflationRate={inflationRate}
        />
      )}
    </div>
  );
};

export default RetirementPlanning;