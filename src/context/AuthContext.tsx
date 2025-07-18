import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Admin, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Predefined admin credentials
const ADMIN_CREDENTIALS = [
  { email: 'admin1@ganesh.com', password: 'admin123', name: 'Rajesh Sharma', id: 'admin1' },
  { email: 'admin2@ganesh.com', password: 'admin123', name: 'Priya Patel', id: 'admin2' },
  { email: 'admin3@ganesh.com', password: 'admin123', name: 'Amit Kumar', id: 'admin3' },
  { email: 'admin4@ganesh.com', password: 'admin123', name: 'Sunita Joshi', id: 'admin4' },
  { email: 'admin5@ganesh.com', password: 'admin123', name: 'Vikram Singh', id: 'admin5' },
  { email: 'admin6@ganesh.com', password: 'admin123', name: 'Kavya Reddy', id: 'admin6' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Find admin by email
        const adminData = ADMIN_CREDENTIALS.find(admin => admin.email === user.email);
        if (adminData) {
          setCurrentAdmin({
            id: adminData.id,
            name: adminData.name,
            email: adminData.email,
          });
        }
      } else {
        setCurrentAdmin(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if credentials match our predefined admins
      const adminData = ADMIN_CREDENTIALS.find(
        admin => admin.email === email && admin.password === password
      );
      
      if (!adminData) {
        return false;
      }

      // For demo purposes, we'll simulate Firebase auth
      // In a real app, you'd use signInWithEmailAndPassword
      setCurrentAdmin({
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentAdmin(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    currentAdmin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};