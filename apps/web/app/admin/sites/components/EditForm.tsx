'use client';

import { ModalForm, ProFormText, ProFormDigit, ProFormTextArea, ProFormSelect, ProForm, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
import ImgCrop from 'antd-img-crop';
type Props = {
  initialValues?: any;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export default function EditForm({ initialValues, onSuccess, open, onOpenChange, title }: Props) {
  const formRef = useRef<ProFormInstance>();
  const handleSubmit = async (values: any) => {
    try {
      if (initialValues) {
        // Update existing
        const response = await axios.put(`/api/admin/sites/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update site');
        }
        message.success('站点更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/sites', values);
        if (response.status !== 200) {
          throw new Error('Failed to create site');
        }
        message.success('站点创建成功');
        onSuccess();
        return false;
      }
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  return (
    <ModalForm
      title={title}
      open={open}
      formRef={formRef}
      onOpenChange={(state) => {
        onOpenChange(state);
        if (!state) {
          formRef.current?.resetFields();
        }
      }}
      initialValues={{
        ...initialValues,
        sort: initialValues?.sort || 0,
        status: initialValues?.status || 'ENABLED'
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
        name="name"
        label="名称"
        rules={[{ required: true, message: '请输入名称' }]}
      />
      <ProFormText
        name="url"
        label="URL"
        rules={[
          { required: true, message: '请输入URL' },
          { type: 'url', message: '请输入有效的URL' }
        ]}
      />
      <ProFormUploadButton
        name="icon"
        label="图标"
        max={1}
        action="/api/admin/upload"
        fieldProps={{
          accept: '.png,.jpg,.jpeg,.svg',
          listType: 'picture-card'
        }}
        transform={(value) => {
          return value[0]?.response?.url || value[0]?.url
        }}
        rules={[{ required: true, message: '请上传图标' }]}
      />
      <ProFormTextArea
        name="description"
        label="描述"
        fieldProps={{ rows: 3 }}
      />
      <ProFormSelect
        mode="tags"
        name="tags"
        label="标签"
      />
      <ProForm.Group>
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 'ENABLED' },
            { label: '禁用', value: 'DISABLED' }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormDigit
          name="sort"
          label="排序"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </ProForm.Group>
    </ModalForm>
  );
}