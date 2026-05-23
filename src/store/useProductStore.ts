import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;       // = the barcode printed on the product (e.g. "6156000211626")
  name: string;
  image: string;
  priceNgn: number;
  pricesats: number;
  stock: number;
}

// Keeps your original 4 products working with their real barcodes
const DEFAULT_PRODUCTS: Product[] = [
  { id: "6156000211626", name: "Nutsy Peanut Butter",  priceNgn: 0, pricesats: 1500, stock: 10, image: "/assets/nutsy.png"   },
  { id: "6156000261201", name: "CWAY 750ml",            priceNgn: 0, pricesats: 1000, stock: 10, image: "/assets/cway.png"    },
  { id: "5060909050013", name: "Pop-Cola 35cl",         priceNgn: 0, pricesats: 250,  stock: 10, image: "/assets/redoil.png"  },
  { id: "8410300367673", name: "Bama Mayonnaise 810ml", priceNgn: 0, pricesats: 8000, stock: 10, image: "/assets/bama.png"    },
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,

      addProduct: (product) =>
        set((state) => ({
          // Upsert: if barcode already exists replace it, otherwise prepend
          products: state.products.some((p) => p.id === product.id)
            ? state.products.map((p) => (p.id === product.id ? product : p))
            : [product, ...state.products],
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    { name: 'product-store' }
  )
);