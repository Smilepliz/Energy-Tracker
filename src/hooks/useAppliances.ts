import { useState, useCallback, useEffect } from 'react';
import type { Appliance } from '../types/appliance';
import { STORAGE_KEY, DEMO_APPLIANCES } from '../utils/constants';

function loadFromStorage(): Appliance[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as Appliance[]).map((a) => ({
      ...a,
      category: a.category ?? 'other',
    }));
  } catch {
    return [];
  }
}

function saveToStorage(appliances: Appliance[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances));
}

export function useAppliances() {
  const [appliances, setAppliances] = useState<Appliance[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(appliances);
  }, [appliances]);

  const addAppliance = useCallback((appliance: Omit<Appliance, 'id'>) => {
    const newOne: Appliance = {
      ...appliance,
      id: crypto.randomUUID(),
    };
    setAppliances((prev) => [...prev, newOne]);
  }, []);

  const updateAppliance = useCallback((id: string, data: Partial<Omit<Appliance, 'id'>>) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  }, []);

  const removeAppliance = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const resetToDemo = useCallback(() => {
    setAppliances([...DEMO_APPLIANCES]);
  }, []);

  return {
    appliances,
    setAppliances,
    addAppliance,
    updateAppliance,
    removeAppliance,
    resetToDemo,
  };
}
