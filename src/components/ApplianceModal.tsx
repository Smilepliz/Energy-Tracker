import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Divider } from 'antd';
import { APPLIANCES_CATALOG } from '../data/appliancesCatalog';

export type ApplianceFormValues = {
  name: string;
  powerW: number;
  count: number;
  hoursPerDay: number;
};

export interface ApplianceModalInitialValues {
  name?: string;
  powerW?: number;
  count?: number;
  hoursPerDay?: number;
}

const DEFAULT_VALUES: ApplianceFormValues = {
  name: '',
  powerW: 100,
  count: 1,
  hoursPerDay: 4,
};

interface ApplianceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: ApplianceFormValues, editingId?: string | null) => void;
  initialValues?: ApplianceModalInitialValues;
  editingId?: string | null;
  showCatalogSelect?: boolean;
}

export default function ApplianceModal({
  visible,
  onClose,
  onSave,
  initialValues,
  editingId = null,
  showCatalogSelect = true,
}: ApplianceModalProps) {
  const [form] = Form.useForm<ApplianceFormValues>();

  useEffect(() => {
    if (visible) {
      const values: ApplianceFormValues = {
        name: initialValues?.name ?? DEFAULT_VALUES.name,
        powerW: initialValues?.powerW ?? DEFAULT_VALUES.powerW,
        count: initialValues?.count ?? DEFAULT_VALUES.count,
        hoursPerDay: initialValues?.hoursPerDay ?? DEFAULT_VALUES.hoursPerDay,
      };
      form.setFieldsValue(values);
    }
  }, [visible, initialValues, form]);

  const isEditMode = Boolean(editingId) || Boolean(initialValues?.name);
  /** Скрывать количество и часы только при открытии из каталога («Редактировать прибор»), не при редактировании в таблице */
  const showCountAndHours = Boolean(editingId) || !isEditMode;

  const handleOk = async () => {
    const formValues = await form.validateFields();
    const values: ApplianceFormValues =
      isEditMode && !editingId
        ? {
            ...formValues,
            count: initialValues?.count ?? DEFAULT_VALUES.count,
            hoursPerDay: initialValues?.hoursPerDay ?? DEFAULT_VALUES.hoursPerDay,
          }
        : formValues;
    onSave(values, editingId);
    onClose();
  };

  return (
    <Modal
      title={isEditMode ? 'Редактировать прибор' : 'Добавить прибор'}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        {showCatalogSelect && (
          <>
            <Form.Item
              label="Выбрать из каталога"
              help="Выберите устройство — название и мощность подставятся автоматически"
            >
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
            <Divider plain style={{ margin: '12px 0' }}>Или введите вручную</Divider>
          </>
        )}
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
        {showCountAndHours && (
          <>
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
          </>
        )}
      </Form>
    </Modal>
  );
}
