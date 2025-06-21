
"use client";

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import type { BiodataFormValues } from '@/lib/zod-schemas';
import ModernLayout from './layouts/ModernLayout';
import TraditionalLayout from './layouts/TraditionalLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthContext } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';

interface BiodataPreviewProps {
  data: BiodataFormValues;
  isDirty: boolean; 
}

const TraditionalLayoutLock: React.FC = () => (
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
    <Lock className="h-16 w-16 text-primary mb-4" />
    <h3 className="text-2xl font-bold text-primary-foreground mb-2 text-center">Unlock Traditional Layout</h3>
    <p className="text-center text-primary-foreground/80 mb-6 max-w-xs">
      Unlock this beautiful layout for a one-time payment of just ₹10, or upgrade to a subscription for full access.
    </p>
    <div className="flex flex-col gap-2 w-full max-w-xs">
       <Button asChild size="lg">
        <Link href="/checkout?action=unlock_traditional&return_to_layout=traditional">
          Pay ₹10 to Unlock
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href="/#pricing">
           <Star className="mr-2 h-4 w-4" />
           View Subscription Plans
        </Link>
      </Button>
    </div>
  </div>
);


const BiodataPreview: React.FC<BiodataPreviewProps> = ({ data, isDirty }) => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    if (isDirty || data.fullName) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [data, isDirty]);

  if (isLoading && !isDirty) {
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

  const isPremiumLayout = data.layout === 'traditional';
  const traditionalUnlocked = authContext?.unlockedFeatures?.traditionalTemplates ?? false;
  const showLock = isPremiumLayout && !authContext?.isPremium && !traditionalUnlocked;

  const layoutComponent = data.layout === 'modern' 
    ? <ModernLayout data={data} /> 
    : <TraditionalLayout data={data} />;

  return (
    <div className="relative bg-muted/30 p-1 md:p-2 rounded-lg shadow-inner h-full">
      {showLock && <TraditionalLayoutLock />}
      <div className={showLock ? 'blur-md pointer-events-none' : ''}>
         {React.cloneElement(layoutComponent, { key: data.layout })}
      </div>
    </div>
  );
};

export default BiodataPreview;
