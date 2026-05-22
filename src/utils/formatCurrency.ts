export function formatSats(amount: number) {
  return `${amount} sats`;
}
const SATS_TO_NGN = 0.935251;
const NGN_TO_SATS = 1 / 0.935251;

export function convertNgnToSats(ngn: number) {
  return Math.round(ngn * NGN_TO_SATS);
}

export function formatCurrencyFromSats(amount: number) {
  const naira = amount * SATS_TO_NGN;
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(naira);
}

// utils/formatCurrency.ts
export function formatSatss(amount: number) {
  return amount < 0 
    ? `-${Math.abs(amount).toFixed(2)} sats` 
    : `${amount.toFixed(2)} sats`;
}