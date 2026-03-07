import type { Appliance } from '../types/appliance';

export const STORAGE_KEY = 'energy-tracker-appliances';

export const DEMO_APPLIANCES: Appliance[] = [
  { id: 'demo-1', name: 'Холодильник', powerW: 150, count: 1, hoursPerDay: 24 },
  { id: 'demo-2', name: 'Компьютер', powerW: 200, count: 1, hoursPerDay: 8 },
  { id: 'demo-3', name: 'Телевизор', powerW: 100, count: 1, hoursPerDay: 4 },
  { id: 'demo-4', name: 'Освещение', powerW: 60, count: 5, hoursPerDay: 5 },
];
