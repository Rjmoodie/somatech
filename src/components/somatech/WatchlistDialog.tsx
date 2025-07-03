import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StockData, DCFScenarios, InvestmentThesis } from "./types";
import { calculateDCF } from "./utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string;
  stockData: StockData | null;
  dcfScenarios: DCFScenarios;
  investmentThesis: InvestmentThesis;
}

const WatchlistDialog = ({ open, onOpenChange, ticker, stockData, dcfScenarios, investmentThesis }: WatchlistDialogProps) => {
  const [selectedScenario, setSelectedScenario] = useState<'low' | 'base' | 'high'>('base');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const saveToWatchlist = async () => {
    if (!stockData) {
      toast.error('No stock data available');
      return;
    }

    setSaving(true);
    try {
      const dcfResult = calculateDCF(dcfScenarios[selectedScenario], stockData);
      
      // Combine investment thesis into notes
      const thesisNotes = [];
      if (investmentThesis.moat.trim()) {
        thesisNotes.push(`Economic Moat: ${investmentThesis.moat.trim()}`);
      }
      if (investmentThesis.risks.trim()) {
        thesisNotes.push(`Key Risks: ${investmentThesis.risks.trim()}`);
      }
      if (investmentThesis.opportunities.trim()) {
        thesisNotes.push(`Growth Opportunities: ${investmentThesis.opportunities.trim()}`);
      }
      if (notes.trim()) {
        thesisNotes.push(`Additional Notes: ${notes.trim()}`);
      }
      
      const combinedNotes = thesisNotes.join('\n\n');
      
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ticker: stockData.symbol,
          company_name: stockData.companyName || `${stockData.symbol} Corporation`,
          current_price: stockData.price,
          dcf_scenario: selectedScenario,
          dcf_intrinsic_value: parseFloat(dcfResult.intrinsicValue.toString()),
          dcf_upside_percentage: dcfResult.upside,
          recommendation: stockData.recommendation,
          score: stockData.score,
          market_cap: stockData.marketCap,
          pe_ratio: stockData.pe,
          notes: combinedNotes || null
        });

      if (error) throw error;

      toast.success(`${ticker} saved to watchlist with ${selectedScenario} case scenario`);
      onOpenChange(false);
      setNotes('');
      setSelectedScenario('base');
    } catch (error) {
      console.error('Error saving to watchlist:', error);
      toast.error('Failed to save to watchlist');
    } finally {
      setSaving(false);
    }
  };

  const getDCFPreview = (scenario: 'low' | 'base' | 'high') => {
    if (!stockData) return null;
    return calculateDCF(dcfScenarios[scenario], stockData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save {ticker} to Watchlist</DialogTitle>
          <DialogDescription>
            Choose which DCF scenario you want to track for {ticker}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Select DCF Scenario</Label>
            <RadioGroup
              value={selectedScenario}
              onValueChange={(value) => setSelectedScenario(value as 'low' | 'base' | 'high')}
              className="mt-3"
            >
              {(['low', 'base', 'high'] as const).map((scenario) => {
                const dcfPreview = getDCFPreview(scenario);
                return (
                  <div key={scenario} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={scenario} id={scenario} />
                    <div className="flex-1">
                      <Label htmlFor={scenario} className="font-medium capitalize cursor-pointer">
                        {scenario} Case
                      </Label>
                      {dcfPreview && (
                        <div className="text-sm text-muted-foreground mt-1">
                          DCF: ${dcfPreview.intrinsicValue} • 
                          <span className={dcfPreview.upside > 0 ? 'text-green-600' : 'text-red-600'}>
                            {dcfPreview.upside > 0 ? ' +' : ' '}{dcfPreview.upside.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Investment thesis will be automatically included from your analysis
            </p>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={saveToWatchlist}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save to Watchlist'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WatchlistDialog;