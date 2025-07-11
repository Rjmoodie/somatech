import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Clock, Star } from "lucide-react";

const LearningResources = () => {
  const resources = [
    {
      title: "Financial Statement Analysis",
      description: "Master the art of reading and analyzing financial statements",
      duration: "30 min",
      rating: 4.8,
      category: "Fundamentals"
    },
    {
      title: "DCF Modeling Best Practices", 
      description: "Advanced techniques for discounted cash flow valuation",
      duration: "45 min",
      rating: 4.9,
      category: "Valuation"
    },
    {
      title: "Portfolio Risk Management",
      description: "Strategies for managing portfolio risk and diversification",
      duration: "25 min", 
      rating: 4.7,
      category: "Risk Management"
    }
  ];

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span>Learning Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {resource.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{resource.rating}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{resource.duration}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningResources;