
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Check local storage first for premium status set by payment flow
        const premiumStatus = localStorage.getItem('isPremium');
        if (premiumStatus === 'true') {
          setIsPremium(true);
        } else if (firebaseUser.email === 'premium@example.com') {
          // Fallback for easy premium user testing
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } else {
        // Not logged in, not premium
        setIsPremium(false);
        // Clean up local storage on logout
        localStorage.removeItem('isPremium');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Also listen to storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isPremium') {
        setIsPremium(event.newValue === 'true');
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
