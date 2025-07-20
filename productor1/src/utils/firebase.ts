// FRONTEND FIREBASE UTILITY FILE: This file initializes Firebase and provides authentication and Firestore utilities for the React frontend.
// It handles user sign-in, sign-out, and authentication state changes, and exports the Firestore database instance.
//
// Design Patterns: Uses the Singleton pattern for Firebase app instance, Factory pattern for service creation, and Observer pattern for auth state changes.
// Data Structures: Uses objects for config, User type for auth, and callback functions for listeners.
// Security: Handles authentication securely via Firebase Auth, does not expose sensitive credentials, and uses environment variables for secrets in production.

// Import Firebase app initialization and services.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, AuthError } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object (should use environment variables in production for security).
const firebaseConfig = {
  apiKey: "AIzaSyBVWPVzakX-tX3N-hBwTCfpHOXuKqnuLfM",
  authDomain: "productor1back.firebaseapp.com",
  projectId: "productor1back",
  storageBucket: "productor1back.firebasestorage.app",
  messagingSenderId: "431744462826",
  appId: "1:431744462826:web:d63645800a524609528c93"
};

// Initialize Firebase app (Singleton pattern).
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Auth and Firestore).
export const auth = getAuth(app);
export const db = getFirestore(app);

// Create Google Auth provider for sign-in.
const googleProvider = new GoogleAuthProvider();
// Add scopes for Google Sign-in (profile and email).
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Sign in with Google using a popup window.
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in process...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', result.user.email);
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing in with Google:', {
      code: authError.code,
      message: authError.message
    });
    throw error;
  }
};

// Sign out the current user.
export const signOut = async () => {
  try {
    console.log('Starting sign-out process...');
    await auth.signOut();
    console.log('Sign-out successful');
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing out:', {
      code: authError.code,
      message: authError.message
    });
    throw error;
  }
};

// Subscribe to authentication state changes (Observer pattern).
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state listener...');
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? `User ${user.email} is signed in` : 'No user signed in');
    callback(user);
  });
};

// Export the Firebase app instance (Singleton).
export default app; 