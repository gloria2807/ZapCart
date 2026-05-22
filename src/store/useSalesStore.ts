import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  pricesats: number;
  image: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalSats: number;
  createdAt: string;
}

interface SalesStore {
  sales: Sale[];
  addSale: (sale: Sale) => void;
}

export const useSalesStore = create<SalesStore>()(
  persist<SalesStore>(
    (set) => ({
      sales: [],

      addSale: (sale: Sale) =>
        set((state) => ({
          sales: [sale, ...state.sales],
        })),
    }),
    {
      name: 'sales-store',
    }
  )
);