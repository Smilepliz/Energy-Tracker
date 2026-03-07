/**
 * Каталог устройств с типовой мощностью (Вт).
 * Позволяет выбирать устройство из списка, если пользователь не знает мощность.
 */
export interface CatalogDevice {
  name: string;
  power: number;
}

export const APPLIANCES_CATALOG: CatalogDevice[] = [
  { name: 'Desktop PC', power: 300 },
  { name: 'Gaming PC', power: 500 },
  { name: 'Laptop', power: 60 },
  { name: 'Monitor', power: 30 },
  { name: 'Router', power: 10 },
  { name: 'Refrigerator', power: 150 },
  { name: 'Freezer', power: 200 },
  { name: 'Dishwasher', power: 1800 },
  { name: 'Washing Machine', power: 2000 },
  { name: 'Dryer', power: 3000 },
  { name: 'Electric Oven', power: 2400 },
  { name: 'Microwave', power: 1200 },
  { name: 'Electric Kettle', power: 2200 },
  { name: 'Coffee Machine', power: 1000 },
  { name: 'Toaster', power: 800 },
  { name: 'Induction Cooktop', power: 2000 },
  { name: 'Air Fryer', power: 1500 },
  { name: 'TV LED 32"', power: 50 },
  { name: 'TV LED 55"', power: 100 },
  { name: 'TV OLED', power: 120 },
  { name: 'Sound System', power: 80 },
  { name: 'PlayStation', power: 200 },
  { name: 'Xbox', power: 200 },
  { name: 'Nintendo Switch Dock', power: 18 },
  { name: 'Smart Speaker', power: 5 },
  { name: 'LED Bulb', power: 10 },
  { name: 'Halogen Bulb', power: 50 },
  { name: 'Air Conditioner', power: 1500 },
  { name: 'Fan', power: 60 },
  { name: 'Electric Heater', power: 2000 },
  { name: 'Boiler Pump', power: 40 },
  { name: 'Water Pump', power: 750 },
  { name: 'Vacuum Cleaner', power: 1200 },
  { name: 'Hair Dryer', power: 1800 },
  { name: 'Hair Straightener', power: 150 },
  { name: 'Iron', power: 2000 },
  { name: 'Phone Charger', power: 10 },
  { name: 'Tablet Charger', power: 15 },
  { name: 'Printer', power: 50 },
  { name: '3D Printer', power: 250 },
  { name: 'NAS Server', power: 60 },
  { name: 'Home Server', power: 120 },
  { name: 'CCTV Camera', power: 8 },
  { name: 'Security System', power: 15 },
  { name: 'Garage Door Motor', power: 350 },
  { name: 'Garden Pump', power: 800 },
  { name: 'Pool Pump', power: 1500 },
  { name: 'Electric Blanket', power: 100 },
];
