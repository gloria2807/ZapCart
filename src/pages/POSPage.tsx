import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useSalesStore } from '../store/useSalesStore';
import { useCartStore } from '../store/useCartStore';
import Scanner from '../components/Scanner';
import EmbeddedCart from '../components/EmbeddedCart';
import ProductGridModal from '../components/ProductGridModal';

import ReceivePaymentDialog from '../features/receive/ReceivePaymentDialog';

interface POSPageProps {
  onBack: () => void;
}

const POSPage: React.FC<POSPageProps> = ({ onBack }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Receive dialog state
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);

  // Close dialog
  const handleReceiveDialogClose = useCallback(() => {
    setIsReceiveDialogOpen(false);
  }, []);

 const { addSale } = useSalesStore();
const { items, total, clearCart } = useCartStore();

useEffect(() => {
  const handler = (event: any) => {
  const payment = event.detail;
  if (!payment) return;

  const snapshotItems = [...items];
  const snapshotTotal = total;

  addSale({
    id: crypto.randomUUID(),
    items: snapshotItems,
    totalSats: snapshotTotal,
    createdAt: new Date().toISOString(),
  });

  clearCart();
  setIsReceiveDialogOpen(false);
};

  window.addEventListener('pos-payment-settled', handler);

  return () => {
    window.removeEventListener('pos-payment-settled', handler);
  };
}, [addSale, clearCart, items, total]);

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

      />
    </div>
  );
};

export default POSPage;