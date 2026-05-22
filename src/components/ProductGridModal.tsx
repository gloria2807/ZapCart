import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrencyFromSats, formatSats } from '../utils/formatCurrency';
import { useProductStore } from '../store/useProductStore';

interface ProductGridModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalProduct {
  id: string;
  name: string;
  pricesats: number;
  image: string;
  stock?: number;
}

export default function ProductGridModal({ isOpen, onClose }: ProductGridModalProps) {
  const { addProduct } = useCartStore();
  const { products } = useProductStore();

  const handleAdd = (item: ModalProduct) => {
    addProduct({ ...item, quantity: 1 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">

      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/80"
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full sm:max-w-2xl bg-white border border-gray-200 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden h-[80vh] sm:h-[70vh] flex flex-col"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-black">
            Quick Add Products
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* GRID */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {products.map((item) => {
              const outOfStock = (item.stock ?? 0) === 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-3 flex flex-col ${outOfStock ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover rounded-xl mb-3"
                    />
                    {/* Stock badge */}
                    <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      outOfStock
                        ? 'bg-red-100 text-red-500'
                        : (item.stock ?? 0) < 5
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {outOfStock ? 'Out of stock' : `${item.stock} left`}
                    </span>
                  </div>

                  <h3 className="font-medium text-black text-sm mb-1">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {formatSats(item.pricesats)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrencyFromSats(item.pricesats)}
                      </p>
                    </div>

                    <button
                      onClick={() => !outOfStock && handleAdd(item)}
                      disabled={outOfStock}
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
