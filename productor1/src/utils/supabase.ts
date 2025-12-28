// FRONTEND SUPABASE UTILITY FILE: This file initializes Supabase and provides authentication and database utilities for the React frontend.
// It handles user sign-in, sign-out, and authentication state changes, and exports the Supabase client instance.
//
// Design Patterns: Uses the Singleton pattern for Supabase client instance, Factory pattern for service creation, and Observer pattern for auth state changes.
// Data Structures: Uses objects for config, User type for auth, and callback functions for listeners.
// Security: Handles authentication securely via Supabase Auth, does not expose sensitive credentials, and uses environment variables for secrets in production.

import { createClient, User } from '@supabase/supabase-js';

// Supabase configuration (should use environment variables in production for security).
// Get these from your Supabase project settings: https://app.supabase.com/project/_/settings/api
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

// Initialize Supabase client (Singleton pattern).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign in with Google using Supabase Auth.
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }

    // Wait for the session to be established
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('Sign-in successful:', session.user.email);
      return session.user;
    }
    
    // If no session yet, return the user from the auth state
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return user;
    }

    throw new Error('Sign-in initiated but session not established');
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out the current user.
export const signOut = async () => {
  try {
    console.log('Starting sign-out process...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    console.log('Sign-out successful');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Subscribe to authentication state changes (Observer pattern).
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state listener...');
  
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log('Auth state changed:', session?.user ? `User ${session.user.email} is signed in` : 'No user signed in');
    callback(session?.user ?? null);
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// Export the Supabase client instance (Singleton).
export default supabase;

