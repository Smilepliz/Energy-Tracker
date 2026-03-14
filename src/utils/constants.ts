import type { Appliance } from '../types/appliance';

export const STORAGE_KEY = 'energy-tracker-appliances';
export const CUSTOM_CATALOG_STORAGE_KEY = 'energy-tracker-custom-catalog';
export const REMOVED_CATALOG_IDS_KEY = 'energy-tracker-removed-catalog-ids';
export const TARIFF_STORAGE_KEY = 'energy-tracker-tariff';

/** Тариф по умолчанию (₽ за 1 кВт·ч) */
export const DEFAULT_TARIFF_RUB = 5.5;

export const DEMO_APPLIANCES: Appliance[] = [
  { id: 'demo-1', name: 'Холодильник', powerW: 150, count: 1, hoursPerDay: 24, category: 'kitchen' },
  { id: 'demo-2', name: 'Компьютер', powerW: 200, count: 1, hoursPerDay: 8, category: 'computers' },
  { id: 'demo-3', name: 'Телевизор', powerW: 100, count: 1, hoursPerDay: 4, category: 'entertainment' },
  { id: 'demo-4', name: 'Освещение', powerW: 60, count: 5, hoursPerDay: 5, category: 'lighting' },
];
