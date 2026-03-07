import { useState, useCallback, useEffect } from 'react';
import { TARIFF_STORAGE_KEY, DEFAULT_TARIFF_RUB } from '../utils/constants';

function loadTariff(): number {
  try {
    const raw = localStorage.getItem(TARIFF_STORAGE_KEY);
    if (raw == null) return DEFAULT_TARIFF_RUB;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_TARIFF_RUB;
  } catch {
    return DEFAULT_TARIFF_RUB;
  }
}

function saveTariff(value: number): void {
  localStorage.setItem(TARIFF_STORAGE_KEY, String(value));
}

export function useTariff() {
  const [tariff, setTariffState] = useState<number>(() => loadTariff());

  useEffect(() => {
    saveTariff(tariff);
  }, [tariff]);

  const setTariff = useCallback((value: number) => {
    setTariffState((prev) => (value >= 0 ? value : prev));
  }, []);

  return { tariff, setTariff };
}
