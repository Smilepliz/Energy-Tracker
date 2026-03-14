import { useState, useCallback, useEffect } from 'react';
import type { CatalogCategoryKey } from '../data/catalog';
import { CUSTOM_CATALOG_STORAGE_KEY } from '../utils/constants';

export interface CustomCatalogItem {
  id: string;
  name: string;
  power: number;
  category: CatalogCategoryKey;
  typicalHoursPerDay: number;
}

function loadFromStorage(): CustomCatalogItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATALOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CustomCatalogItem[];
  } catch {
    return [];
  }
}

function saveToStorage(items: CustomCatalogItem[]): void {
  localStorage.setItem(CUSTOM_CATALOG_STORAGE_KEY, JSON.stringify(items));
}

export function useCustomCatalog() {
  const [items, setItems] = useState<CustomCatalogItem[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CustomCatalogItem, 'id'>) => {
    const newOne: CustomCatalogItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    setItems((prev) => [...prev, newOne]);
  }, []);

  const updateItem = useCallback((id: string, data: Partial<Omit<CustomCatalogItem, 'id'>>) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { items, addItem, updateItem, removeItem };
}
