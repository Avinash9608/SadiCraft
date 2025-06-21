
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

// Corresponds to the detailed feature list
export interface Features {
  unlimitedViews: boolean;
  contactAccess: boolean;
  videoProfile: boolean;
  adFree: boolean;
  priorityListing: boolean;
  advancedFilters: boolean;
  verifiedBadge: boolean;
  allTemplates: boolean;
  whatsAppAlerts: boolean;
  astroReports: number;
  remainingBoosts: number;
  relationshipManager: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscription: SubscriptionData | null;
  features: Features | null;
  updateUserPlan: (plan: Plan, paymentId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Default features for a free user, used for initialization and resets.
const defaultFeatures: Features = {
    unlimitedViews: false,
    contactAccess: false,
    videoProfile: false,
    adFree: false,
    priorityListing: false,
    advancedFilters: false,
    verifiedBadge: false,
    allTemplates: false,
    whatsAppAlerts: false,
    astroReports: 0,
    remainingBoosts: 0,
    relationshipManager: false,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [features, setFeatures] = useState<Features | null>(null);

  useEffect(() => {
    if (!db || !auth) {
      console.warn("Firebase not configured. Auth features disabled.");
      setLoading(false);
      return;
    }
    
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("AuthContext: Loading timed out after 10 seconds. Forcing UI to render.");
        setLoading(false);
      }
    }, 10000);

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
                console.log("Subscription expired for user:", firebaseUser.uid, "Updating status.");
                updateDoc(userDocRef, { 
                    'subscription.isActive': false,
                    'features': defaultFeatures
                });
            }

            setIsPremium(isActive);
            setSubscription(sub);
            setFeatures(data.features as Features);
          }
          setLoading(false);
          clearTimeout(loadingTimeout);
        }, (error) => {
          console.error("AuthContext: Firestore snapshot error:", error.code, error.message, error);
          setLoading(false);
          clearTimeout(loadingTimeout);
        });
      } else {
        setUser(null);
        setIsPremium(false);
        setSubscription(null);
        setFeatures(null);
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
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);

    try {
        let newSubscription: SubscriptionData;
        let newFeatures: Features = { ...defaultFeatures }; 

        const now = new Date();
        const startDate = Timestamp.fromDate(now);
        let expiryDate: Timestamp | null = Timestamp.fromDate(
          new Date(new Date().setFullYear(now.getFullYear() + 1))
        );

        const basePremiumFeatures = {
          unlimitedViews: true,
          contactAccess: true,
          adFree: true,
          priorityListing: true,
          advancedFilters: true,
          verifiedBadge: true,
          allTemplates: true,
        };

        if (plan === 'silver') {
          newFeatures = { ...newFeatures, ...basePremiumFeatures };
        } else if (plan === 'gold') {
          newFeatures = {
            ...newFeatures,
            ...basePremiumFeatures,
            videoProfile: true,
            whatsAppAlerts: true,
            astroReports: 5,
          };
        } else if (plan === 'platinum') {
          expiryDate = null;
          newFeatures = {
            ...newFeatures,
            ...basePremiumFeatures,
            videoProfile: true,
            whatsAppAlerts: true,
            astroReports: 10,
            relationshipManager: true,
            remainingBoosts: 1, 
          };
        }
        
        newSubscription = { plan, startDate, expiryDate, isActive: plan !== 'free', paymentId };
        
        await updateDoc(userDocRef, {
            subscription: newSubscription,
            features: newFeatures,
        });

    } catch (error) {
        console.error("Error updating user plan:", error);
    }
  }, [user]);

  const value = {
    user,
    loading,
    isPremium,
    subscription,
    features,
    updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
