import React, { createContext, useState, useEffect, useContext } from 'react';
import { api, saveToken, deleteToken } from '../services/api';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  user: any;
  isLoading: boolean;
  login: (email: string, mot_de_passe: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          const response = await api.get('/utilisateurs/moi');
          setUser(response.data);
        }
      } catch (e) {
        console.log('Error restoring session');
      }
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const login = async (email: string, mot_de_passe: string) => {
    const response = await api.post('/auth/login', { email, mot_de_passe });
    const { access_token, role, utilisateur_id } = response.data;
    
    await saveToken(access_token);
    setUser({ id: utilisateur_id, role, email });
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
