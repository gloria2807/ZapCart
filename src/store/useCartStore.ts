import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProductStore } from './useProductStore';

export interface CartItem {
  id: string;
  name: string;
  pricesats: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  scanBarcode: (barcode: string) => void;
  addProduct: (product: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

function recalcTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.pricesats * item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      scanBarcode: (barcode: string) => {
        // Look up against products added in InventoryPage via useProductStore
        const storeProducts = useProductStore.getState().products;
        const product = storeProducts.find(
          (p) => p.id === barcode || String(p.id) === barcode
        );

        if (!product) return; // barcode not recognised — silently ignore

        const existing = get().items.find((i) => i.id === product.id);
        const newItems = existing
          ? get().items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [
              ...get().items,
              {
                id: product.id,
                name: product.name,
                pricesats: product.pricesats,
                quantity: 1,
                image: product.image,
              },
            ];

        set({ items: newItems, total: recalcTotal(newItems) });
      },

      addProduct: (product: CartItem) => {
        const existing = get().items.find((i) => i.id === product.id);
        const newItems = existing
          ? get().items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...get().items, { ...product }];

        set({ items: newItems, total: recalcTotal(newItems) });
      },

      updateQuantity: (id, quantity) => {
        const newItems =
          quantity <= 0
            ? get().items.filter((i) => i.id !== id)
            : get().items.map((i) => (i.id === id ? { ...i, quantity } : i));

        set({ items: newItems, total: recalcTotal(newItems) });
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ items: newItems, total: recalcTotal(newItems) });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-store',
    }
  )
);