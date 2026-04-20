import { PaymentMethod } from '@/types';

export type CardBrand = PaymentMethod['brand'];

export function detectBrand(cardNumber: string): CardBrand {
  const n = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover';
  return 'visa';
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s+/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isNaN(d)) return false;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * Simulated payment intent confirmation. In production, this would call
 * Stripe's createPaymentIntent on the backend and confirmPayment on the
 * client SDK. We simulate a successful authorization locally.
 */
export async function confirmPaymentLocally(amountCents: number): Promise<{
  ok: boolean;
  authorizationId?: string;
  error?: string;
}> {
  await new Promise((res) => setTimeout(res, 1200));
  if (amountCents <= 0) return { ok: false, error: 'Invalid amount.' };
  return { ok: true, authorizationId: `auth_${Date.now().toString(36)}` };
}

export function brandLabel(brand: CardBrand): string {
  switch (brand) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'American Express';
    case 'discover':
      return 'Discover';
  }
}

export function brandIcon(brand: CardBrand): string {
  switch (brand) {
    case 'visa':
      return 'card';
    case 'mastercard':
      return 'card-outline';
    case 'amex':
      return 'card';
    case 'discover':
      return 'card-outline';
  }
}
