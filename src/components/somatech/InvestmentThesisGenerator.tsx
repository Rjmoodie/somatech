import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InvestmentThesis } from "./types";

interface InvestmentThesisGeneratorProps {
  ticker: string;
  investmentThesis: InvestmentThesis;
  setInvestmentThesis: (thesis: InvestmentThesis) => void;
}

const InvestmentThesisGenerator = ({ ticker, investmentThesis, setInvestmentThesis }: InvestmentThesisGeneratorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker} Investment Thesis Generator</CardTitle>
        <CardDescription>Document your {ticker} investment analysis and thesis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{ticker} Economic Moat & Competitive Advantages</Label>
          <textarea
            className="w-full min-h-20 p-3 border rounded-lg resize-none text-black"
            placeholder={`Describe ${ticker}'s competitive moats, brand strength, network effects, switching costs...`}
            value={investmentThesis.moat}
            onChange={(e) => setInvestmentThesis({ ...investmentThesis, moat: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>{ticker} Key Risks & Concerns</Label>
          <textarea
            className="w-full min-h-20 p-3 border rounded-lg resize-none text-black"
            placeholder={`${ticker} regulatory risks, competition, balance sheet concerns, market risks...`}
            value={investmentThesis.risks}
            onChange={(e) => setInvestmentThesis({ ...investmentThesis, risks: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>{ticker} Growth Opportunities</Label>
          <textarea
            className="w-full min-h-20 p-3 border rounded-lg resize-none text-black"
            placeholder={`${ticker} market expansion, product innovation, M&A opportunities, margin improvement...`}
            value={investmentThesis.opportunities}
            onChange={(e) => setInvestmentThesis({ ...investmentThesis, opportunities: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentThesisGenerator;