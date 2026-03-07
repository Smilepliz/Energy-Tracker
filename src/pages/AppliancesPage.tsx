import { useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Space, Card, Statistic, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Appliance } from '../types/appliance';
import { useAppliances } from '../hooks/useAppliances';
import { APPLIANCES_CATALOG } from '../data/appliancesCatalog';
import {
  totalDailyKwh,
  totalWeeklyKwh,
  totalMonthlyKwh,
  monthlyConsumptionKwh,
  kwhToRub,
} from '../utils/calculations';
import { useTariff } from '../hooks/useTariff';

type FormValues = {
  name: string;
  powerW: number;
  count: number;
  hoursPerDay: number;
};

const initialForm: FormValues = {
  name: '',
  powerW: 100,
  count: 1,
  hoursPerDay: 4,
};

export default function AppliancesPage() {
  const { appliances, addAppliance, updateAppliance, removeAppliance, resetToDemo } = useAppliances();
  const { tariff, setTariff } = useTariff();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm<FormValues>();

  const openAdd = () => {
    setEditingId(null);
    form.setFieldsValue(initialForm);
    setModalOpen(true);
  };

  const openEdit = (record: Appliance) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      powerW: record.powerW,
      count: record.count,
      hoursPerDay: record.hoursPerDay,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editingId) {
      updateAppliance(editingId, values);
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

      <Modal
        title={editingId ? 'Редактировать прибор' : 'Добавить прибор'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="Выбрать из каталога">
            <Select
              placeholder="Найти устройство по названию..."
              showSearch
              allowClear
              optionFilterProp="label"
              options={APPLIANCES_CATALOG.map((d) => ({
                value: d.name,
                label: `${d.name} — ${d.power} Вт`,
              }))}
              onChange={(value) => {
                const device = APPLIANCES_CATALOG.find((d) => d.name === value);
                if (device) {
                  form.setFieldsValue({ name: device.name, powerW: device.power });
                }
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Например: Холодильник или выберите выше" />
          </Form.Item>
          <Form.Item
            name="powerW"
            label="Мощность (Вт)"
            rules={[
              { required: true, message: 'Введите мощность' },
              { type: 'number', min: 0.01, message: 'Мощность должна быть больше 0' },
            ]}
          >
            <InputNumber min={0.01} step={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="count"
            label="Количество (шт)"
            rules={[
              { required: true, message: 'Введите количество' },
              { type: 'integer', min: 1, message: 'Минимум 1' },
            ]}
          >
            <InputNumber min={1} step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="hoursPerDay"
            label="Часов в день"
            rules={[
              { required: true, message: 'Введите часы' },
              { type: 'number', min: 0, max: 24, message: 'От 0 до 24' },
            ]}
          >
            <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
