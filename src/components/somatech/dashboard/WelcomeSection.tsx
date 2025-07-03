import { Card, CardContent } from "@/components/ui/card";

const WelcomeSection = () => {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to SomaTech
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SomaTech provides professional-grade financial analysis tools designed for entrepreneurs, 
            investors, and business professionals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;