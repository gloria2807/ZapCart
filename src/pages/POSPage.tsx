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

  // Snapshot cart at checkout time so the sale record is accurate
  // even if the cart changes before the payment lands
  const cartSnapshotRef = useRef<{ items: typeof items; total: number } | null>(null);

  const handleCheckout = useCallback(() => {
    // Take a snapshot of the cart the moment the customer confirms checkout
    cartSnapshotRef.current = { items: [...items], total };
    setIsReceiveDialogOpen(true);
  }, [items, total]);

  const handleReceiveDialogClose = useCallback(() => {
    setIsReceiveDialogOpen(false);
    cartSnapshotRef.current = null;
  }, []);

  // Register SDK payment listener while the receive dialog is open
  usePOSPaymentWatcher({
    isActive: isReceiveDialogOpen,
    onSettled: (amountSats) => {
      const snapshot = cartSnapshotRef.current;

      // Record the sale
      addSale({
        id: crypto.randomUUID(),
        items: snapshot?.items ?? items,
        totalSats: snapshot?.total ?? amountSats,
        createdAt: new Date().toISOString(),
      });

      // Clear cart and close dialog
      clearCart();
      setIsReceiveDialogOpen(false);
      cartSnapshotRef.current = null;

      // Show celebration overlay
      setCelebrationAmount(amountSats);
    },
  });

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shrink-0">
        <button onClick={onBack} className="text-black font-medium">
          Back
        </button>
        <h1 className="text-lg font-bold text-slate-900">POS</h1>
        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-rows-3 gap-4 p-4 overflow-hidden">
        <div className="row-span-1 min-h-0">
          <Scanner />
        </div>
        <div className="row-span-2 rounded-2xl bg-white shadow overflow-hidden min-h-0">
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

      {/* Payment Received Celebration */}
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
