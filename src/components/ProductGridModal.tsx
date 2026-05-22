import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import { formatCurrencyFromSats, formatSats } from '../utils/formatCurrency.js';

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
  const { scanBarcode } = useCartStore();

  const { addProduct } = useCartStore();

const handleAdd = (item: typeof MOCK_PRODUCTS[number]) => {
  addProduct({ ...item, quantity: 1 });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 dark:bg-gray-900/40 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full sm:max-w-2xl bg-slate-50 dark:bg-purple-900/40
border-slate-200 dark:border-purple-500/20 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden h-[80vh] sm:h-[70vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white dark:bg-purple-900/40
border-slate-200 dark:border-purple-500/20 dark:text-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Quick Add Products</h2>
          <button 
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full dark:text-slate-50 dark:hover:text-black hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MOCK_PRODUCTS.map((item) => (
              <div key={item.id} className="bg-white dark:bg-purple-950
border-slate-200 dark:border-purple-500/20 rounded-2xl p-3 shadow-sm border flex flex-col">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full aspect-square object-cover rounded-xl mb-3"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-medium text-slate-900 dark:text-slate-50 text-sm mb-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatSats(item.pricesats)}</span>
                  <span className="text-sm text-slate-400 dark:text-slate-300">{formatCurrencyFromSats(item.pricesats)}</span>
                  <button 
  onClick={() => handleAdd(item)}
  className="w-8 h-8 cursor-pointer rounded-full bg-purple-50 text-purple-600  dark:bg-gray-800 dark:text-purple-400 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors"
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
