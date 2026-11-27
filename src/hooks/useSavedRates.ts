import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRate } from '@/types';

const STORAGE_KEY = 'saved_rates';

export function useSavedRates() {
  const [savedRates, setSavedRates] = useState<SavedRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedRates();
  }, []);

  const loadSavedRates = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedRates(JSON.parse(data));
      }
    } catch (err) {
      console.error('Error loading saved rates:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveRate = useCallback(
    async (code: string, rate: number) => {
      try {
        const newRate: SavedRate = {
          code,
          rate,
          id: `${code}_${Date.now()}`,
          timestamp: Date.now(),
        };

        const updated = [...savedRates, newRate];
        setSavedRates(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving rate:', err);
      }
    },
    [savedRates]
  );

  const removeRate = useCallback(
    async (id: string) => {
      try {
        const updated = savedRates.filter((r) => r.id !== id);
        setSavedRates(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Error removing rate:', err);
      }
    },
    [savedRates]
  );

  const isSaved = useCallback(
    (code: string) => {
      return savedRates.some((r) => r.code === code);
    },
    [savedRates]
  );

  const refetch = useCallback(async () => {
    await loadSavedRates();
  }, []);

  return {
    savedRates,
    loading,
    saveRate,
    removeRate,
    isSaved,
    refetch,
  };
}
