import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../../services/api';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const response = await authAPI.verify();
        setAdmin(response.data.admin);
      } catch (error) {
        localStorage.removeItem('adminToken');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('adminToken', response.data.token);
    setAdmin(response.data.admin);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout
      }}
    >
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
