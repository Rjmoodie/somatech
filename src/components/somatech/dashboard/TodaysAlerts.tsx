import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";

const TodaysAlerts = () => {
  const alerts = [
    {
      type: "info",
      icon: Info,
      title: "Market Update",
      message: "S&P 500 reaches new high",
      time: "10:30 AM"
    },
    {
      type: "success", 
      icon: CheckCircle,
      title: "Analysis Complete",
      message: "Portfolio review finished",
      time: "9:15 AM"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Volatility Alert",
      message: "VIX spike detected",
      time: "8:45 AM"
    }
  ];

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "info":
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Today's Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAlertStyles(alert.type)}`}>
              <alert.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {alert.title}
                </p>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodaysAlerts;