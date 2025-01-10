'use client';

import { ModalForm, ProFormText, ProFormDigit, ProFormTextArea, ProFormRadio, ProFormUploadButton, ProForm } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';

type Props = {
  initialValues?: any;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export default function EditForm({ initialValues, onSuccess, open, onOpenChange, title }: Props) {
  const handleSubmit = async (values: any) => {
    try {
      if (initialValues) {
        // Update existing
        const response = await axios.put(`/api/admin/gift-card-packages/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update gift card package');
        }
        message.success('礼品卡套餐更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/gift-card-packages', values);
        if (response.status !== 200) {
          throw new Error('Failed to create gift card package');
        }
        message.success('礼品卡套餐创建成功');
        onSuccess();
        return false;
      }
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };
  useEffect(() => {
    if (initialValues) {
      console.log('initialValues', initialValues);
    }
  }, [initialValues]);
  return (
    <ModalForm
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={{
        ...initialValues,
        status: initialValues?.status || 'ENABLED',
        price: initialValues?.price || 0.1,
        duration: initialValues?.duration || 1
      }}
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
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormText
        name="subtitle"
        label="副标题"
        placeholder="请输入副标题"
      />
      <ProFormUploadButton
        name="cover"
        label="封面图"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        action="/api/admin/upload"
        extra="请上传封面图片"
        transform={(value) => {
          if (value && value.length > 0) {
            return value[0]?.response?.url || value[0].url;
          }
          return null;
        }}
      />
      <ProForm.Group>
        <ProFormDigit
          name="price"
          label="价格"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入价格' }]}
          transform={(value) => Number(value)}
        />
        <ProFormDigit
          name="duration"
          label="有效期(天)"
          min={1}
          fieldProps={{ precision: 0 }}
          transform={(value) => Number(value)}
          rules={[{ required: true, message: '请输入有效期' }]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
          options={[
            { label: '启用', value: 'ENABLED' },
            { label: '禁用', value: 'DISABLED' }
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
}