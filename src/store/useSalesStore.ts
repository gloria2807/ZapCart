import { create } from 'zustand';

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

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],

  addSale: (sale) =>
    set((state) => ({
      sales: [sale, ...state.sales],
    })),
}));