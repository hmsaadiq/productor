import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../utils/firebase';

interface CakeConfig {
  size: string;
  layers: number;
  flavor: string;
  addons: string[];
  text: string;
  price: number;
}

interface ConfigContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  config: CakeConfig;
  setConfig: (config: CakeConfig) => void;
  resetConfig: () => void;
}

const defaultConfig: CakeConfig = {
  size: '',
  layers: 1,
  flavor: '',
  addons: [],
  text: '',
  price: 0,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<CakeConfig>(defaultConfig);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        user,
        setUser,
        config,
        setConfig,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
} 