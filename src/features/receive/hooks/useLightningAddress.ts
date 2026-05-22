import { useCallback, useState } from 'react';
import type { LightningAddressInfo } from '@breeztech/breez-sdk-spark';
import { useWallet } from '../../../contexts/WalletContext';
import { generateRandomName } from '../../../utils/randomName';
import { logger, LogCategory } from '@/services/logger';
import { formatError } from '@/utils/formatError';

// --- Cache helpers ---
const CACHE_KEY = 'receive_cache_lightning_address';

function readCachedAddress(): LightningAddressInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as LightningAddressInfo) : null;
  } catch {
    return null;
  }
}

function writeCachedAddress(info: LightningAddressInfo): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(info));
  } catch { /* ignore */ }
}

export interface UseLightningAddress {
  address: LightningAddressInfo | null;
  isLoading: boolean;
  isEditing: boolean;
  editValue: string;
  error: string | null;
  isSupported: boolean;
  supportMessage: string | null;
  load: () => Promise<void>;
  beginEdit: (currentAddress?: LightningAddressInfo | null) => void;
  cancelEdit: () => void;
  setEditValue: (v: string) => void;
  save: () => Promise<void>;
  reset: () => void;
}

const UNSUPPORTED_MESSAGE = 'Lightning addresses are not available in this environment.';

export const useLightningAddress = (): UseLightningAddress => {
  const wallet = useWallet();

  // Seed from cache immediately so it shows without any network call
  const [address, setAddress] = useState<LightningAddressInfo | null>(() => readCachedAddress());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const markUnsupported = useCallback(() => {
    setIsSupported(false);
    setSupportMessage(UNSUPPORTED_MESSAGE);
    setIsEditing(false);
    setEditValue('');
    setError(null);
  }, []);

  const extractUsername = (value: string): string => {
    if (!value) return '';
    return value.includes('@') ? value.split('@')[0] : value;
  };

  const load = useCallback(async () => {
    if (!isSupported) {
      if (!supportMessage) setSupportMessage(UNSUPPORTED_MESSAGE);
      return;
    }

    // If offline, the cached value seeded in useState is already showing — skip the network call
    if (!navigator.onLine) {
      if (!address) {
        setError('You\'re offline. Connect to the internet to load your Lightning address.');
      }
      return;
    }

    setIsLoading(true);
    try {
      let addr = await wallet.getLightningAddress();
      if (!addr) {
        const baseName = generateRandomName();
        for (let attempt = 0; attempt < 3; attempt++) {
          const suffix = attempt === 0 ? '' : String(Math.floor(1000 + Math.random() * 9000));
          const username = baseName + suffix;
          const isAvailable = await wallet.checkLightningAddressAvailable({ username });
          if (isAvailable) {
            await wallet.registerLightningAddress({ username, description: `Pay to ${username}@breez.tips` });
            addr = await wallet.getLightningAddress();
            break;
          }
        }
      }
      const resolved = addr ?? null;
      setAddress(resolved);
      if (resolved) writeCachedAddress(resolved);
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to load Lightning address', {
        error: formatError(err),
      });
      if (err instanceof Error && /lnurl server is not configured/i.test(err.message)) {
        markUnsupported();
      } else {
        // Don't wipe the cached address on error — keep showing it
        setError(`Failed to refresh Lightning address: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [wallet, isSupported, markUnsupported, supportMessage, address]);

  const beginEdit = useCallback((currentAddress?: LightningAddressInfo | null) => {
    if (!isSupported) return;
    const addrStr = currentAddress?.lightningAddress ?? address?.lightningAddress ?? '';
    const initial = extractUsername(addrStr);
    setEditValue(initial);
    setIsEditing(true);
    setError(null);
  }, [address, isSupported]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue('');
    setError(null);
  }, []);

  const save = useCallback(async () => {
    if (!isSupported) {
      markUnsupported();
      return;
    }

    if (!navigator.onLine) {
      setError('You\'re offline. Connect to the internet to save your Lightning address.');
      return;
    }

    const username = extractUsername(editValue.trim());
    if (!username) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isAvailable = await wallet.checkLightningAddressAvailable({ username });
      if (!isAvailable) {
        setError('This username is not available');
        setIsLoading(false);
        return;
      }

      await wallet.registerLightningAddress({ username, description: `Pay to ${username}@breez.tips` });
      const actualInfo = await wallet.getLightningAddress();
      const resolved = actualInfo ?? null;
      setAddress(resolved);
      if (resolved) writeCachedAddress(resolved);
      setIsEditing(false);
      setEditValue('');
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to save Lightning address', {
        error: formatError(err),
      });
      if (err instanceof Error && /lnurl server is not configured/i.test(err.message)) {
        markUnsupported();
      } else {
        setError(`Failed to save Lightning address: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [editValue, wallet, isSupported, markUnsupported]);

  const reset = useCallback(() => {
    setIsEditing(false);
    setEditValue('');
    setError(null);
    // Don't reset address — keep cached value visible
  }, []);

  return {
    address,
    isLoading,
    isEditing,
    editValue,
    error,
    isSupported,
    supportMessage,
    load,
    beginEdit,
    cancelEdit,
    setEditValue,
    save,
    reset,
  };
};