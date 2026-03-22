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
// Uses the OAuth redirect flow — after calling this the browser navigates to Google,
// so there is no session to read back immediately. The session is established on return.
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) {
    console.error('Error initiating Google sign-in:', error);
    throw error;
  }
  // Browser is now redirecting to Google — nothing more to do here.
};

// Sign out the current user.
// Uses scope:'local' so it only clears the browser session without needing a valid
// server token — prevents the 403 that occurs when the session has already expired.
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    // AuthSessionMissingError means the session was already gone — treat as success.
    if (error && error.name !== 'AuthSessionMissingError') {
      throw error;
    }
  } catch (error: any) {
    if (error?.name !== 'AuthSessionMissingError') {
      console.error('Error signing out:', error);
      throw error;
    }
    // Session was already cleared — silently succeed.
  }
};

// Subscribe to authentication state changes (Observer pattern).
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state listener...');
  
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      // Create or update profile
      supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        updated_at: new Date().toISOString()
      }).then();
    }
    callback(session?.user ?? null);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log('Auth state changed:', session?.user ? `User ${session.user.email} is signed in` : 'No user signed in');
    
    if (session?.user) {
      // Create or update profile
      supabase.from('profiles').upsert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        updated_at: new Date().toISOString()
      }).then();
    }
    
    callback(session?.user ?? null);
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// Export the Supabase client instance (Singleton).
export default supabase;

