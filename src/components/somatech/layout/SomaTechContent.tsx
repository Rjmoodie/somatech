import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart } from 'lucide-react';
import Footer from '@/components/somatech/Footer';
import { useError } from '@/components/somatech/ErrorProvider';

interface SomaTechContentProps {
  activeModule: string;
  children: React.ReactNode;
}

const SomaTechContent: React.FC<SomaTechContentProps> = ({
  activeModule,
  children
}) => {
  const { reportError } = useError();

  const renderPlaceholder = (title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            This advanced financial tool is currently being developed.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const handleError = (error: Error, context: string) => {
    reportError(error, context);
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Something went wrong loading this module. Please try again.
          </p>
          <Button 
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      {children}
      <Footer 
        onPrivacyClick={() => {}} 
        onTermsClick={() => {}} 
      />
    </div>
  );
};

export default SomaTechContent; 