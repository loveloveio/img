'use client';

import { ModalForm, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';

type Props = {
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export default function EditForm({ onSuccess, open, onOpenChange, title }: Props) {
  const handleSubmit = async (values: any) => {
    try {
      console.log(values);
      const response = await axios.post('/api/admin/gift-cards/batch-create', values);
      if (response.status !== 200) {
        throw new Error('Failed to create gift card');
      }
      message.success('礼品卡创建成功');
      onSuccess();
      return false;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };
  return (
    <ModalForm
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }
      }}
      submitter={{
        searchConfig: { submitText: '保存' },
        resetButtonProps: { style: { display: 'none' } },
      }}
    >
      <ProFormSelect
        name="giftCardPackageId"
        label="礼品卡套餐"
        request={async () => {
          const response = await axios.get('/api/admin/gift-card-packages');
          return response.data.data.list.map((item: any) => ({
            label: item.title,
            value: item.id,
          }));
        }}
        rules={[{ required: true, message: '请选择礼品卡套餐' }]}
      />
      <ProFormDigit
        name="count"
        label="数量"
        placeholder="请输入数量"
        rules={[{ required: true, message: '请输入数量' }]}
        min={1}
        max={10000}
        fieldProps={{ precision: 0 }}
        transform={(value) => Number(value)}
      />
    </ModalForm>
  );
}