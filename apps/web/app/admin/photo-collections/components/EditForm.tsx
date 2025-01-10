'use client';

import { ModalForm, ProFormText, ProFormRadio, ProFormUploadButton, ProFormDigit, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import axios from 'axios';

import { PaymentMethodStatus } from '@prisma/client';

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
        const response = await axios.put(`/api/admin/photo-collections/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update photo collection');
        }
        message.success('Photo collection updated successfully');
        onSuccess();
        return false; // 阻止表单提交
      } else {
        const response = await axios.post('/api/admin/photo-collections', values);

        if (response.status !== 200) {
          throw new Error('Failed to create photo collection');
        }
        message.success('Photo collection saved successfully');
        onSuccess();
        return false;
      }
    } catch (error) {
      message.error('Failed to save photo collection');
      return false;
    }
  };

  return (
    <ModalForm
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={{
        ...initialValues,
        status: initialValues?.status || PaymentMethodStatus.ENABLED,
        sort: initialValues?.sort || 0,
        recommend: initialValues?.recommend || false,
        tags: initialValues?.tags || [],
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
      />
      <ProFormTextArea
        name="description"
        label="描述"
      />
      <ProFormSelect
        name="tags"
        label="标签"
        mode="tags"
      />
      <ProFormUploadButton
        name="cover"
        label="封面"
        max={1}
        action="/api/admin/upload"
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        transform={(value) => {
          if (value && value[0]) {
            return value[0]?.response?.url || value[0]?.url;
          }
          return '';
        }}
        rules={[{ required: true, message: '请上传封面图片' }]}
      />
      <ProFormUploadButton
        name="previewImages"
        label="预览图列表"
        max={100}
        action="/api/admin/upload"
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          multiple: true
        }}
        transform={(value) => {
          if (!value) return [];
          return {
            previewImages: value.map((item: any) => (item?.response?.url || item?.url))
          }
        }}
        rules={[{ required: true, message: '请上传预览图片' }]}
      />
      <ProFormUploadButton
        name="paidImages"
        label="付费图列表"
        max={100}
        action="/api/admin/upload"
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          multiple: true,
        }}
        transform={(value) => {
          if (!value) return [];
          return {
            paidImages: value.map((item: any) => (item?.response?.url || item?.url))
          }
        }}
        rules={[{ required: true, message: '请上传付费图片' }]}
      />
      <div style={{ display: 'flex', gap: '16px' }}>
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            { label: '启用', value: PaymentMethodStatus.ENABLED },
            { label: '禁用', value: PaymentMethodStatus.DISABLED },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormRadio.Group
          name="recommend"
          label="推荐"
          options={[
            { label: '是', value: true },
            { label: '否', value: false },
          ]}
          rules={[{ required: true, message: '请选择是否推荐' }]}
        />
        <ProFormDigit
          name="sort"
          label="排序"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </div>
    </ModalForm>
  );
}