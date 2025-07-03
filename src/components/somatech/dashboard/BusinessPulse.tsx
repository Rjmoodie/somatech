import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

const BusinessPulse = () => {
  const pulseItems = [
    { label: "SMB Confidence", status: "High", color: "bg-green-600" },
    { label: "VC Funding", status: "Moderate", color: "bg-yellow-600" },
    { label: "Credit Access", status: "Good", color: "bg-green-600" }
  ];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Building2 className="h-4 w-4 mr-2" />
          Business Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pulseItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center p-2 bg-muted/20 rounded-lg">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <Badge variant="secondary" className={`${item.color} text-white`}>
              {item.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BusinessPulse;