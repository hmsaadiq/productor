// FRONTEND AUTHENTICATION MODAL COMPONENT: This file defines the LoginModal component for user authentication in the React frontend.
// It provides a modal dialog for users to sign in with Google using Firebase Auth.
//
// Design Patterns: Uses the Modal/Dialog pattern (via Headless UI), Context pattern for user state, and custom hook pattern for context access.
// Data Structures: Uses React state (useState), props, and context objects.
// Security: Handles authentication securely via Firebase Auth, and disables UI during loading to prevent duplicate requests.

// Import React and useState for component logic and state management.
import React, { useState } from 'react';
// Import Dialog from Headless UI for accessible modal dialogs.
import { Dialog } from '@headlessui/react';
// Import signInWithGoogle utility to handle Google sign-in via Firebase Auth.
import { signInWithGoogle } from '../utils/firebase';
// Import useConfig hook to update user state in context after sign-in.
import { useConfig } from '../context/ConfigContext';

// Define the props for the LoginModal component.
interface LoginModalProps {
  isOpen: boolean; // Whether the modal is open.
  onClose: () => void; // Function to close the modal.
}

// LoginModal component displays a modal for Google sign-in.
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Get setUser function from context to update user state after sign-in.
  const { setUser } = useConfig();
  // Local state for error messages.
  const [error, setError] = useState<string | null>(null);
  // Local state for loading indicator.
  const [isLoading, setIsLoading] = useState(false);

  // Handle Google sign-in button click.
  const handleGoogleSignIn = async () => {
    try {
      setError(null); // Clear previous errors.
      setIsLoading(true); // Show loading indicator.
      const user = await signInWithGoogle(); // Sign in with Google via Firebase Auth.
      setUser(user); // Update user state in context.
      onClose(); // Close the modal on success.
    } catch (error) {
      console.error('Error signing in with Google:', error); // Log error.
      setError('Failed to sign in with Google. Please try again.'); // Show error message.
    } finally {
      setIsLoading(false); // Hide loading indicator.
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        {/* Overlay for modal background */}
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-sm w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Sign in to continue
          </Dialog.Title>

          {/* Show error message if present */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                {/* Google logo icon */}
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Google
              </>
            )}
          </button>

          {/* Cancel button to close modal */}
          <button
            onClick={onClose}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
} 