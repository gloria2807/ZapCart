import React, { useEffect, useState } from 'react';
import { WarningIcon, SpinnerIcon, EyeIcon, FingerprintIcon } from '../components/Icons';
import SlideInPage from '../components/layout/SlideInPage';
import { isPasskeyMode, getWallet } from '@/services/passkeyService';
import { logger, LogCategory } from '@/services/logger';

interface BackupPageProps {
  onBack: () => void;
}

const BackupPage: React.FC<BackupPageProps> = ({ onBack }) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPasskey = isPasskeyMode();

  useEffect(() => {
    if (!isPasskey) {
      setMnemonic(localStorage.getItem('walletMnemonic'));
    }
  }, [isPasskey]);

  const handleRevealPasskey = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const w = await getWallet();
      if (w.seed.type === 'mnemonic' && w.seed.mnemonic) {
        setMnemonic(w.seed.mnemonic);
        setIsRevealed(true);
      } else {
        setError('Could not derive recovery phrase');
      }
    } catch (e) {
      logger.error(LogCategory.AUTH, 'Failed to derive mnemonic from passkey', {
        error: e instanceof Error ? e.message : String(e),
      });
      setError(e instanceof Error ? e.message : 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!mnemonic) return;
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      logger.warn(LogCategory.UI, 'Failed to copy mnemonic to clipboard', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const handleHide = () => {
    setIsRevealed(false);
    if (isPasskey) {
      setMnemonic(null);
    }
  };

  const words = mnemonic ? mnemonic.split(' ') : [];

  return (
  <SlideInPage title="Backup" onClose={onBack} slideFrom="left">
    <div className="p-4 bg-white">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Passkey info card */}
        {isPasskey && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FingerprintIcon size="md" className="text-black" />
              </div>
              <div>
                <h4 className="font-medium text-black mb-1">Passkey Protected</h4>
                <p className="text-gray-500 text-sm">
                  Your recovery phrase is derived from your passkey. To restore on another device, use your passkey or the recovery phrase below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reveal button — passkey mode */}
        {isPasskey && !isRevealed && !mnemonic && (
          <button
            onClick={handleRevealPasskey}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              {isLoading ? (
                <SpinnerIcon size="xl" className="text-black" />
              ) : (
                <EyeIcon size="xl" className="text-black" />
              )}
            </div>
            <span className="font-display font-semibold text-black">
              {isLoading ? 'Authenticating...' : 'Tap to reveal phrase'}
            </span>
            <span className="text-sm text-gray-500">
              {isLoading ? 'Complete passkey authentication' : 'Requires passkey authentication'}
            </span>
          </button>
        )}

        {/* Reveal button — mnemonic mode */}
        {!isPasskey && !isRevealed && mnemonic && (
          <button
            onClick={() => setIsRevealed(true)}
            className="w-full bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-gray-400 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <EyeIcon size="xl" className="text-black" />
            </div>
            <span className="font-display font-semibold text-black">Tap to reveal phrase</span>
            <span className="text-sm text-gray-500">Make sure no one is watching</span>
          </button>
        )}

        {/* Error message (passkey only) */}
        {error && (
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center">
            <p className="text-black text-sm">{error}</p>
          </div>
        )}

        {/* Mnemonic word grid (shared) */}
        {isRevealed && mnemonic && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Recovery Phrase</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHide}
                  className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-black border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hide
                </button>
                <button
                  onClick={handleCopy}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all
                    ${copied
                      ? 'bg-gray-100 text-black border border-gray-300'
                      : 'bg-black text-white hover:bg-gray-800'
                    }
                  `}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
                >
                  <span className="text-gray-500 text-xs font-mono w-5 text-right">
                    {index + 1}.
                  </span>
                  <span className="text-black font-mono text-sm font-medium">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No backup found (mnemonic mode only) */}
        {!isPasskey && !mnemonic && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <WarningIcon size="xl" className="text-black" />
            </div>
            <h3 className="font-display font-semibold text-black mb-2">No Backup Found</h3>
            <p className="text-gray-500 text-sm">
              Could not find a recovery phrase for this wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  </SlideInPage>
);
};

export default BackupPage;
