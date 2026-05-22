import React, { useCallback, useState } from 'react';

import Scanner from '../components/Scanner';
import EmbeddedCart from '../components/EmbeddedCart';
import ProductGridModal from '../components/ProductGridModal';

import ReceivePaymentDialog from '../features/receive/ReceivePaymentDialog';

import { useCartStore } from '../store/useCartStore';
import { useSalesStore } from '../store/useSalesStore';

interface POSPageProps {
  onBack: () => void;
}

const POSPage: React.FC<POSPageProps> = ({ onBack }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Receive dialog state
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);

  // Cart + Sales stores
  const { items, clearCart } = useCartStore();
  const { addSale } = useSalesStore();

  // Close dialog
  const handleReceiveDialogClose = useCallback(() => {
    setIsReceiveDialogOpen(false);
  }, []);

  // Called after successful payment
  const handlePaymentSuccess = () => {
  if (items.length === 0) return;

  const totalSats = items.reduce(
    (sum, item) => sum + item.pricesats * item.quantity,
    0
  );

  addSale({
    id: crypto.randomUUID(),
    items,
    totalSats,
    createdAt: new Date().toISOString(),
  });

  clearCart();

  setIsReceiveDialogOpen(false);
};

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={onBack}
          className="text-black font-medium"
        >
          Back
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          POS
        </h1>

        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-rows-3 gap-4 p-4 overflow-hidden">

        {/* Scanner */}
        <div className="row-span-1 min-h-0">
          <Scanner />
        </div>

        {/* Cart */}
        <div className="row-span-2 rounded-2xl bg-white shadow overflow-hidden min-h-0">
          <EmbeddedCart
            onCheckout={() => setIsReceiveDialogOpen(true)}
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

        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default POSPage;