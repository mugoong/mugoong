'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'CNY' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'SGD' | 'TWD';

export const CURRENCY_INFO: Record<CurrencyCode, { symbol: string; name: string; decimals: number }> = {
  KRW: { symbol: '₩',   name: 'Korean Won',       decimals: 0 },
  USD: { symbol: '$',   name: 'US Dollar',         decimals: 2 },
  JPY: { symbol: '¥',   name: 'Japanese Yen',      decimals: 0 },
  CNY: { symbol: '¥',   name: 'Chinese Yuan',      decimals: 2 },
  EUR: { symbol: '€',   name: 'Euro',              decimals: 2 },
  GBP: { symbol: '£',   name: 'British Pound',     decimals: 2 },
  AUD: { symbol: 'A$',  name: 'Australian Dollar', decimals: 2 },
  CAD: { symbol: 'C$',  name: 'Canadian Dollar',   decimals: 2 },
  SGD: { symbol: 'S$',  name: 'Singapore Dollar',  decimals: 2 },
  TWD: { symbol: 'NT$', name: 'Taiwan Dollar',     decimals: 0 },
};

export const CURRENCY_CODES = Object.keys(CURRENCY_INFO) as CurrencyCode[];

// Fallback rates (KRW base, 3% spread already applied)
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  KRW: 1,
  USD: 0.000718,
  JPY: 0.10480,
  CNY: 0.00505,
  EUR: 0.000641,
  GBP: 0.000543,
  AUD: 0.001068,
  CAD: 0.000970,
  SGD: 0.000941,
  TWD: 0.02232,
};

const STORAGE_KEY = 'mugoong_currency';

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (krwAmount: number) => string;
  rates: Record<string, number>;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'KRW',
  setCurrency: () => {},
  formatPrice: (n) => `₩${n.toLocaleString('ko-KR')}`,
  rates: FALLBACK_RATES,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('KRW');
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && saved in CURRENCY_INFO) setCurrencyState(saved);
    } catch {}

    fetch('/api/exchange-rates')
      .then((r) => r.json())
      .then((data) => { if (data.rates) setRates(data.rates); })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, []);

  const formatPrice = useCallback((krwAmount: number): string => {
    if (currency === 'KRW') {
      return `₩${krwAmount.toLocaleString('ko-KR')}`;
    }
    const rate = (rates[currency] ?? FALLBACK_RATES[currency]) as number;
    const info = CURRENCY_INFO[currency];
    const converted = krwAmount * rate;
    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
    });
    return `~${info.symbol}${formatted}`;
  }, [currency, rates]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
