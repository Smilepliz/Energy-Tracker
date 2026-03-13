/**
 * Каталог приборов для страницы "Каталог".
 * category: 'kitchen' | 'computers' | 'entertainment' | 'lighting' | 'climate' | 'cleaning' | 'other'
 */
export type CatalogCategoryKey =
  | 'kitchen'
  | 'computers'
  | 'entertainment'
  | 'lighting'
  | 'climate'
  | 'cleaning'
  | 'other';

export interface CatalogItem {
  id: string;
  name: string;
  power: number;
  category: CatalogCategoryKey;
  typicalHoursPerDay: number;
  description?: string;
}

export const CATEGORY_LABELS: Record<CatalogCategoryKey, string> = {
  kitchen: 'Кухня',
  computers: 'Компьютеры и офис',
  entertainment: 'Развлечения',
  lighting: 'Освещение',
  climate: 'Климат',
  cleaning: 'Уборка и уход',
  other: 'Прочее',
};

export const catalogData: CatalogItem[] = [
  { id: 'fridge', name: 'Холодильник', power: 150, category: 'kitchen', typicalHoursPerDay: 24, description: 'средняя за цикл' },
  { id: 'freezer', name: 'Морозильник', power: 200, category: 'kitchen', typicalHoursPerDay: 24 },
  { id: 'dishwasher', name: 'Посудомоечная машина', power: 1800, category: 'kitchen', typicalHoursPerDay: 1 },
  { id: 'kettle', name: 'Электрочайник', power: 2000, category: 'kitchen', typicalHoursPerDay: 0.5 },
  { id: 'pc_office', name: 'Офисный ПК', power: 300, category: 'computers', typicalHoursPerDay: 8 },
  { id: 'pc_gaming', name: 'Игровой ПК', power: 500, category: 'computers', typicalHoursPerDay: 4 },
  { id: 'laptop', name: 'Ноутбук', power: 60, category: 'computers', typicalHoursPerDay: 5 },
  { id: 'monitor', name: 'Монитор', power: 30, category: 'computers', typicalHoursPerDay: 5 },
  { id: 'router', name: 'Роутер', power: 10, category: 'computers', typicalHoursPerDay: 24 },
  { id: 'tv_led', name: 'Телевизор LED', power: 100, category: 'entertainment', typicalHoursPerDay: 5 },
  { id: 'tv_oled', name: 'Телевизор OLED', power: 150, category: 'entertainment', typicalHoursPerDay: 5 },
  { id: 'console', name: 'Игровая приставка', power: 150, category: 'entertainment', typicalHoursPerDay: 3 },
  { id: 'led_bulb', name: 'Лампа LED', power: 10, category: 'lighting', typicalHoursPerDay: 5 },
  { id: 'incandescent', name: 'Лампа накаливания', power: 60, category: 'lighting', typicalHoursPerDay: 5 },
  { id: 'chandelier', name: 'Люстра (5 ламп LED)', power: 50, category: 'lighting', typicalHoursPerDay: 5, description: '5×10 Вт' },
  { id: 'strip', name: 'Светодиодная лента', power: 5, category: 'lighting', typicalHoursPerDay: 5, description: 'на 1 метр' },
  { id: 'ac', name: 'Кондиционер', power: 1000, category: 'climate', typicalHoursPerDay: 8 },
  { id: 'heater', name: 'Обогреватель', power: 1500, category: 'climate', typicalHoursPerDay: 5 },
  { id: 'fan', name: 'Вентилятор', power: 50, category: 'climate', typicalHoursPerDay: 5 },
  { id: 'vacuum', name: 'Пылесос', power: 1500, category: 'cleaning', typicalHoursPerDay: 0.5 },
  { id: 'iron', name: 'Утюг', power: 2000, category: 'cleaning', typicalHoursPerDay: 0.3 },
  { id: 'washer', name: 'Стиральная машина', power: 2000, category: 'cleaning', typicalHoursPerDay: 0.5 },
  { id: 'dryer', name: 'Сушильная машина', power: 2500, category: 'cleaning', typicalHoursPerDay: 0.5 },
  { id: 'charger', name: 'Зарядка телефона', power: 5, category: 'other', typicalHoursPerDay: 2 },
];
