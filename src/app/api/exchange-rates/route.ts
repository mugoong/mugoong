import { NextResponse } from 'next/server';

const SPREAD = 0.03;
const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'TWD'];

// Fallback rates (KRW base, 3% spread already applied)
const FALLBACK: Record<string, number> = {
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

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/KRW', {
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error('exchange rate API error');

    const data = await res.json();

    const rates: Record<string, number> = { KRW: 1 };
    for (const code of CURRENCIES) {
      const raw = data.rates?.[code];
      rates[code] = raw ? raw * (1 - SPREAD) : (FALLBACK[code] ?? 0);
    }

    return NextResponse.json({
      rates,
      base: 'KRW',
      spread: SPREAD,
      updatedAt: data.time_last_update_utc ?? new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      rates: FALLBACK,
      base: 'KRW',
      spread: SPREAD,
      updatedAt: new Date().toISOString(),
      fallback: true,
    });
  }
}
