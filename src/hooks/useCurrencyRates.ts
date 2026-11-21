import { useEffect, useState } from 'react';
import { Rate } from '@/types';

interface UseCurrencyRatesReturn {
  rates: Rate[];
  loading: boolean;
  error: string | null;
  date: string | null;
}

export function useCurrencyRates(): UseCurrencyRatesReturn {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.frankfurter.dev/v1/latest?base=GBP');

        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }

        const data = await response.json();
        const ratesArray = Object.entries(data.rates).map(([code, rate]) => ({
          code,
          rate: rate as number,
        }));

        setRates(ratesArray.sort((a, b) => a.code.localeCompare(b.code)));
        setDate(data.date);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error, date };
}
