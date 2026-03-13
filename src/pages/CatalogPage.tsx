import { useState, useMemo, useRef } from 'react';
import { Input, Tabs, Card, Button, Row, Col, Empty, Space, Typography, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { catalogData, CATEGORY_LABELS, type CatalogItem, type CatalogCategoryKey } from '../data/catalog';
import { useTariff } from '../hooks/useTariff';
import { useAppliances } from '../hooks/useAppliances';
import { DEFAULT_TARIFF_RUB } from '../utils/constants';
import ApplianceModal from '../components/ApplianceModal';
import type { ApplianceModalInitialValues } from '../components/ApplianceModal';

const { Text } = Typography;

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'Все' },
  ...(Object.entries(CATEGORY_LABELS) as [CatalogCategoryKey, string][]).map(([key, label]) => ({ key, label })),
];

function monthlyCostRub(powerW: number, hoursPerDay: number, tariff: number): number {
  return Math.round((powerW / 1000) * hoursPerDay * 30 * tariff);
}

export default function CatalogPage() {
  const { tariff } = useTariff();
  const { addAppliance } = useAppliances();
  const tariffForCalc = tariff >= 0 ? tariff : DEFAULT_TARIFF_RUB;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState<ApplianceModalInitialValues | undefined>(undefined);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalName, setSuccessModalName] = useState('');
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredItems = useMemo(() => {
    let list = activeCategory === 'all'
      ? catalogData
      : catalogData.filter((item) => item.category === activeCategory);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, searchQuery]);

  const handleQuickAdd = (item: CatalogItem) => {
    addAppliance({
      name: item.name,
      powerW: item.power,
      count: 1,
      hoursPerDay: item.typicalHoursPerDay,
    });
    setSuccessModalName(item.name);
    setSuccessModalVisible(true);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    setLastAddedId(item.id);
    highlightTimeoutRef.current = setTimeout(() => {
      setLastAddedId(null);
      highlightTimeoutRef.current = null;
    }, 1500);
  };

  const openEditModal = (item: CatalogItem) => {
    setModalInitialValues({
      name: item.name,
      powerW: item.power,
      count: 1,
      hoursPerDay: item.typicalHoursPerDay,
    });
    setModalOpen(true);
  };

  const openAddCustom = () => {
    setModalInitialValues(undefined);
    setModalOpen(true);
  };

  const handleModalSave = (values: { name: string; powerW: number; count: number; hoursPerDay: number }) => {
    addAppliance(values);
    setModalOpen(false);
  };

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Каталог приборов</h1>

      <Space size={24} wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Найти прибор..."
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddCustom}>
          Добавить свой прибор
        </Button>
      </Space>

      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        items={CATEGORY_TABS.map(({ key, label }) => ({ key, label }))}
        style={{ marginBottom: 16 }}
      />

      {filteredItems.length === 0 ? (
        <Empty description="Ничего не найдено" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredItems.map((item) => (
            <Col xs={24} sm={12} key={item.id}>
              <Card title={item.name} size="small" style={{ height: '100%' }}>
                <p>
                  <Text strong>{item.power} Вт</Text>
                  {item.description != null && (
                    <Text type="secondary"> ({item.description})</Text>
                  )}
                </p>
                <p>≈ {monthlyCostRub(item.power, item.typicalHoursPerDay, tariffForCalc)} ₽/мес</p>
                <Space size="middle" style={{ marginTop: 12 }}>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => handleQuickAdd(item)}
                    style={
                      lastAddedId === item.id
                        ? { borderColor: '#52c41a', backgroundColor: '#52c41a', color: '#fff' }
                        : undefined
                    }
                  >
                    Добавить прибор
                  </Button>
                  <Button size="middle" onClick={() => openEditModal(item)}>
                    Редактировать прибор
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ApplianceModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initialValues={modalInitialValues}
        showCatalogSelect={!modalInitialValues}
      />

      <Modal
        title="Прибор добавлен"
        open={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        onOk={() => setSuccessModalVisible(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText="ОК"
      >
        <p>{successModalName} успешно добавлен.</p>
      </Modal>
    </>
  );
}
