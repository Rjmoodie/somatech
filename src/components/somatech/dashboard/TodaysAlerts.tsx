import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const TodaysAlerts = () => {
  const alerts = [
    { message: "Fed meeting minutes released", color: "bg-blue-500" },
    { message: "Tech earnings beat expectations", color: "bg-green-500" },
    { message: "Oil prices volatile", color: "bg-orange-500" }
  ];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Today's Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="text-sm p-2 bg-muted/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className={`w-2 h-2 ${alert.color} rounded-full mt-1.5 flex-shrink-0`}></div>
              <span className="text-muted-foreground">{alert.message}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodaysAlerts;