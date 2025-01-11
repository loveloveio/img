'use client';

import { ModalForm, ProFormText, ProFormDigit, ProFormTextArea, ProFormCheckbox, ProFormInstance } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
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
        const response = await axios.put(`/api/admin/tags/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update tag');
        }
        message.success('标签更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/tags', values);
        if (response.status !== 200) {
          throw new Error('Failed to create tag');
        }
        message.success('标签创建成功');
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
        allowDevices: initialValues?.allowDevices || ['DESKTOP', 'PHONE', 'TABLET']
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
      <ProFormTextArea
        name="keywords"
        label="关键词"
        rules={[{ required: true, message: '请输入关键词' }]}
        placeholder="请输入关键词，多个关键词用英文逗号分隔"
        fieldProps={{ rows: 3 }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        min={0}
        fieldProps={{ precision: 0 }}
      />
      <ProFormCheckbox.Group
        name="allowDevices"
        label="允许设备"
        options={[
          { label: '桌面端', value: 'DESKTOP' },
          { label: '手机', value: 'PHONE' },
          { label: '平板', value: 'TABLET' }
        ]}
      />
    </ModalForm>
  );
}