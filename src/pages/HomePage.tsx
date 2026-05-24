import React, { useState } from 'react';
import { useSecretTap } from '@/hooks/useSecretTap';



interface HomePageProps {
  onRestoreWallet: () => void;
  onCreateNewWallet: () => void;
  onUsePasskey: () => void;
  prfAvailable: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  onRestoreWallet,
  onCreateNewWallet,
  onUsePasskey,
  prfAvailable,
}) => {
  const [showMnemonicFlow, setShowMnemonicFlow] = useState(false);
  const { handleTap: handleLogoTap } = useSecretTap(5, 2000, false, () => setShowMnemonicFlow(v => !v));

  return (
    <div className="h-full w-full flex flex-col bg-white relative overflow-hidden">
      {/* Background layer - extends behind all safe areas */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          top: 'calc(-1 * env(safe-area-inset-top, 0px))',
          bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
          left: 'calc(-1 * env(safe-area-inset-left, 0px))',
          right: 'calc(-1 * env(safe-area-inset-right, 0px))'
        }}
      />
      {/* Animated background effects - extends behind safe areas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
        top: 'calc(-1 * env(safe-area-inset-top, 0px))',
        bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
        left: 'calc(-1 * env(safe-area-inset-left, 0px))',
        right: 'calc(-1 * env(safe-area-inset-right, 0px))'
      }}>
        {/* Central glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
          <div className="absolute inset-0 bg-gradient-radial from-spark-primary/25 via-spark-primary/8 to-transparent blur-3xl animate-glow-pulse" />
        </div>

        {/* Accent orbs */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-radial from-spark-primary/15 to-transparent blur-2xl" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-radial from-spark-electric/10 to-transparent blur-2xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Content - with safe area padding */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 relative z-10"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >

        {/* Logo */}
        <div className="mb-10 relative">
         
          {/* Icon container */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <img
              src="/assets/ZapCart_Logo.png"
              alt="ZapCart"
              className="w-full h-full invert-0 brightness-0 object-contain"
              onClick={handleLogoTap}
            />
            
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-6xl font-bold text-center mb-2 tracking-tight">
          <span className="text-gradient-primary">
            ZapCart
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-gray-700 text-sm font-display text-center mb-12">
          Powered by Breez SDK
        </p>

        {/* CTA Buttons */}
        <div className="w-full max-w-xs space-y-4 min-h-[11rem]">
          {prfAvailable && !showMnemonicFlow ? (
            <>
              {/* Primary: Use Passkey (default when PRF available) */}
              <button
                onClick={onUsePasskey}
                data-testid="create-wallet-passkey-button"
                className="button w-full py-4 text-base tracking-wider"
              >
                Use Passkey
              </button>

              <button
                onClick={() => setShowMnemonicFlow(true)}
                className="text-gray-700 text-xs hover:text-spark-surface transition-colors w-full text-center py-2"
              >
                Use Recovery Phrase Instead
              </button>
            </>
          ) : (
            <>
              {/* Mnemonic flow */}
              <button
                onClick={onCreateNewWallet}
                data-testid="create-wallet-button"
                className="button w-full py-4 text-base tracking-wider"
              >
                Get Started
              </button>

              <button
                onClick={onRestoreWallet}
                data-testid="restore-wallet-button"
                className="button-secondary w-full py-4 rounded-xl font-display font-semibold text-sm tracking-wide"
              >
                Restore from Backup
              </button>

              {/* Toggle back to passkey if PRF available */}
              {prfAvailable && (
                <button
                  onClick={() => setShowMnemonicFlow(false)}
                  className="text-gray-700 text-xs hover:text-gray-900 transition-colors w-full text-center py-2"
                >
                  Use Passkey Instead
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
