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
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user data and token exist in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwt_token');
    
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setIsAuthenticated(true);

      // Only redirect if trying to access admin pages without admin role
      if (parsedUser.role !== 'admin' && pathname?.startsWith('/admin')) {
        router.push('/produits');
      }
    } else {
      // Only redirect to login if trying to access protected routes
      const protectedRoutes = ['/admin', '/produits', '/commandes', '/rendez-vous'];
      if (protectedRoutes.some(route => pathname?.startsWith(route))) {
        router.push('/connexion');
      }
    }
    setIsLoading(false);
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
      // Clear user data and token from localStorage on logout
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      setToken(null);
      router.push('/connexion');
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, isAuthenticated, token }}>
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