import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, Clock } from "lucide-react";
import { NewsItem } from "./mockData";

interface LatestNewsProps {
  news: NewsItem[];
}

const LatestNews = ({ news }: LatestNewsProps) => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Newspaper className="h-5 w-5 text-blue-600" />
          <span>Latest Financial News</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.summary}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                    <span className="font-medium">{item.source}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestNews;