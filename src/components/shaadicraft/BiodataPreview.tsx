"use client";

import React, { useEffect, useState } from 'react';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import ModernLayout from './layouts/ModernLayout';
import TraditionalLayout from './layouts/TraditionalLayout';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface BiodataPreviewProps {
  data: BiodataFormValues;
  isDirty: boolean; // To help determine initial loading state
}

const BiodataPreview: React.FC<BiodataPreviewProps> = ({ data, isDirty }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Consider loaded if data is present and form is dirty (user has interacted)
    // or if specific essential fields like fullName are populated.
    // This is a simple heuristic; more complex logic might be needed for true "loaded" state.
    if (isDirty || data.fullName) {
      setIsLoading(false);
    } else {
       // If not dirty and no name, keep loading for a bit to avoid flicker on first load
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [data, isDirty]);


  if (isLoading && !isDirty) { // Show skeleton only on initial load and if form is not yet interacted with
    return (
      <div className="p-4 md:p-8 bg-muted/30 rounded-lg shadow-lg h-full min-h-[80vh] animate-pulse">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-32 w-32 rounded-full mx-auto mb-8" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Render the selected layout
  const layoutComponent = data.layout === 'modern' 
    ? <ModernLayout data={data} /> 
    : <TraditionalLayout data={data} />;

  return (
    <div className="bg-muted/30 p-1 md:p-2 rounded-lg shadow-inner h-full">
      {/* The key ensures re-render on layout change if needed for complex transitions,
          but typically conditional rendering is enough. */}
      {React.cloneElement(layoutComponent, { key: data.layout })}
    </div>
  );
};

export default BiodataPreview;
