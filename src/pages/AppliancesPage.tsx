import { useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Space, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Appliance } from '../types/appliance';
import { useAppliances } from '../hooks/useAppliances';
import {
  totalDailyKwh,
  totalWeeklyKwh,
  totalMonthlyKwh,
  monthlyConsumptionKwh,
} from '../utils/calculations';

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

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Мощность (Вт)', dataIndex: 'powerW', key: 'powerW', width: 120 },
    { title: 'Количество (шт)', dataIndex: 'count', key: 'count', width: 120 },
    { title: 'Часов в день', dataIndex: 'hoursPerDay', key: 'hoursPerDay', width: 120 },
    {
      title: 'Потребление за месяц (кВт·ч)',
      key: 'monthly',
      width: 200,
      render: (_: unknown, record: Appliance) => monthlyConsumptionKwh(record).toFixed(2),
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

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Добавить прибор
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetToDemo}>
          Сбросить всё
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={appliances}
        pagination={false}
        style={{ marginBottom: 24 }}
      />

      <Space size="large" wrap>
        <Card>
          <Statistic title="За день (кВт·ч)" value={dayKwh.toFixed(2)} />
        </Card>
        <Card>
          <Statistic title="За неделю (кВт·ч)" value={weekKwh.toFixed(2)} />
        </Card>
        <Card>
          <Statistic title="За месяц (кВт·ч)" value={monthKwh.toFixed(2)} />
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
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Например: Холодильник" />
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
