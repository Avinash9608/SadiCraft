
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
  updateUserPlan: (plan: 'silver' | 'gold' | 'platinum', paymentId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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
            
            // Check if subscription is active
            const now = Timestamp.now();
            const isActive = sub && sub.isActive && (sub.expiryDate === null || (sub.expiryDate && sub.expiryDate > now));
            
            // If subscription has expired, update it in DB (this could also be a daily cloud function)
            if (sub && sub.isActive && !isActive) {
                console.log("Subscription expired, updating status.");
                updateDoc(userDocRef, { 'subscription.isActive': false });
            }

            setIsPremium(isActive);
            setSubscription(sub);
            setFeatures(data.features as Features);

          } else {
             // This case handles a logged-in user who doesn't have a DB entry yet.
             // This can happen if registration is interrupted.
            console.log("User document not found, creating one for:", firebaseUser.uid);
            // Default data structures are now created on registration page.
            // If we reach here, something went wrong, but we can try to recover.
          }
          setLoading(false);
          clearTimeout(loadingTimeout);
        }, (error) => {
          console.error("Error with Firestore snapshot:", error);
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
  }, []); // Empty dependency array ensures this runs only once.

  const updateUserPlan = useCallback(async (plan: 'silver' | 'gold' | 'platinum', paymentId: string) => {
    if (user && db) {
      const userDocRef = doc(db, "users", user.uid);
      
      let newSubscription: SubscriptionData;
      let newFeatures: Partial<Features>;

      const now = new Date();
      const startDate = Timestamp.fromDate(now);
      let expiryDate: Timestamp | null = Timestamp.fromDate(new Date(now.setFullYear(now.getFullYear() + 1)));

      // Common features for all premium plans
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
        newSubscription = { plan, startDate, expiryDate, isActive: true, paymentId };
        newFeatures = { ...basePremiumFeatures };
      } else if (plan === 'gold') {
        newSubscription = { plan, startDate, expiryDate, isActive: true, paymentId };
        newFeatures = { ...basePremiumFeatures, videoProfile: true, whatsAppAlerts: true, astroReports: 5 };
      } else if (plan === 'platinum') {
        newSubscription = { plan, startDate, expiryDate: null, isActive: true, paymentId };
        newFeatures = { 
            ...basePremiumFeatures, 
            videoProfile: true, 
            whatsAppAlerts: true, 
            astroReports: 10,
            relationshipManager: true, // This might need a date check on the client
            // Boosts would be handled by a backend function, but we can set the first one
            remainingBoosts: 1
        };
      } else {
        return; // Invalid plan
      }

      await updateDoc(userDocRef, {
        subscription: newSubscription,
        features: newFeatures
      });
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
