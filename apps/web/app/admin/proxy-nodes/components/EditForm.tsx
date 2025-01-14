'use client';

import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormInstance, ProFormSwitch, ProFormRadio, ProForm } from '@ant-design/pro-components';
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
        const response = await axios.put(`/api/admin/proxy-nodes/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update proxy node');
        }
        message.success('代理节点更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/proxy-nodes', values);
        if (response.status !== 200) {
          throw new Error('Failed to create proxy node');
        }
        message.success('代理节点创建成功');
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
        status: initialValues?.status || 'ENABLED',
        free: initialValues?.free || false
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
        name="url"
        label="URL"
        rules={[{ required: true, message: '请输入URL' }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3 }}
      />
      <ProForm.Group>
        <ProFormSwitch name="free" label="免费" fieldProps={{checkedChildren: '免费',unCheckedChildren: '付费'}} rules={[{ required: true, message: '请选择是否免费' }]}/>
        <ProFormSwitch name="status" label="状态" fieldProps={{checkedChildren: '启用',unCheckedChildren: '禁用'}} transform={(value) => value ? 'ENABLED' : 'DISABLED'} rules={[{ required: true, message: '请选择状态' }]}/>
      </ProForm.Group>
    </ModalForm>
  );
}