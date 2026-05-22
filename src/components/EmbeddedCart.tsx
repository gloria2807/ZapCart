import { useCartStore } from '../store/useCartStore.js';
import { formatCurrencyFromSats, formatSats } from '../utils/formatCurrency';
import { Minus, Plus, ShoppingCart, Trash2, Grid } from 'lucide-react';

interface CartProps {
  onCheckout: () => void;
  onOpenProducts: () => void;
}

export default function EmbeddedCart({ onCheckout, onOpenProducts }: CartProps) {
  const { items, total, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6">
        <ShoppingCart size={48} className="mb-3 opacity-50" />
        <p className="text-sm font-medium">Your cart is empty</p>
        <p className="text-xs mt-1 mb-6">Scan items or tap products to add</p>
        <button 
          onClick={onOpenProducts}
          className="flex cursor-pointer items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          <Grid size={18} />
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
  {/* HEADER */}
  <div className="p-4 border-b border-slate-200 dark:border-purple-400/10 flex items-center justify-between sticky top-0 bg-white dark:bg-purple-950 z-10">
    <div className="flex items-center gap-2">
      <ShoppingCart size={20} className="text-slate-700 dark:text-purple-200" />
      <h2 className="font-semibold text-slate-900 dark:text-white">Current Order</h2>
      <span className="bg-slate-100 dark:bg-purple-800/40 text-slate-600 dark:text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">
        {items.reduce((acc, item) => acc + item.quantity, 0)}
      </span>
    </div>
    <div className="flex items-center gap-3"> 
      <button 
      onClick={onOpenProducts} 
      className="text-xs cursor-pointer text-blue-600 font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors" > 
        Add Items 
      </button> 
      <button onClick={clearCart} className="text-xs cursor-pointer text-red-500 font-medium px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors" > 
        Clear All 
      </button> 
    </div>
  </div>

  {/* ITEMS */}
  <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-white dark:bg-purple-950">
    {items.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-3 bg-slate-50 dark:bg-purple-900/30 border border-slate-200 dark:border-purple-400/10 p-3 rounded-2xl"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded-xl object-cover"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {item.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-purple-300 mt-0.5">
            {formatSats(item.pricesats)}
          </p>
          <p className="text-xs text-slate-400 dark:text-purple-400/70 mt-0.5">
            {formatCurrencyFromSats(item.pricesats)}
          </p>
        </div>

        {/* QUANTITY */}
        <div className="flex items-center gap-2 bg-white dark:bg-purple-800/40 rounded-full border border-slate-200 dark:border-purple-400/10 p-1 shadow-sm">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-700/40"
          >
            {item.quantity === 1 ? (
              <Trash2 size={14} className="text-red-500" />
            ) : (
              <Minus size={14} />
            )}
          </button>

          <span className="text-sm font-semibold w-6 text-center text-black dark:text-white">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 dark:text-purple-200 hover:bg-slate-100 dark:hover:bg-purple-700/40"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* FOOTER */}
  <div className="p-4 bg-white dark:bg-purple-950 border-t border-slate-200 dark:border-purple-400/10 pb-safe">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-900 dark:text-white font-medium">
        Total Amount
      </span>
      <span className="text-2xl font-bold text-slate-600 dark:text-purple-200">
        {formatSats(total)}
      </span>
      <span className="text-2xl text-slate-700 dark:text-purple-300/70">
        {formatCurrencyFromSats(total)}
      </span>
    </div>

    <button
      onClick={onCheckout}
      className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl transition"
    >
      Proceed to Checkout
    </button>
  </div>
</div>
  );
}
