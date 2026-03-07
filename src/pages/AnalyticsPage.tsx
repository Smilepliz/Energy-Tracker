import { useMemo, useState } from 'react';
import { Card, Tabs, DatePicker, Button, Space, Statistic } from 'antd';
import { Bar, Column } from '@ant-design/plots';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppliances } from '../hooks/useAppliances';
import {
  totalDailyKwh,
  monthlyConsumptionKwh,
  consumptionForDays,
} from '../utils/calculations';

const { RangePicker } = DatePicker;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function AnalyticsPage() {
  const { appliances } = useAppliances();
  const [period1, setPeriod1] = useState<[Dayjs, Dayjs] | null>(null);
  const [period2, setPeriod2] = useState<[Dayjs, Dayjs] | null>(null);
  const [compared, setCompared] = useState(false);

  const dayKwh = totalDailyKwh(appliances);

  const top5Data = useMemo(() => {
    const withMonthly = appliances.map((a) => ({
      ...a,
      monthlyKwh: monthlyConsumptionKwh(a),
    }));
    return withMonthly
      .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
      .slice(0, 5)
      .map((a) => ({ name: a.name, value: Number(monthlyConsumptionKwh(a).toFixed(2)) }));
  }, [appliances]);

  const dailyChartData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = getDaysInMonth(year, month + 1);
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      kwh: Number(dayKwh.toFixed(2)),
    }));
  }, [dayKwh]);

  const setLastWeek = () => {
    const end = dayjs().subtract(1, 'day');
    const start = end.subtract(6, 'day');
    setPeriod1([start, end]);
    setPeriod2([start.subtract(7, 'day'), end.subtract(7, 'day')]);
    setCompared(true);
  };

  const setLastMonth = () => {
    const end = dayjs().subtract(1, 'day');
    const start = end.subtract(1, 'month').add(1, 'day');
    setPeriod1([start, end]);
    setPeriod2([start.subtract(1, 'month'), end.subtract(1, 'month')]);
    setCompared(true);
  };

  const handleCompare = () => {
    setCompared(true);
  };

  const daysBetween = (start: Dayjs, end: Dayjs): number => {
    return end.diff(start, 'day') + 1;
  };

  const totalPeriodKwh = (start: Dayjs, end: Dayjs): number => {
    return dayKwh * daysBetween(start, end);
  };

  const comparisonResult = useMemo(() => {
    if (!compared || !period1 || !period2 || period1[0] == null || period1[1] == null || period2[0] == null || period2[1] == null) return null;
    const kwh1 = totalPeriodKwh(period1[0], period1[1]);
    const kwh2 = totalPeriodKwh(period2[0], period2[1]);
    const diff = kwh1 - kwh2;
    const percent = kwh2 === 0 ? (kwh1 > 0 ? 100 : 0) : (diff / kwh2) * 100;
    const chart1 = appliances.map((a) => ({
      name: a.name,
      kwh: Number(consumptionForDays(a, daysBetween(period1[0], period1[1])).toFixed(2)),
    }));
    const chart2 = appliances.map((a) => ({
      name: a.name,
      kwh: Number(consumptionForDays(a, daysBetween(period2[0], period2[1])).toFixed(2)),
    }));
    return { kwh1, kwh2, diff, percent, chart1, chart2 };
  }, [compared, period1, period2, appliances, dayKwh]);

  const barConfigTop5 = {
    data: top5Data,
    xField: 'value',
    yField: 'name',
    seriesField: 'name',
    xAxis: { title: { text: 'кВт·ч за месяц' } },
    label: { position: 'right' as const },
  };

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Аналитика</h1>

      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: 'overview',
            label: 'Обзор',
            children: (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title="Топ-5 приборов по потреблению за месяц">
                  {top5Data.length > 0 ? (
                    <div style={{ height: 300 }}>
                      <Bar {...barConfigTop5} />
                    </div>
                  ) : (
                    <p>Добавьте приборы на странице «Приборы».</p>
                  )}
                </Card>
                <Card title="Потребление по дням за текущий месяц">
                  {dailyChartData.length > 0 ? (
                    <div style={{ height: 300 }}>
                      <Column
                        data={dailyChartData}
                        xField="day"
                        yField="kwh"
                        xAxis={{ title: { text: 'День месяца' } }}
                        yAxis={{ title: { text: 'кВт·ч' } }}
                        label={{ position: 'top' }}
                      />
                    </div>
                  ) : (
                    <p>Нет данных.</p>
                  )}
                </Card>
              </Space>
            ),
          },
          {
            key: 'compare',
            label: 'Сравнение периодов',
            children: (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space wrap>
                  <span>Период 1:</span>
                  <RangePicker
                    value={period1 ?? undefined}
                    onChange={(v) => setPeriod1(v && v[0] && v[1] ? [v[0], v[1]] : null)}
                  />
                  <span>Период 2:</span>
                  <RangePicker
                    value={period2 ?? undefined}
                    onChange={(v) => setPeriod2(v && v[0] && v[1] ? [v[0], v[1]] : null)}
                  />
                  <Button type="primary" onClick={handleCompare}>Сравнить</Button>
                  <Button onClick={setLastWeek}>Прошлая неделя</Button>
                  <Button onClick={setLastMonth}>Прошлый месяц</Button>
                </Space>
                {comparisonResult && (
                  <>
                    <Card>
                      <Space size="large">
                        <Statistic title="Период 1 (кВт·ч)" value={comparisonResult.kwh1.toFixed(2)} />
                        <Statistic title="Период 2 (кВт·ч)" value={comparisonResult.kwh2.toFixed(2)} />
                        <Statistic
                          title="Разница (кВт·ч)"
                          value={comparisonResult.diff.toFixed(2)}
                          valueStyle={{ color: comparisonResult.diff >= 0 ? '#cf1322' : '#3f8600' }}
                        />
                        <Statistic
                          title="Разница (%)"
                          value={comparisonResult.percent.toFixed(1)}
                          suffix="%"
                          valueStyle={{ color: comparisonResult.percent >= 0 ? '#cf1322' : '#3f8600' }}
                        />
                      </Space>
                    </Card>
                    <Space align="start" wrap>
                      <Card title="Период 1 — по приборам" style={{ width: 400 }}>
                        <div style={{ height: 300 }}>
                          <Bar
                            data={comparisonResult.chart1}
                            xField="kwh"
                            yField="name"
                            xAxis={{ title: { text: 'кВт·ч' } }}
                            label={{ position: 'right' }}
                          />
                        </div>
                      </Card>
                      <Card title="Период 2 — по приборам" style={{ width: 400 }}>
                        <div style={{ height: 300 }}>
                          <Bar
                            data={comparisonResult.chart2}
                            xField="kwh"
                            yField="name"
                            xAxis={{ title: { text: 'кВт·ч' } }}
                            label={{ position: 'right' }}
                          />
                        </div>
                      </Card>
                    </Space>
                  </>
                )}
              </Space>
            ),
          },
        ]}
      />
    </>
  );
}
