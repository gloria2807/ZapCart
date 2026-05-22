import React from 'react';
import { useSalesStore } from '../store/useSalesStore';
import {
  formatCurrencyFromSats,
  formatSats,
} from '../utils/formatCurrency';

interface SalesPageProps {
  onBack: () => void;
}

const SalesPage: React.FC<SalesPageProps> = ({ onBack }) => {
  const { sales } = useSalesStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button
          onClick={onBack}
          className="text-black font-medium"
        >
          Back
        </button>

        <h1 className="text-lg font-bold text-black">
          Sales
        </h1>

        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {sales.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              No sales yet
            </p>
          </div>
        ) : (
          sales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-2xl p-4 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-black">
                    {formatCurrencyFromSats(sale.totalSats)}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(sale.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-sm text-black">
                    {formatSats(sale.totalSats)}
                  </p>

                  <p className="text-xs text-gray-500">
                    {sale.items.length} item(s)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-black">
                      {formatCurrencyFromSats(
                        item.pricesats * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default SalesPage;