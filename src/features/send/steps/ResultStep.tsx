import React from 'react';
import { PrimaryButton, ErrorMessageBox } from '../../../components/ui';
import { CloseIcon } from '../../../components/Icons';

export interface ResultStepProps {
  result: 'success' | 'failure';
  error: string | null;
  onClose: () => void;
  /** Operation type to customize messaging (default: 'payment') */
  operationType?: 'payment' | 'auth';
}

const ResultStep: React.FC<ResultStepProps> = ({ result, error, onClose, operationType = 'payment' }) => {
  const isSuccess = result === 'success';
  
  const getTitle = () => {
    if (operationType === 'auth') {
      return isSuccess ? 'Authenticated!' : 'Authentication Failed';
    }
    return isSuccess ? 'Payment Sent!' : 'Payment Failed';
  };

  const getSuccessDescription = () => {
    if (operationType === 'auth') {
      return 'You have successfully authenticated with the service.';
    }
    return 'Your payment has been successfully sent to the recipient.';
  };

  const getDefaultErrorMessage = () => {
    if (operationType === 'auth') {
      return 'There was an error during authentication. Please try again.';
    }
    return 'There was an error processing your payment. Please try again.';
  };

  if (!isSuccess) {
    // Auth failure: use ErrorMessageBox card style
    if (operationType === 'auth') {
      return (
        <div className="space-y-5">
          <ErrorMessageBox
            title={getTitle()}
            error={error || getDefaultErrorMessage()}
          />
          <PrimaryButton onClick={onClose} className="w-full">
            Close
          </PrimaryButton>
        </div>
      );
    }

    // Payment failure: circular error icon with glow
   return (
  <div className="flex flex-col items-center justify-center py-4" data-testid="payment-failure">
    <div className="relative mb-6">
      {/* Error glow */}
      <div className="absolute inset-0 w-20 h-20 rounded-full blur-xl bg-gray-200" />

      {/* Error icon */}
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 border-2 border-black">
        <CloseIcon className="w-10 h-10 text-black" />
      </div>
    </div>

    <h3 className="font-display text-2xl font-bold mb-2 text-black">
      {getTitle()}
    </h3>

    <p className="text-gray-700 text-center max-w-xs mb-8">
      {error || getDefaultErrorMessage()}
    </p>

    <PrimaryButton onClick={onClose} className="min-w-[200px]">
      Close
    </PrimaryButton>
  </div>
);
  }

  // Success: show icon, title, description, and done button
  return (
  <div className="flex flex-col items-center justify-center py-4" data-testid={isSuccess ? 'payment-success' : 'payment-failure'}>
    {/* Result icon */}
    <div className="relative mb-6">
      {/* Glow effect */}
      <div className="absolute -inset-3 rounded-full bg-gray-200 blur-xl" />

      {/* Logo with sparkles */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <img
          src="/assets/ZapCart_Logo.png"
          alt="ZapCart"
          className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.15)]"
        />
      </div>
    </div>

    {/* Title */}
    <h3 className="font-display text-2xl font-bold mb-2 text-black">
      {getTitle()}
    </h3>

    {/* Description */}
    <p className="text-gray-700 text-center max-w-xs mb-8">
      {getSuccessDescription()}
    </p>

    {/* Action button */}
    <PrimaryButton onClick={onClose} className="min-w-[200px]">
      Done
    </PrimaryButton>
  </div>
);
};

export default ResultStep;
