import { useState } from 'react';
import { Button, Table, Space, Card, Statistic, Typography, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Appliance } from '../types/appliance';
import { useAppliances } from '../hooks/useAppliances';
import {
  totalDailyKwh,
  totalWeeklyKwh,
  totalMonthlyKwh,
  monthlyConsumptionKwh,
  kwhToRub,
} from '../utils/calculations';
import { useTariff } from '../hooks/useTariff';
import ApplianceModal from '../components/ApplianceModal';
import type { ApplianceModalInitialValues } from '../components/ApplianceModal';

export default function AppliancesPage() {
  const { appliances, addAppliance, updateAppliance, removeAppliance, resetToDemo } = useAppliances();
  const { tariff, setTariff } = useTariff();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalInitialValues, setModalInitialValues] = useState<ApplianceModalInitialValues | undefined>(undefined);

  const openAdd = () => {
    setEditingId(null);
    setModalInitialValues(undefined);
    setModalOpen(true);
  };

  const openEdit = (record: Appliance) => {
    setEditingId(record.id);
    setModalInitialValues({
      category: record.category,
      name: record.name,
      powerW: record.powerW,
      count: record.count,
      hoursPerDay: record.hoursPerDay,
    });
    setModalOpen(true);
  };

  const handleSave = (values: { category?: string; name: string; powerW: number; count: number; hoursPerDay: number }, id?: string | null) => {
    if (id) {
      updateAppliance(id, values);
    } else {
      addAppliance(values);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    removeAppliance(id);
  };

  const dayKwh = totalDailyKwh(appliances);
  const weekKwh = totalWeeklyKwh(appliances);
  const monthKwh = totalMonthlyKwh(appliances);
  const dayRub = kwhToRub(dayKwh, tariff);
  const weekRub = kwhToRub(weekKwh, tariff);
  const monthRub = kwhToRub(monthKwh, tariff);

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Мощность (Вт)', dataIndex: 'powerW', key: 'powerW', width: 120 },
    { title: 'Количество (шт)', dataIndex: 'count', key: 'count', width: 120 },
    { title: 'Часов в день', dataIndex: 'hoursPerDay', key: 'hoursPerDay', width: 120 },
    {
      title: 'За месяц (кВт·ч)',
      key: 'monthlyKwh',
      width: 140,
      render: (_: unknown, record: Appliance) => monthlyConsumptionKwh(record).toFixed(2),
    },
    {
      title: 'За месяц (₽)',
      key: 'monthlyRub',
      width: 120,
      render: (_: unknown, record: Appliance) =>
        kwhToRub(monthlyConsumptionKwh(record), tariff).toFixed(2),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 160,
      render: (_: unknown, record: Appliance) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Редактировать
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Мои электроприборы</h1>

      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Добавить прибор
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetToDemo}>
          Сбросить всё
        </Button>
        <Typography.Text>Тариф: </Typography.Text>
        <InputNumber
          min={0}
          step={0.1}
          value={tariff}
          onChange={(v) => setTariff(v ?? 0)}
          addonAfter="₽/кВт·ч"
          style={{ width: 140 }}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={appliances}
        pagination={false}
        style={{ marginBottom: 24 }}
      />

      <Space size="large" wrap className="stats-space-fill" style={{ width: '100%' }}>
        <Card style={{ flex: 1, minWidth: 160 }}>
          <Statistic title="За день (кВт·ч)" value={dayKwh.toFixed(2)} />
          <Typography.Text type="secondary">≈ {dayRub.toFixed(2)} ₽</Typography.Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 160 }}>
          <Statistic title="За неделю (кВт·ч)" value={weekKwh.toFixed(2)} />
          <Typography.Text type="secondary">≈ {weekRub.toFixed(2)} ₽</Typography.Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 160 }}>
          <Statistic title="За месяц (кВт·ч)" value={monthKwh.toFixed(2)} />
          <Typography.Text type="secondary">≈ {monthRub.toFixed(2)} ₽</Typography.Text>
        </Card>
      </Space>

      <ApplianceModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialValues={modalInitialValues}
        editingId={editingId}
        showCatalogSelect={!editingId}
      />
    </>
  );
}
