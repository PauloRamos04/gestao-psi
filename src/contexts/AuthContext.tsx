import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { LoginRequest, LoginResponse } from '../types';
import apiService from '../services/api';

interface UserInfo {
  userId: number;
  username: string;
  clinicaId: number;
  psicologId: number;
  tipoUser: string;
  clinicaNome: string;
  psicologoNome: string;
  tituloSite: string;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response: LoginResponse = await apiService.login(credentials);
      const { token: newToken, userId, username, clinicaId, psicologId, tipoUser, clinicaNome, psicologoNome, tituloSite } = response;

      const userInfo: UserInfo = {
        userId,
        username,
        clinicaId,
        psicologId,
        tipoUser,
        clinicaNome,
        psicologoNome,
        tituloSite
      };

      setToken(newToken);
      setUser(userInfo);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
