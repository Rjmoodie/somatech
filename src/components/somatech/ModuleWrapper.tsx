import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ModuleWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ModuleWrapper: React.FC<ModuleWrapperProps> = ({ 
  children, 
  fallback = <ModuleSkeleton /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      <div className="animate-fade-in">
        {children}
      </div>
    </Suspense>
  );
};

const ModuleSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ModuleWrapper;