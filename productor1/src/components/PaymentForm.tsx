import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { PaystackButton } from 'react-paystack';

interface PaymentFormProps {
  amount: number; // in NGN
  userEmail: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const publicKey = 'pk_test_477448a1c5f87a401a2636456565511a8bd6acdb';

export default function PaymentForm({ amount, userEmail, onSuccess, onError }: PaymentFormProps) {
  const { config } = useConfig();

  const paystackProps = {
    email: userEmail,
    amount: amount * 100, // Paystack expects kobo
    publicKey,
    text: 'Pay Now',
    onSuccess: () => onSuccess(),
    onClose: () => {},
    onError: (error: any) => onError(error),
    metadata: {
      custom_fields: [
        {
          display_name: 'Cake Config',
          variable_name: 'cake_config',
          value: JSON.stringify(config),
        },
      ],
    },
  };

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