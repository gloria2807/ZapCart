import React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FormError,
  PrimaryButton,
  BottomSheetContainer,
  BottomSheetCard,
  DialogHeader,
} from '../../components/ui';
import { LightningBoltIcon } from '../../components/Icons';

interface AmountPanelProps {
  isOpen: boolean;
  amount: string;
  setAmount: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  limits: { min: number; max: number };
  isLoading: boolean;
  error: string | null;
  onCreateInvoice: () => void;
  onClose: () => void;
}

const formatWithSpaces = (num: number): string => {
  return num.toLocaleString('en-US').replace(/,/g, '\u2009');
};

const QUICK_AMOUNTS = [100, 1000, 10000, 100000];

const AmountPanel: React.FC<AmountPanelProps> = ({
  isOpen,
  amount,
  setAmount,
  description,
  setDescription,
  limits: _limits,
  isLoading,
  error,
  onCreateInvoice,
  onClose,
}) => {
  return (
  <BottomSheetContainer isOpen={isOpen} onClose={onClose} showBackdrop>
    <BottomSheetCard>
      <DialogHeader
        title="Create Invoice"
        onClose={onClose}
        icon={<LightningBoltIcon />}
      />

      {/* Amount Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden focus-within:border-black transition-all">
            <textarea
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              placeholder="0"
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent px-4 py-3 text-black text-lg font-mono placeholder-gray-500 focus:outline-none resize-none"
              data-testid="invoice-amount-input"
            />
            <span className="px-4 py-3 text-gray-500 font-medium text-sm">₿</span>
          </div>
        </div>

        {/* Quick amount buttons */}
        <div className="flex gap-2">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              disabled={isLoading}
              className={`
                flex-1 py-2 rounded-lg text-sm font-mono font-medium transition-all
                ${amount === quickAmount.toString()
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:text-black hover:border-gray-400'
                }
              `}
            >
              <span className="inline-flex items-center"><span className="text-[0.8em] opacity-70 mr-px text-gray-500">₿</span>{formatWithSpaces(quickAmount)}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.replace(/\n/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            placeholder="What's this for?"
            disabled={isLoading}
            rows={1}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:border-black focus:outline-none transition-all resize-none"
          />
        </div>

        <FormError error={error} data-testid="invoice-error-message" />

        {/* Generate Button */}
        <PrimaryButton
          onClick={onCreateInvoice}
          type="submit"
          disabled={isLoading || !amount}
          className="w-full"
          data-testid="generate-invoice-button"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Generate Invoice'}
        </PrimaryButton>
      </div>
    </BottomSheetCard>
  </BottomSheetContainer>
);
};

export default AmountPanel;
