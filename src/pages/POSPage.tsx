import React, { useCallback, useState, useRef } from 'react';
import { useSalesStore } from '../store/useSalesStore';
import { useCartStore } from '../store/useCartStore';
import Scanner from '../components/Scanner';
import EmbeddedCart from '../components/EmbeddedCart';
import ProductGridModal from '../components/ProductGridModal';
import ReceivePaymentDialog from '../features/receive/ReceivePaymentDialog';
import PaymentReceivedCelebration from '../components/PaymentReceivedCelebration';
import { usePOSPaymentWatcher } from '../features/receive/hooks/usePOSPaymentWatcher';

interface POSPageProps {
  onBack: () => void;
}

const POSPage: React.FC<POSPageProps> = ({ onBack }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [celebrationAmount, setCelebrationAmount] = useState<number | null>(null);

  const { addSale } = useSalesStore();
  const { items, total, clearCart } = useCartStore();

  const cartSnapshotRef = useRef<{ items: typeof items; total: number } | null>(null);

  const handleCheckout = useCallback(() => {
    cartSnapshotRef.current = { items: [...items], total };
    setIsReceiveDialogOpen(true);
  }, [items, total]);

  const handleReceiveDialogClose = useCallback(() => {
    setIsReceiveDialogOpen(false);
    cartSnapshotRef.current = null;
  }, []);

  usePOSPaymentWatcher({
    isActive: isReceiveDialogOpen,
    onSettled: (amountSats) => {
      const snapshot = cartSnapshotRef.current;

      addSale({
        id: crypto.randomUUID(),
        items: snapshot?.items ?? items,
        totalSats: snapshot?.total ?? amountSats,
        createdAt: new Date().toISOString(),
      });

      clearCart();
      setIsReceiveDialogOpen(false);
      cartSnapshotRef.current = null;

      setCelebrationAmount(amountSats);
    },
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50">

      {/* HEADER */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white">
        <button onClick={onBack} className="text-black font-medium">
          Back
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          POS
        </h1>

        <div className="w-12" />
      </div>

      {/* MAIN CONTENT (natural scroll) */}
      <div className="flex flex-col gap-4 p-4">

        {/* Scanner */}
        <Scanner />

        {/* Cart */}
        <div className="rounded-2xl bg-white shadow overflow-hidden">
          <EmbeddedCart
            onCheckout={handleCheckout}
            onOpenProducts={() => setIsProductsOpen(true)}
          />
        </div>

      </div>

      {/* Product Modal */}
      <ProductGridModal
        isOpen={isProductsOpen}
        onClose={() => setIsProductsOpen(false)}
      />

      {/* Receive Payment Dialog */}
      <ReceivePaymentDialog
        isOpen={isReceiveDialogOpen}
        onClose={handleReceiveDialogClose}
      />

      {/* Celebration */}
      {celebrationAmount !== null && (
        <PaymentReceivedCelebration
          amount={celebrationAmount}
          onClose={() => setCelebrationAmount(null)}
        />
      )}

    </div>
  );
};

export default POSPage;