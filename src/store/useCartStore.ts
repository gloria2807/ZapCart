import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  pricesats: number;
  quantity: number;
  image: string;
}

// Product database for barcode scanning
const PRODUCTS: CartItem[] = [
  { id: "6156000211626", name: "Nutsy Peanut Butter", pricesats: 1500, quantity: 1, image: "././assets/nutsy.png" },
  { id: "6156000261201", name: "CWAY 750ml", pricesats: 1000, quantity: 1, image: "././assets/cway.png" },
  { id: "5060909050013", name: "Pop-Cola 35cl", pricesats: 250, quantity: 1, image: "././assets/redoil.png" },
  { id: "8410300367673", name: "Bama Mayonnaise 810ml", pricesats: 8000, quantity: 1, image: "././assets/bama.png" },
];

interface CartStore {
  items: CartItem[];
  total: number;
  scanBarcode: (barcode: string) => void;
  addProduct: (product: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      scanBarcode: (barcode: string) => {
        const product = PRODUCTS.find(p => p.id === barcode);
        if (!product) return;

        const existing = get().items.find(i => i.id === product.id);

        let newItems;

        if (existing) {
          newItems = get().items.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...get().items, { ...product }];
        }

        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0),
        });
      },

      addProduct: (product: CartItem) => {
        const existing = get().items.find(i => i.id === product.id);

        let newItems;

        if (existing) {
          newItems = get().items.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...get().items, { ...product }];
        }

        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0),
        });
      },

      updateQuantity: (id, quantity) => {
        let newItems;

        if (quantity <= 0) {
          newItems = get().items.filter(i => i.id !== id);
        } else {
          newItems = get().items.map(i =>
            i.id === id ? { ...i, quantity } : i
          );
        }

        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0),
        });
      },

      removeItem: (id) => {
        const newItems = get().items.filter(i => i.id !== id);

        set({
          items: newItems,
          total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0),
        });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-store',
    }
  )
);