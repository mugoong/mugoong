'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type RateData = {
  rates: Record<string, number>;
  spread: number;
  updatedAt: string;
  fallback?: boolean;
};

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',         symbol: '$',   decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen',      symbol: '¥',   decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan',      symbol: '¥',   decimals: 2 },
  { code: 'EUR', name: 'Euro',              symbol: '€',   decimals: 2 },
  { code: 'GBP', name: 'British Pound',     symbol: '£',   decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$',  decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar',   symbol: 'C$',  decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar',  symbol: 'S$',  decimals: 2 },
  { code: 'TWD', name: 'Taiwan Dollar',     symbol: 'NT$', decimals: 0 },
];

// Approximate mid-market reference (displayed alongside MUGOONG spread rate)
const MID_APPROX: Record<string, number> = {
  USD: 0.000740, JPY: 0.10804, CNY: 0.00521, EUR: 0.000661,
  GBP: 0.000560, AUD: 0.001101, CAD: 0.001000, SGD: 0.000970, TWD: 0.02300,
};

export default function ExchangeRatesPage() {
  const [data, setData] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch('/api/exchange-rates', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((d: RateData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      })
      .finally(() => clearTimeout(timeout));

    return () => controller.abort();
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">MUGOONG Exchange Rates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live rates with 3% spread applied. Cached for 24 hours. Base currency: KRW.
        </p>
        {data?.fallback && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
            ⚠️ Using fallback rates — live API unavailable
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
          Failed to load exchange rates. Please refresh the page.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Currency</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">Mid-Market</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">MUGOONG Rate (−3%)</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">₩1,000 =</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="bg-primary-50">
                  <td className="px-6 py-4 font-semibold text-primary-700">Korean Won</td>
                  <td className="px-6 py-4 font-mono font-bold text-primary-700">KRW</td>
                  <td className="px-6 py-4 text-right text-gray-400">—</td>
                  <td className="px-6 py-4 text-right text-gray-400">—</td>
                  <td className="px-6 py-4 text-right font-semibold text-primary-700">₩1,000</td>
                </tr>
                {CURRENCIES.map(({ code, name, symbol, decimals }) => {
                  const mugoongRate = data?.rates[code] ?? 0;
                  const midRate = MID_APPROX[code] ?? mugoongRate / 0.97;
                  const converted = 1000 * mugoongRate;
                  const example = converted.toLocaleString('en-US', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  });

                  return (
                    <tr key={code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{name}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-gray-700">{code}</td>
                      <td className="px-6 py-4 text-right text-gray-400 font-mono">
                        {midRate.toFixed(6)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900 font-mono">{mugoongRate.toFixed(6)}</span>
                        <span className="ml-2 text-[11px] text-gray-400">−3%</span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary-600">
                        ~{symbol}{example}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Source: open.er-api.com · Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-base font-semibold text-gray-900">How MUGOONG Exchange Works</h2>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p>1. Live mid-market rates fetched from open.er-api.com, cached server-side for 24 hours.</p>
              <p>2. 3% spread applied: <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">MUGOONG Rate = Mid-Market × 0.97</span></p>
              <p>3. Users select currency in the header — all KRW prices convert using the MUGOONG rate.</p>
              <p>4. Foreign prices show a <span className="font-mono">~</span> prefix (approximate, based on ₩1,000). All charges are in KRW.</p>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
