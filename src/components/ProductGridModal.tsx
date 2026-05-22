import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrencyFromSats, formatSats } from '../utils/formatCurrency';

interface ProductGridModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalProduct {
  id: string;
  name: string;
  pricesats: number;
  image: string;
}

const MOCK_PRODUCTS: ModalProduct[] = [
  { id: 'p1', name: "Nutsy Peanut Butter", pricesats: 1500, image: "https://addide.com/cdn/shop/products/creeamysmooth227g_600x.png?v=1624533869" },
  { id: 'p2', name: "CWAY (750ml)", pricesats: 1000, image: "https://africanfood.market/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-28-at-10.14.40-PM-1.jpeg" },
  { id: 'p3', name: "Pop-Cola (35cl)", pricesats: 250, image: "https://i0.wp.com/nextcashandcarry.com.ng/wp-content/uploads/2022/03/coke-35-1.jpg?w=550&ssl=1" },
  { id: 'p4', name: "Bama Mayonnaise (810ml)", pricesats: 8000, image: "https://shalomafricanfoods.ca/storage/2025/01/5909-580x580.jpg" },
  { id: 'p5', name: 'Golden Penny Spaghetti (500g)', pricesats: 1800, image: "https://africanmarketdubai.com/wp-content/uploads/2021/01/e16204dd-4b03-4190-a2c2-ce783bb28542.jpg" },
  { id: 'p6', name: 'Fresh Palm Oil (5l)', pricesats: 13500, image: "https://localnaija.co.za/wp-content/uploads/2023/02/RED-OIL.png" },
];

export default function ProductGridModal({ isOpen, onClose }: ProductGridModalProps) {
  const { addProduct } = useCartStore();

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

            {MOCK_PRODUCTS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col"
              >
                
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-xl mb-3"
                />

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
                    onClick={() => handleAdd(item)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>
      </motion.div>
    </div>
  );
}