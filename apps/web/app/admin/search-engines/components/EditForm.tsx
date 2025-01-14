'use client';

import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormInstance, ProFormUploadButton, ProFormDigit } from '@ant-design/pro-components';
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
        console.log("values####",values)
        const response = await axios.put(`/api/admin/search-engines/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update search engine');
        }
        message.success('搜索引擎更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/search-engines', values);
        if (response.status !== 200) {
          throw new Error('Failed to create search engine');
        }
        message.success('搜索引擎创建成功');
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
      <ProFormUploadButton
        name="icon"
        label="图标"
        rules={[{ required: true, message: '请上传图标' }]}
        max={1}
        accept=".png,.jpg,.jpeg,.svg,.webp"
        fieldProps={{
          listType: 'picture-card',
        }}
        onChange={(value) => {
          console.log("value####",value)
        }}
        action="/api/admin/upload"
        transform={(value) => {
          console.log("value####",value)
          return {
            icon: value[0]?.response?.url ?? value[0]?.url
          };
        }}
      />
      <ProFormText
        name="name" 
        label="名称"
        rules={[{ required: true, message: '请输入名称' }]}
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
      <ProFormDigit
        name="sort"
        label="排序"

        placeholder="请输入排序"
        rules={[{ required: true, message: '请输入排序' }]}
        transform={(value) => {
          return Number(value)
        }}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '启用', value: 'ENABLED' },
          { label: '禁用', value: 'DISABLED' }
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
    </ModalForm>
  );
}