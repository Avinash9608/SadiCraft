
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, updateDoc, Timestamp, setDoc } from 'firebase/firestore';

export type Plan = 'free' | 'silver' | 'gold' | 'platinum';

export interface SubscriptionData {
  plan: Plan;
  expiry: Timestamp | null;
  isActive: boolean;
  paymentId?: string;
}

export interface UnlockedFeatures {
  traditionalTemplates: boolean;
  adFree: boolean;
  videoProfile: boolean;
  modernDownload: boolean;
  traditionalDownload: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  subscription: SubscriptionData | null;
  unlockedFeatures: UnlockedFeatures | null;
  updateSubscription: (data: Partial<SubscriptionData>) => Promise<void>;
  updateUnlockedFeatures: (data: Partial<UnlockedFeatures>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [unlockedFeatures, setUnlockedFeatures] = useState<UnlockedFeatures | null>(null);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubFromDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sub = data.subscription as SubscriptionData;

            // Check if subscription is active
            const now = Timestamp.now();
            const isActive = sub && sub.isActive && (sub.expiry === null || sub.expiry > now);

            setIsPremium(isActive);
            setSubscription(sub);
            setUnlockedFeatures(data.unlockedFeatures as UnlockedFeatures);
          } else {
            // This case handles users who registered before Firestore documents were created.
            // Create a default document for them.
            setDoc(userDocRef, {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              subscription: { plan: "free", expiry: null, isActive: false },
              unlockedFeatures: {
                traditionalTemplates: false, adFree: false, videoProfile: false,
                modernDownload: false, traditionalDownload: false
              }
            });
          }
          setLoading(false);
        }, (error) => {
            console.error("Error listening to user document:", error);
            setLoading(false);
        });
        
        return () => unsubFromDoc();

      } else {
        // User is logged out
        setIsPremium(false);
        setSubscription(null);
        setUnlockedFeatures(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateSubscription = useCallback(async (data: Partial<SubscriptionData>) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { subscription: { ...subscription, ...data } });
    }
  }, [user, subscription]);

  const updateUnlockedFeatures = useCallback(async (data: Partial<UnlockedFeatures>) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { unlockedFeatures: { ...unlockedFeatures, ...data } });
    }
  }, [user, unlockedFeatures]);

  const value = {
    user,
    loading,
    isPremium,
    subscription,
    unlockedFeatures,
    updateSubscription,
    updateUnlockedFeatures,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
