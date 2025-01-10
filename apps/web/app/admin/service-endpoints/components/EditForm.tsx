'use client';

import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import axios from 'axios';

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
        const response = await axios.put(`/api/admin/service-endpoints/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update service endpoint');
        }
        message.success('服务端点更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/service-endpoints', values);
        if (response.status !== 200) {
          throw new Error('Failed to create service endpoint');
        }
        message.success('服务端点创建成功');
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
      onOpenChange={onOpenChange}
      initialValues={{
        ...initialValues,
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
        name="remark"
        label="备注"
      />
      <ProFormText
        name="url"
        fieldProps={{
          placeholder: '请输入地址'
        }}
        label="地址"
        rules={[
          { required: true, message: '请输入地址' },
          { type: 'url', message: '请输入有效的URL' }
        ]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
        options={[
          { label: '启用', value: 'ENABLED' },
          { label: '禁用', value: 'DISABLED' },
        ]}
      />
    </ModalForm>
  );
}