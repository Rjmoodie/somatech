import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  time_published: string;
  source: string;
}

interface LatestNewsProps {
  news: NewsItem[];
}

const LatestNews = ({ news }: LatestNewsProps) => {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Latest Business News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer border border-border/30">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium hover:text-primary transition-colors">{item.title}</h4>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.time_published).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestNews;