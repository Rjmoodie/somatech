import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";

const LearningResources = () => {
  const contentResources = [
    {
      title: "The Complete Guide to Business Valuation",
      type: "Guide",
      description: "Learn the fundamentals of valuing any business with our comprehensive guide."
    },
    {
      title: "Financial Modeling Templates",
      type: "Templates",
      description: "Ready-to-use Excel templates for financial projections and analysis."
    },
    {
      title: "Investment Due Diligence Checklist",
      type: "Checklist",
      description: "Essential items to review before making any investment decision."
    }
  ];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Learning Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentResources.map((resource, index) => (
            <div key={index} className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer border border-border/30">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">{resource.type}</Badge>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-2">{resource.title}</h4>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningResources;