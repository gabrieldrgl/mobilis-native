import React, { createContext, useContext, useState } from 'react';

// Defina um tipo para o usuário
type User = {
  name: string;
  // Adicione outros campos necessários
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};