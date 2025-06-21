
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot, updateDoc, Timestamp, setDoc, getDoc } from 'firebase/firestore';

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
            const isActive = sub && sub.isActive && (sub.expiry === null || (sub.expiry && sub.expiry > now));
            
            setIsPremium(isActive);
            setSubscription(sub);
            setUnlockedFeatures(data.unlockedFeatures as UnlockedFeatures);
          } else {
            const defaultSub: SubscriptionData = { plan: 'free', expiry: null, isActive: false };
            const defaultFeatures: UnlockedFeatures = {
                traditionalTemplates: false,
                adFree: false,
                videoProfile: false,
                modernDownload: false,
                traditionalDownload: false,
            };
            setDoc(userDocRef, {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              subscription: defaultSub,
              unlockedFeatures: defaultFeatures
            });
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
        setUnlockedFeatures(null);
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
  }, []); // Changed dependency array to []

  const updateSubscription = useCallback(async (data: Partial<SubscriptionData>) => {
    if (user && db) {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data().subscription || {};
        await updateDoc(userDocRef, {
          subscription: { ...existingData, ...data }
        });
      }
    }
  }, [user]);

  const updateUnlockedFeatures = useCallback(async (data: Partial<UnlockedFeatures>) => {
    if (user && db) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const existingData = docSnap.data().unlockedFeatures || {};
            await updateDoc(userDocRef, {
                unlockedFeatures: { ...existingData, ...data }
            });
        }
    }
  }, [user]);

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
