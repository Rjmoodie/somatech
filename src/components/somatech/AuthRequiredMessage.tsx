import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User, ArrowRight } from "lucide-react";

interface AuthRequiredMessageProps {
  onAuthRequired: () => void;
  title?: string;
  description?: string;
}

const AuthRequiredMessage = ({ 
  onAuthRequired, 
  title = "Sign In Required",
  description = "Please sign in or create an account to save your analysis and access advanced features."
}: AuthRequiredMessageProps) => {
  return (
    <Card className="w-full max-w-md mx-auto border-2 border-dashed border-primary/20">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Button 
            onClick={onAuthRequired} 
            className="w-full btn-apple group"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In / Sign Up
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Free account • No credit card required
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthRequiredMessage;