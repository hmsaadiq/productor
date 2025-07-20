// FRONTEND CONTEXT PROVIDER: This file defines the ConfigContext for global state management in the React frontend.
// It provides user authentication state and cake configuration state to all components in the app.
//
// Design Patterns: Uses the React Context pattern (for global state), Provider pattern, and custom hook pattern (useConfig).
// Data Structures: Uses TypeScript interfaces for type safety, React state (useState), and context objects.
// Security: Handles authentication state (user), but does not store sensitive data directly. Relies on Firebase Auth for security.

// Import React and hooks for context, state, and effect management.
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Import the User type from Firebase Auth for type safety.
import { User } from 'firebase/auth';
// Import the function to subscribe to Firebase Auth state changes.
import { subscribeToAuthChanges } from '../utils/firebase';

// Define the shape of the cake configuration object.
interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
  state: string;
}

interface CakeConfig {
  // New: Product type (cake, cookies, muffins)
  productType: 'cake' | 'cookies' | 'muffins';
  // Cake-specific fields
  size?: string;
  layers?: number;
  flavor?: string;
  addons?: string[];
  text?: string;
  shape?: 'circle' | 'heart';
  // Box product fields
  boxSize?: 4 | 6 | 12;
  boxFlavors?: string[];
  // Common fields
  price: number;
  // Delivery details (collected on delivery page)
  deliveryDetails: DeliveryDetails;
}

// Define the shape of the context value provided to consumers.
interface ConfigContextType {
  user: User | null; // Currently authenticated user, or null if not signed in.
  setUser: (user: User | null) => void; // Function to update the user state.
  config: CakeConfig; // Current cake configuration.
  setConfig: (config: CakeConfig) => void; // Function to update the cake configuration.
  resetConfig: () => void; // Function to reset the configuration to defaults.
}

// Default cake configuration (used for initialization and reset).
const defaultConfig: CakeConfig = {
  productType: 'cake', // Default to cake
  size: '',
  layers: 1,
  flavor: '',
  addons: [],
  text: '',
  shape: 'circle', // Default shape
  boxSize: undefined,
  boxFlavors: [],
  price: 0,
  deliveryDetails: {
    name: '',
    address: '',
    phone: '',
    state: '',
  },
};

// Create the React context for configuration and user state.
// The context is undefined by default to enforce usage within a provider.
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Provider component that supplies user and config state to all children.
export function ConfigProvider({ children }: { children: ReactNode }) {
  // State for the currently authenticated user.
  const [user, setUser] = useState<User | null>(null);
  // State for the current cake configuration.
  const [config, setConfig] = useState<CakeConfig>(defaultConfig);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes when the component mounts.
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user); // Update user state when auth state changes.
    });

    // Cleanup subscription on unmount to prevent memory leaks.
    return () => unsubscribe();
  }, []);

  // Reset the cake configuration to the default values.
  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  // Provide the user, config, and updater functions to all children via context.
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

// Custom hook for consuming the ConfigContext in functional components.
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    // Enforce that the hook is used within a ConfigProvider.
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
} 