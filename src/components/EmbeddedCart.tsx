import { useCartStore } from '../store/useCartStore';
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
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 bg-white">
        <ShoppingCart size={48} className="mb-3 opacity-50 text-gray-500" />

        <p className="text-sm font-medium text-black">
          Your cart is empty
        </p>

        <p className="text-xs mt-1 mb-6 text-gray-500">
          Scan items or tap products to add
        </p>

        <button
          onClick={onOpenProducts}
          className="flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <Grid size={18} />
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-gray-700" />

          <h2 className="font-semibold text-black">
            Current Order
          </h2>

          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProducts}
            className="text-xs cursor-pointer text-gray-700 font-medium px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Add Items
          </button>

          <button
            onClick={clearCart}
            className="text-xs cursor-pointer text-gray-500 font-medium px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* ITEMS */}
      <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-white">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-2xl"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover"
            />

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-black truncate">
                {item.name}
              </h4>

              <p className="text-xs text-gray-700 mt-0.5">
                {formatSats(item.pricesats)}
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                {formatCurrencyFromSats(item.pricesats)}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 p-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.quantity === 1 ? (
                  <Trash2 size={14} className="text-gray-500" />
                ) : (
                  <Minus size={14} />
                )}
              </button>

              <span className="text-sm font-semibold w-6 text-center text-black">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-black font-medium">
            Total Amount
          </span>

          <div className="text-right">
            <p className="text-2xl font-bold text-black">
              {formatSats(total)}
            </p>

            <p className="text-sm text-gray-500">
              {formatCurrencyFromSats(total)}
            </p>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full cursor-pointer bg-black hover:bg-gray-700 text-white font-semibold py-4 rounded-2xl transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}