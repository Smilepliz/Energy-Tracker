import { useState, useCallback, useEffect } from 'react';
import { REMOVED_CATALOG_IDS_KEY } from '../utils/constants';

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(REMOVED_CATALOG_IDS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed as string[]);
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>): void {
  localStorage.setItem(REMOVED_CATALOG_IDS_KEY, JSON.stringify([...ids]));
}

export function useRemovedCatalogIds() {
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(removedIds);
  }, [removedIds]);

  const addRemoved = useCallback((id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  }, []);

  return { removedIds, addRemoved };
}
