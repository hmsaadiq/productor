import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, AuthError } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVWPVzakX-tX3N-hBwTCfpHOXuKqnuLfM",
  authDomain: "productor1back.firebaseapp.com",
  projectId: "productor1back",
  storageBucket: "productor1back.firebasestorage.app",
  messagingSenderId: "431744462826",
  appId: "1:431744462826:web:d63645800a524609528c93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Add scopes for Google Sign-in
googleProvider.addScope('profile');
googleProvider.addScope('email');

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

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state listener...');
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? `User ${user.email} is signed in` : 'No user signed in');
    callback(user);
  });
};

export default app; 