
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

type Plan = 'silver' | 'gold' | 'platinum';

// Define a reusable type for subscription data, making it available for other components
export interface SubscriptionData {
  plan: Plan;
  purchaseDate: string;
  expiry: string | null;
  paymentId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscriptionPlan: Plan | null;
  updateSubscription: (data: SubscriptionData | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<Plan | null>(null);

  // Centralized function to check subscription status from a string
  const checkSubscription = useCallback((subDataString: string | null) => {
    if (subDataString) {
      try {
        const subData: SubscriptionData = JSON.parse(subDataString);
        const now = new Date();
        
        if (subData.expiry === 'lifetime' || (subData.expiry && new Date(subData.expiry) > now)) {
          setIsPremium(true);
          setSubscriptionPlan(subData.plan);
        } else {
          // Subscription expired, clear it
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
       // No subscription data found
       setIsPremium(false);
       setSubscriptionPlan(null);
    }
  }, []);

  // New function to allow other components to update the subscription state
  const updateSubscription = useCallback((data: SubscriptionData | null) => {
    if (data) {
      const subDataString = JSON.stringify(data);
      localStorage.setItem('shaadiCraftSubscription', subDataString);
      checkSubscription(subDataString); // Immediately update the app state
    } else {
      localStorage.removeItem('shaadiCraftSubscription');
      checkSubscription(null); // Clear subscription state on explicit null
    }
  }, [checkSubscription]);

  // Main effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // On load or login, check the stored subscription
        checkSubscription(localStorage.getItem('shaadiCraftSubscription'));
      } else {
        // On logout, clear all subscription info
        updateSubscription(null);
      }
    });

    return () => unsubscribe();
  }, [checkSubscription, updateSubscription]);

  const value = {
    user,
    loading,
    isPremium,
    subscriptionPlan,
    updateSubscription, // Expose the update function through the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
