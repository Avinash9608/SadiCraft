
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean; // Placeholder for subscription status
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Placeholder for premium status. In a real app, this would be fetched from a database.
  const [isPremium, setIsPremium] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // TODO: Replace this with actual database check for user's subscription
      if (firebaseUser) {
        // For demonstration, let's assume a specific user is premium
        if (firebaseUser.email === 'premium@example.com') {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
