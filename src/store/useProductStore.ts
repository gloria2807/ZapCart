import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  image: string;
  priceNgn: number;
  pricesats: number;
  stock: number;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'product-store', // localStorage key for offline persistence
    }
  )
);