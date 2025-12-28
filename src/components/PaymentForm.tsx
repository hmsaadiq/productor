// FRONTEND PAYMENT FORM COMPONENT: This file defines the PaymentForm component for the React frontend.
// It provides the UI for users to pay for their cake order using Paystack.
//
// Design Patterns: Uses the React Component pattern, controlled component pattern for props, and third-party integration pattern (Paystack).
// Data Structures: Uses props for configuration, and objects for payment metadata.
// Security: Relies on Paystack for secure payment processing, disables UI during payment, and does not handle sensitive card data directly.

// Import React for component creation.
import React from 'react';
// Import useConfig hook to access current cake configuration from context.
import { useConfig } from '../context/ConfigContext';
// Import PaystackButton from react-paystack for payment integration.
import { PaystackButton } from 'react-paystack';

// Define the props for the PaymentForm component.
interface PaymentFormProps {
  amount: number; // Payment amount in NGN (Nigerian Naira).
  userEmail: string; // User's email address for payment receipt.
  onSuccess: () => void; // Callback for successful payment.
  onError: (error: Error) => void; // Callback for payment error.
}

// Paystack public key for test environment (should be replaced with live key in production).
const publicKey = 'pk_test_477448a1c5f87a401a2636456565511a8bd6acdb';

// PaymentForm component provides the payment UI and logic.
export default function PaymentForm({ amount, userEmail, onSuccess, onError }: PaymentFormProps) {
  // Get current cake configuration from context.
  const { config } = useConfig();

  // Define Paystack button properties and metadata.
  const paystackProps = {
    email: userEmail,
    amount: amount * 100, // Paystack expects amount in kobo (1 NGN = 100 kobo).
    publicKey,
    text: 'Pay Now',
    onSuccess: () => onSuccess(), // Call parent callback on success.
    onClose: () => {}, // No-op for modal close.
    onError: (error: any) => onError(error), // Call parent callback on error.
    metadata: {
      custom_fields: [
        {
          display_name: 'Cake Config',
          variable_name: 'cake_config',
          value: JSON.stringify(config), // Attach cake config as metadata.
        },
      ],
    },
  };

  // Render the payment form UI.
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pay with Card or Bank
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <PaystackButton {...paystackProps} className="w-full btn btn-primary" />
        </div>
      </div>
    </div>
  );
} 