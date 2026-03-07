import type { Appliance } from '../types/appliance';

/** Потребление за день по одному прибору (кВт·ч) */
export function dailyConsumptionKwh(appliance: Appliance): number {
  return (appliance.powerW * appliance.count * appliance.hoursPerDay) / 1000;
}

/** Потребление за месяц по одному прибору (кВт·ч) */
export function monthlyConsumptionKwh(appliance: Appliance): number {
  return dailyConsumptionKwh(appliance) * 30;
}

/** Суммарное потребление за день по списку приборов (кВт·ч) */
export function totalDailyKwh(appliances: Appliance[]): number {
  return appliances.reduce((sum, a) => sum + dailyConsumptionKwh(a), 0);
}

/** Суммарное потребление за неделю (кВт·ч) */
export function totalWeeklyKwh(appliances: Appliance[]): number {
  return totalDailyKwh(appliances) * 7;
}

/** Суммарное потребление за месяц (кВт·ч) */
export function totalMonthlyKwh(appliances: Appliance[]): number {
  return totalDailyKwh(appliances) * 30;
}

/** Потребление за период (дней) по одному прибору (кВт·ч) */
export function consumptionForDays(appliance: Appliance, days: number): number {
  return dailyConsumptionKwh(appliance) * days;
}
