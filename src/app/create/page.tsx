
"use client";

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { Spinner } from '@/components/Spinner';
import MatrimonialPlatform from '@/components/shaadicraft/MatrimonialPlatform';

export default function PlatformPage() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  // Auth Guard
  useEffect(() => {
    if (authContext && !authContext.loading && !authContext.user) {
      router.push('/login');
    }
  }, [authContext, router]);

  if (authContext?.loading || !authContext?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return <MatrimonialPlatform />;
}
