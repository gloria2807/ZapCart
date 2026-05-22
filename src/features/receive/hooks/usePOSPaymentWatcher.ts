import { useEffect, useRef } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { logger, LogCategory } from '@/services/logger';

/**
 * Watches for incoming Lightning payments while the POS receive dialog is open.
 * When a payment is received it:
 *   1. Fires a custom DOM event `pos-payment-settled` with the payment detail
 *   2. Calls the optional `onSettled` callback with the amount in sats
 *
 * The watcher is only active while `isActive` is true (i.e. the receive dialog is open).
 * It cleans up the SDK listener automatically on unmount or when `isActive` goes false.
 */
export function usePOSPaymentWatcher({
  isActive,
  expectedAmountSats,
  onSettled,
}: {
  isActive: boolean;
  expectedAmountSats?: number;
  onSettled?: (amountSats: number) => void;
}) {
  const wallet = useWallet();
  // Keep callback ref stable so the SDK listener never needs to be re-registered
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  useEffect(() => {
  if (!isActive) return;

  let removed = false;
  let listenerId: string | undefined;

  const listener = {
    onEvent: (event: any) => {
      if (removed) return;

      if (event?.type !== 'paymentSucceeded') return;

      const payment = event.payment ?? event.details ?? event;

      if (payment?.paymentType !== 'receive') return;

      const amountSats = Number(payment?.amount ?? payment?.amountSats ?? 0);

      if (expectedAmountSats && amountSats !== expectedAmountSats) return;

      logger.info(LogCategory.PAYMENT, 'POS payment settled', { amountSats });

      window.dispatchEvent(
        new CustomEvent('pos-payment-settled', {
          detail: { payment, amountSats },
        })
      );

      onSettledRef.current?.(amountSats);
    },
  };

  (async () => {
    try {
      listenerId = await wallet.addEventListener(listener);
      logger.debug(LogCategory.PAYMENT, 'POS payment watcher registered');
    } catch (err) {
      logger.error(LogCategory.PAYMENT, 'Failed to register POS payment watcher', { err });
    }
  })();

  return () => {
    removed = true;

    if (listenerId) {
      wallet.removeEventListener(listenerId);
    }

    logger.debug(LogCategory.PAYMENT, 'POS payment watcher removed');
  };
}, [isActive, expectedAmountSats, wallet]);
}