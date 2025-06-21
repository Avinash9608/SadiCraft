
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

type Plan = 'silver' | 'gold' | 'platinum';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscriptionPlan: Plan | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        const subDataString = localStorage.getItem('shaadiCraftSubscription');
        if (subDataString) {
          try {
            const subData = JSON.parse(subDataString);
            const now = new Date();
            
            if (subData.expiry === 'lifetime' || (subData.expiry && new Date(subData.expiry) > now)) {
              setIsPremium(true);
              setSubscriptionPlan(subData.plan);
            } else {
              setIsPremium(false);
              setSubscriptionPlan(null);
              localStorage.removeItem('shaadiCraftSubscription'); 
            }
          } catch (e) {
            console.error("Failed to parse subscription data", e);
            setIsPremium(false);
            setSubscriptionPlan(null);
          }
        } else {
           setIsPremium(false);
           setSubscriptionPlan(null);
        }
      } else {
        setIsPremium(false);
        setSubscriptionPlan(null);
        localStorage.removeItem('shaadiCraftSubscription');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'shaadiCraftSubscription') {
         // When subscription data changes in another tab or after payment,
         // reload the page to ensure the context is re-initialized with fresh data.
         // This is a robust way to guarantee state consistency.
         window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    user,
    loading,
    isPremium,
    subscriptionPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
