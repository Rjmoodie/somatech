import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";

interface ExportActionsProps {
  ticker: string;
}

const ExportActions = ({ ticker }: ExportActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Save {ticker} Analysis</CardTitle>
        <CardDescription>Save your {ticker} analysis or export as a report</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export {ticker} PDF Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save {ticker} to Portfolio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportActions;