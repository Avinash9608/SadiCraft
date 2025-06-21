
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, updateDoc, Timestamp, setDoc, getDoc } from 'firebase/firestore';

export type Plan = 'free' | 'silver' | 'gold' | 'platinum';

export interface SubscriptionData {
  plan: Plan;
  startDate: Timestamp | null;
  expiryDate: Timestamp | null;
  isActive: boolean;
  paymentId?: string;
}

// Corresponds to the detailed feature list from the provided spec
export interface Features {
  unlimitedViews: boolean;
  unlimitedInterests: boolean;
  contactAccess: boolean;
  priorityListing: boolean;
  advancedFilters: boolean;
  adFree: boolean;
  verifiedBadge: boolean;
  allTemplates: boolean;
  videoProfile: boolean;
  whatsAppAlerts: boolean;
  astroReports: number;
  remainingBoosts: number;
  relationshipManager: boolean;
}

export interface Usage {
    profilesViewed: number;
    interestsSent: number;
    lastBoostUsed: Timestamp | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscription: SubscriptionData | null;
  features: Features | null;
  usage: Usage | null;
  updateUserPlan: (plan: Plan, paymentId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Central source of truth for features per plan, based on the provided spec
export const planFeatures: Record<Plan, Features> = {
  free: {
    unlimitedViews: false,
    unlimitedInterests: false,
    contactAccess: false,
    priorityListing: false,
    advancedFilters: false,
    adFree: false,
    verifiedBadge: false,
    allTemplates: false,
    videoProfile: false,
    whatsAppAlerts: false,
    astroReports: 0,
    remainingBoosts: 0,
    relationshipManager: false,
  },
  silver: {
    unlimitedViews: true,
    unlimitedInterests: true,
    contactAccess: true,
    priorityListing: false,
    advancedFilters: true,
    adFree: true,
    verifiedBadge: true,
    allTemplates: true,
    videoProfile: false,
    whatsAppAlerts: false,
    astroReports: 0,
    remainingBoosts: 0,
    relationshipManager: false,
  },
  gold: {
    unlimitedViews: true,
    unlimitedInterests: true,
    contactAccess: true,
    priorityListing: true,
    advancedFilters: true,
    adFree: true,
    verifiedBadge: true,
    allTemplates: true,
    videoProfile: true,
    whatsAppAlerts: true,
    astroReports: 5,
    remainingBoosts: 0,
    relationshipManager: false,
  },
  platinum: {
    unlimitedViews: true,
    unlimitedInterests: true,
    contactAccess: true,
    priorityListing: true,
    advancedFilters: true,
    adFree: true,
    verifiedBadge: true,
    allTemplates: true,
    videoProfile: true,
    whatsAppAlerts: true,
    astroReports: 10,
    remainingBoosts: 1, 
    relationshipManager: true,
  },
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [features, setFeatures] = useState<Features | null>(planFeatures.free);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    if (!db || !auth) {
      console.warn("Firebase not configured. Auth features disabled.");
      setLoading(false);
      return;
    }
    
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    let firestoreUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        firestoreUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sub = data.subscription as SubscriptionData;
            
            const now = Timestamp.now();
            let isActive = sub?.isActive && (sub.expiryDate === null || (sub.expiryDate && sub.expiryDate > now));
            
            if (sub?.isActive && !isActive) {
                updateDoc(userDocRef, { 
                    'subscription.isActive': false,
                    'features': planFeatures.free,
                }).catch(err => console.error("Failed to update expired subscription:", err));
                 setSubscription({ ...sub, isActive: false});
                 setFeatures(planFeatures.free);
                 setIsPremium(false);
            } else {
              setIsPremium(isActive);
              setSubscription(sub);
              setFeatures((data.features as Features) || planFeatures.free);
              setUsage((data.usage as Usage) || null);
            }

          } else {
            setIsPremium(false);
            setSubscription(null);
            setFeatures(planFeatures.free);
            setUsage(null);
          }
          setLoading(false);
          clearTimeout(loadingTimeout);
        }, (error) => {
          console.error(`AuthContext: Firestore snapshot error. Code: ${error.code}, Message: ${error.message}`, error);
          setLoading(false);
          clearTimeout(loadingTimeout);
        });
      } else {
        setUser(null);
        setIsPremium(false);
        setSubscription(null);
        setFeatures(null);
        setUsage(null);
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      authUnsubscribe();
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
    };
  }, []);

  const updateUserPlan = useCallback(async (plan: Plan, paymentId: string) => {
    if (!user || !db) throw new Error("User not authenticated or DB not available.");

    const userDocRef = doc(db, 'users', user.uid);

    try {
        const now = new Date();
        const startDate = Timestamp.fromDate(now);
        let expiryDate: Timestamp | null = null;
        
        if (plan === 'silver' || plan === 'gold') {
          expiryDate = Timestamp.fromDate(new Date(new Date().setFullYear(now.getFullYear() + 1)));
        }

        const newSubscription: SubscriptionData = { plan, startDate, expiryDate, isActive: plan !== 'free', paymentId };
        const newFeatures = planFeatures[plan]; 
        
        await setDoc(userDocRef, {
            subscription: newSubscription,
            features: newFeatures,
        }, { merge: true });

        // Optimistic update for instant UI feedback
        setSubscription(newSubscription);
        setFeatures(newFeatures);
        setIsPremium(newSubscription.isActive);

    } catch (error) {
        console.error("Error updating user plan:", error);
        throw error;
    }
  }, [user]);

  const value = {
    user,
    loading,
    isPremium,
    subscription,
    features,
    usage,
    updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
