import type { CatalogCategoryKey } from '../data/catalog';

export interface Appliance {
  id: string;
  name: string;
  powerW: number;
  count: number;
  hoursPerDay: number;
  /** Категория прибора (Кухня, Компьютеры и офис и т.д.) */
  category?: CatalogCategoryKey;
}
