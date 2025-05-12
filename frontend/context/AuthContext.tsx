'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  nom: string;
  email: string;
  tel: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user data exists in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);

      // Handle redirections based on user role and current path
      if (parsedUser.role === 'admin') {
        // If admin is on a non-admin page, redirect to admin dashboard
        if (!pathname?.startsWith('/admin')) {
          router.push('/admin/dashboard');
        }
      } else {
        // If regular user is on an admin page, redirect to produits page
        if (pathname?.startsWith('/admin')) {
          router.push('/produits');
        }
      }
    } else {
      // If no user is logged in and trying to access protected routes
      if (pathname?.startsWith('/admin') || pathname?.startsWith('/produits')) {
        router.push('/connexion');
      }
    }
  }, [pathname, router]);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);

    if (newUser) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Handle redirections after login
      if (newUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/produits');
      }
    } else {
      // Clear user data from localStorage on logout
      localStorage.removeItem('user');
      router.push('/connexion');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 