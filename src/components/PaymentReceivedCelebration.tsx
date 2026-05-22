import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface PaymentReceivedCelebrationProps {
  amount: number;
  onClose: () => void;
}

const PaymentReceivedCelebration: React.FC<PaymentReceivedCelebrationProps> = ({ amount, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const formatAmount = (sats: number) => {
    return sats.toLocaleString('en-US').replace(/,/g, '\u2009');
  };

  return createPortal(
  <div
    className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    onClick={() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }}
  >
    {/* Backdrop with blur */}
    <div className="absolute inset-0 bg-white/90 backdrop-blur-md" />

    {/* Radiating glow rings */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-64 h-64 rounded-full bg-gray-500/10 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute w-48 h-48 rounded-full bg-gray-500/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
      <div className="absolute w-32 h-32 rounded-full bg-gray-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
    </div>

    {/* Main content */}
    <div
      className={`relative z-10 flex flex-col items-center transform transition-all duration-700 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'
      }`}
    >

      {/* Title */}
      <h2 className="text-2xl font-display font-bold text-black mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Payment Received
      </h2>

      {/* Amount with brand glow */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 blur-xl bg-gray-500/40 rounded-2xl" />
        <div className="relative pl-14 pr-10 py-5 rounded-2xl bg-white border border-gray-300 text-center">
          <span className="relative text-5xl font-mono font-bold text-black">
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-0.5 text-3xl text-gray-700 opacity-70">₿</span>
            {formatAmount(amount)}
          </span>
        </div>
      </div>

      {/* Tap to dismiss hint */}
      <p className="mt-10 text-gray-500 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        Tap anywhere to dismiss
      </p>
    </div>
  </div>,
  document.body
);
};

export default PaymentReceivedCelebration;
