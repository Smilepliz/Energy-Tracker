import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { CATEGORY_LABELS, type CatalogCategoryKey } from '../data/catalog';

export type ApplianceFormValues = {
  category?: CatalogCategoryKey;
  name: string;
  powerW: number;
  count: number;
  hoursPerDay: number;
};

export interface ApplianceModalInitialValues {
  category?: CatalogCategoryKey;
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
        category: initialValues?.category,
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
    const category = formValues.category ?? initialValues?.category ?? 'other';
    const values: ApplianceFormValues =
      isEditMode && !editingId
        ? {
            ...formValues,
            category,
            count: initialValues?.count ?? DEFAULT_VALUES.count,
            hoursPerDay: initialValues?.hoursPerDay ?? DEFAULT_VALUES.hoursPerDay,
          }
        : { ...formValues, category };
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
          <Form.Item
            name="category"
            label="Выбрать категорию"
            help="Прибор появится в каталоге и в списке на странице «Приборы»"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select
              placeholder="Например: Кухня"
              allowClear={false}
              options={(Object.entries(CATEGORY_LABELS) as [CatalogCategoryKey, string][]).map(([key, label]) => ({
                value: key,
                label,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
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
