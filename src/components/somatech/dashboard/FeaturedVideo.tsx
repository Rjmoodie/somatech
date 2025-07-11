import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Users } from "lucide-react";

const FeaturedVideo = () => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-blue-600" />
          <span>Featured Learning</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Advanced Financial Modeling Techniques
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Learn how to build sophisticated financial models for business valuation, 
              DCF analysis, and investment decision making. This comprehensive guide 
              covers best practices used by top investment professionals.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>45 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>2,847 views</span>
              </div>
            </div>
            <Button className="btn-apple">
              <Play className="mr-2 h-4 w-4" />
              Watch Now
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Play className="h-8 w-8 text-blue-600 ml-1" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Video Preview</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedVideo;