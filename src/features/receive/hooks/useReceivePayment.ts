import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { logger, LogCategory } from '@/services/logger';
import { formatError } from '@/utils/formatError';
import type { PaymentMethod, ReceiveStep } from '../../../types/domain';

// --- Persistence helpers ---
const CACHE_KEYS = {
  spark: 'receive_cache_spark_address',
  bitcoin: 'receive_cache_bitcoin_address',
};

function readCache(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeCache(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

// --- Offline detection ---
function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return isOnline;
}

export interface UseReceivePaymentReturn {
  // State
  activeTab: PaymentMethod;
  currentStep: ReceiveStep;
  description: string;
  amount: string;
  error: string | null;
  isLoading: boolean;
  paymentData: string;
  feeSats: number;
  sparkAddress: string | null;
  bitcoinAddress: string | null;
  sparkLoading: boolean;
  bitcoinLoading: boolean;
  showAmountPanel: boolean;
  isOnline: boolean;
  // Actions
  setDescription: (desc: string) => void;
  setAmount: (amt: string) => void;
  setShowAmountPanel: (show: boolean) => void;
  handleTabChange: (tab: PaymentMethod, loadLightningAddress: () => void) => void;
  generateBolt11Invoice: () => Promise<void>;
  reset: () => void;
}

export function useReceivePayment(): UseReceivePaymentReturn {
  const wallet = useWallet();
  const isOnline = useIsOnline();

  const [activeTab, setActiveTab] = useState<PaymentMethod>('lightning');
  const [currentStep, setCurrentStep] = useState<ReceiveStep>('loading_limits');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<string>('');
  const [feeSats, setFeeSats] = useState<number>(0);

  // Initialise from cache so addresses show immediately (even offline)
  const [sparkAddress, setSparkAddress] = useState<string | null>(() => readCache(CACHE_KEYS.spark));
  const [bitcoinAddress, setBitcoinAddress] = useState<string | null>(() => readCache(CACHE_KEYS.bitcoin));
  const [sparkLoading, setSparkLoading] = useState<boolean>(false);
  const [bitcoinLoading, setBitcoinLoading] = useState<boolean>(false);
  const [showAmountPanel, setShowAmountPanel] = useState<boolean>(false);

  const reset = useCallback(() => {
    setCurrentStep('input');
    setDescription('');
    setAmount('');
    setError(null);
    setIsLoading(false);
    setPaymentData('');
    setFeeSats(0);
    // Don't clear addresses on reset — keep cached values visible
    setSparkLoading(false);
    setBitcoinLoading(false);
    setShowAmountPanel(false);
  }, []);

  const generateSparkAddress = useCallback(async () => {
    // Already have one (cached or fetched) — nothing to do
    if (sparkAddress) return;

    if (!isOnline) {
      // No cache, no network — surface a clear message
      setError('You\'re offline. Connect to the internet to generate a Spark address.');
      return;
    }

    if (sparkLoading) return;
    setSparkLoading(true);
    try {
      const receiveResponse = await wallet.receivePayment({
        paymentMethod: { type: 'sparkAddress' },
      });
      const addr = receiveResponse.paymentRequest;
      setSparkAddress(addr);
      writeCache(CACHE_KEYS.spark, addr);
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to generate Spark address', { error: formatError(err) });
      setError(`Failed to generate Spark address: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSparkLoading(false);
    }
  }, [wallet, sparkAddress, sparkLoading, isOnline]);

  const generateBitcoinAddress = useCallback(async () => {
    if (bitcoinAddress) return;

    if (!isOnline) {
      setError('You\'re offline. Connect to the internet to generate a Bitcoin address.');
      return;
    }

    if (bitcoinLoading) return;
    setBitcoinLoading(true);
    try {
      const receiveResponse = await wallet.receivePayment({
        paymentMethod: { type: 'bitcoinAddress' },
      });
      const addr = receiveResponse.paymentRequest;
      setBitcoinAddress(addr);
      writeCache(CACHE_KEYS.bitcoin, addr);
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to generate Bitcoin address', { error: formatError(err) });
      setError(`Failed to generate Bitcoin address: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setBitcoinLoading(false);
    }
  }, [wallet, bitcoinAddress, bitcoinLoading, isOnline]);

  const generateBolt11Invoice = useCallback(async () => {
    if (!isOnline) {
      setError('You\'re offline. A live connection is required to generate a Lightning invoice.');
      setShowAmountPanel(true);
      return;
    }

    logger.info(LogCategory.PAYMENT, 'Starting invoice generation', { amount });
    setError(null);
    setIsLoading(true);
    setCurrentStep('loading');

    if (showAmountPanel) {
      setShowAmountPanel(false);
    }

    try {
      const amountSats = parseInt(amount);
      if (isNaN(amountSats)) throw new Error('Invalid amount');

      logger.debug(LogCategory.PAYMENT, 'Calling wallet.receivePayment for bolt11 invoice', { amountSats });
      const receiveResponse = await wallet.receivePayment({
        paymentMethod: {
          type: 'bolt11Invoice',
          description,
          amountSats,
        },
      });
      logger.info(LogCategory.PAYMENT, 'Invoice generated successfully', {
        paymentRequestLength: receiveResponse.paymentRequest.length,
        fee: Number(receiveResponse.fee) || 0,
      });
      setPaymentData(receiveResponse.paymentRequest);
      setFeeSats(Number(receiveResponse.fee) || 0);
      setCurrentStep('qr');
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to generate invoice', { error: formatError(err) });
      setError(`Failed to generate invoice: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setCurrentStep('input');
      setShowAmountPanel(true);
    } finally {
      setIsLoading(false);
      logger.debug(LogCategory.PAYMENT, 'Receive invoice generation process finished');
    }
  }, [wallet, amount, description, showAmountPanel, isOnline]);

  const handleTabChange = useCallback((tab: PaymentMethod, loadLightningAddress: () => void) => {
    setActiveTab(tab);
    setCurrentStep('input');
    setError(null);
    setPaymentData('');
    setFeeSats(0);

    if (tab === 'lightning') {
      loadLightningAddress();
    } else if (tab === 'spark') {
      generateSparkAddress();
    } else if (tab === 'bitcoin') {
      generateBitcoinAddress();
    }
  }, [generateSparkAddress, generateBitcoinAddress]);

  return {
    activeTab,
    currentStep,
    description,
    amount,
    error,
    isLoading,
    paymentData,
    feeSats,
    sparkAddress,
    bitcoinAddress,
    sparkLoading,
    bitcoinLoading,
    showAmountPanel,
    isOnline,
    setDescription,
    setAmount,
    setShowAmountPanel,
    handleTabChange,
    generateBolt11Invoice,
    reset,
  };
}
