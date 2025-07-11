import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, DollarSign } from "lucide-react";

const BusinessPulse = () => {
  const metrics = [
    { icon: Building2, label: "Active Businesses", value: "1,247", change: "+12%" },
    { icon: Users, label: "New Users", value: "156", change: "+8%" },
    { icon: DollarSign, label: "Revenue", value: "$2.4M", change: "+15%" },
    { icon: TrendingUp, label: "Growth Rate", value: "24%", change: "+3%" }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span>Business Pulse</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <metric.icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{metric.label}</p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <span className="text-xs text-green-600 font-medium">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BusinessPulse;