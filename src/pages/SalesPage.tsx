import React, { useMemo, useState } from 'react';
import { useSalesStore } from '../store/useSalesStore';
import type { Sale } from '../store/useSalesStore';
import { formatCurrencyFromSats, formatSats } from '../utils/formatCurrency';
import { TrendingUp, ShoppingBag, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface SalesPageProps {
  onBack: () => void;
}

interface DayGroup {
  label: string;       // e.g. "Today", "Yesterday", "22 May 2026"
  dateKey: string;     // YYYY-MM-DD for sorting
  sales: Sale[];
  totalSats: number;
  itemsSold: number;
}

function getDayLabel(dateKey: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  return new Date(dateKey).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

const SalesPage: React.FC<SalesPageProps> = ({ onBack }) => {
  const sales = useSalesStore((state) => state.sales);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['today']));
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

  // Group sales by day, most recent first
  const dayGroups = useMemo<DayGroup[]>(() => {
    const map = new Map<string, DayGroup>();

    for (const sale of sales) {
      const dateKey = new Date(sale.createdAt).toISOString().slice(0, 10);
      if (!map.has(dateKey)) {
        map.set(dateKey, {
          label: getDayLabel(dateKey),
          dateKey,
          sales: [],
          totalSats: 0,
          itemsSold: 0,
        });
      }
      const group = map.get(dateKey)!;
      group.sales.push(sale);
      group.totalSats += sale.totalSats;
      group.itemsSold += sale.items.reduce((acc, i) => acc + i.quantity, 0);
    }

    return Array.from(map.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [sales]);

  // Overall stats
  const allTimeSats = useMemo(() => sales.reduce((acc, s) => acc + s.totalSats, 0), [sales]);
  const todaySats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return sales
      .filter(s => new Date(s.createdAt).toISOString().slice(0, 10) === today)
      .reduce((acc, s) => acc + s.totalSats, 0);
  }, [sales]);

  const toggleDay = (dateKey: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(dateKey) ? next.delete(dateKey) : next.add(dateKey);
      return next;
    });
  };

  const toggleSale = (saleId: string) => {
    setExpandedSales(prev => {
      const next = new Set(prev);
      next.has(saleId) ? next.delete(saleId) : next.add(saleId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button onClick={onBack} className="text-black font-medium">Back</button>
        <h1 className="text-lg font-bold text-black">Sales</h1>
        <div className="w-12" />
      </div>

      {/* Summary cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-gray-400" />
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today</p>
          </div>
          <p className="text-xl font-bold text-black">{formatSats(todaySats)}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatCurrencyFromSats(todaySats)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={16} className="text-gray-400" />
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">All Time</p>
          </div>
          <p className="text-xl font-bold text-black">{formatSats(allTimeSats)}</p>
          <p className="text-xs text-gray-500 mt-0.5">{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Sales list grouped by day */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingBag size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No sales yet</p>
          </div>
        ) : (
          dayGroups.map((group) => {
            const isDayExpanded = expandedDays.has(group.dateKey);

            return (
              <div key={group.dateKey} className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                {/* Day header — tap to expand/collapse */}
                <button
                  onClick={() => toggleDay(group.dateKey)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <p className="font-bold text-black">{group.label}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-sm text-gray-500">{group.sales.length} sale{group.sales.length !== 1 ? 's' : ''}</p>
                      <span className="text-gray-300">·</span>
                      <p className="text-sm text-gray-500">{group.itemsSold} item{group.itemsSold !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-black">{formatSats(group.totalSats)}</p>
                      <p className="text-xs text-gray-500">{formatCurrencyFromSats(group.totalSats)}</p>
                    </div>
                    {isDayExpanded
                      ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                      : <ChevronDown size={16} className="text-gray-400 shrink-0" />
                    }
                  </div>
                </button>

                {/* Daily P&L breakdown */}
                {isDayExpanded && (
                  <div className="border-t border-gray-100">

                    {/* P&L summary row */}
                    <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        Revenue ({group.sales.length} transactions)
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrencyFromSats(group.totalSats)} · {formatSats(group.totalSats)}
                      </span>
                    </div>

                    {/* Individual sales */}
                    <div className="divide-y divide-gray-100">
                      {group.sales.map((sale) => {
                        const isSaleExpanded = expandedSales.has(sale.id);
                        const saleTime = new Date(sale.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div key={sale.id}>
                            {/* Sale row */}
                            <button
                              onClick={() => toggleSale(sale.id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Package size={14} className="text-gray-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-black">
                                    {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                                  </p>
                                  <p className="text-xs text-gray-400">{saleTime}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-black">{formatSats(sale.totalSats)}</p>
                                  <p className="text-xs text-gray-500">{formatCurrencyFromSats(sale.totalSats)}</p>
                                </div>
                                {isSaleExpanded
                                  ? <ChevronUp size={14} className="text-gray-400" />
                                  : <ChevronDown size={14} className="text-gray-400" />
                                }
                              </div>
                            </button>

                            {/* Expanded sale items */}
                            {isSaleExpanded && (
                              <div className="px-4 pb-3 space-y-2 bg-slate-50">
                                {sale.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-black truncate">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-black shrink-0">
                                      {formatCurrencyFromSats(item.pricesats * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SalesPage;
