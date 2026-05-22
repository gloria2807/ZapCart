import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  pricesats: number;
  quantity: number;
  image: string;
}

interface AppState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Product database for barcode scanning
const PRODUCTS: CartItem[] = [
  { id: "6156000211626", name: "Nutsy Peanut Butter", pricesats: 1500, quantity: 1, image: "https://freshtodommot.com/cdn/shop/products/nutzy-peanut-butter-extra-crunchy-227-g_710x.jpg?v=1757105179" },
  { id: "6156000261201", name: "CWAY 750ml", pricesats: 1000, quantity: 1, image: "https://products.contact/234-home_default/cway-table-water-750ml.jpg" },
  { id: "5060909050013", name: "Pop-Cola 35cl", pricesats: 250, quantity: 1, image: "https://mamudabeverages.com/wp-content/uploads/2024/03/popcola.jpg.webp" },
  { id: "8410300367673", name: "Bama Mayonnaise 810ml", pricesats: 8000, quantity: 1, image: "https://www.bellanaija.com/wp-content/uploads/2024/08/BAMA-Mayonnaise-1.jpg" },
];

interface CartStore {
  items: CartItem[];
  total: number;
  scanBarcode: (barcode: string) => void; // For barcode scanning
  addProduct: (product: CartItem) => void; // For manual modal addition
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  // Barcode scan logic
  scanBarcode: (barcode: string) => {
    const product = PRODUCTS.find(p => p.id === barcode);
    if (!product) return;

    const existing = get().items.find(i => i.id === product.id);
    if (existing) {
      const newItems = get().items.map(i =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    } else {
      const newItems = [...get().items, { ...product }];
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    }
  },

  // Manual add from modal (pass full product)
  addProduct: (product: CartItem) => {
    const existing = get().items.find(i => i.id === product.id);
    if (existing) {
      const newItems = get().items.map(i =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    } else {
      const newItems = [...get().items, { ...product }];
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    }
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      const newItems = get().items.filter(i => i.id !== id);
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    } else {
      const newItems = get().items.map(i => i.id === id ? { ...i, quantity } : i);
      set({
        items: newItems,
        total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
      });
    }
  },

  removeItem: (id) => {
    const newItems = get().items.filter(i => i.id !== id);
    set({
      items: newItems,
      total: newItems.reduce((acc, item) => acc + item.pricesats * item.quantity, 0)
    });
  },

  clearCart: () => set({ items: [], total: 0 })
}));


export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
    }
  )
);
