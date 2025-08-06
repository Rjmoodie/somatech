import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NavigationTest = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Current Location:</h3>
          <div className="bg-muted p-3 rounded-lg text-sm font-mono">
            <div><strong>Pathname:</strong> {location.pathname}</div>
            <div><strong>Search:</strong> {location.search}</div>
            <div><strong>Hash:</strong> {location.hash}</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">URL Parameters:</h3>
          <div className="bg-muted p-3 rounded-lg text-sm">
            {Array.from(searchParams.entries()).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
            {Array.from(searchParams.entries()).length === 0 && (
              <div className="text-muted-foreground">No URL parameters</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Browser History:</h3>
          <div className="bg-muted p-3 rounded-lg text-sm">
            <div><strong>History Length:</strong> {window.history.length}</div>
            <div><strong>Can Go Back:</strong> {window.history.length > 1 ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => window.history.back()}
            disabled={window.history.length <= 1}
            variant="outline"
            size="sm"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => window.history.forward()}
            variant="outline"
            size="sm"
          >
            Go Forward
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationTest; 