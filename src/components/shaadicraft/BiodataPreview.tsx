
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

const PremiumFeatureLock: React.FC = () => (
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
    <Lock className="h-16 w-16 text-primary mb-4" />
    <h3 className="text-2xl font-bold text-primary-foreground mb-2">Premium Layout</h3>
    <p className="text-center text-primary-foreground/80 mb-6 max-w-xs">
      This beautiful traditional layout is a premium feature. Upgrade your plan to use it and access all other benefits!
    </p>
    <Button asChild>
      <Link href="/checkout">
        <Star className="mr-2 h-4 w-4" />
        Upgrade Now
      </Link>
    </Button>
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
  const showLock = isPremiumLayout && !authContext?.isPremium;

  const layoutComponent = data.layout === 'modern' 
    ? <ModernLayout data={data} /> 
    : <TraditionalLayout data={data} />;

  return (
    <div className="relative bg-muted/30 p-1 md:p-2 rounded-lg shadow-inner h-full">
      {showLock && <PremiumFeatureLock />}
      <div className={showLock ? 'blur-md pointer-events-none' : ''}>
         {React.cloneElement(layoutComponent, { key: data.layout })}
      </div>
    </div>
  );
};

export default BiodataPreview;
