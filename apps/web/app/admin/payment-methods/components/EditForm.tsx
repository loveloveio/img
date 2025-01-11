'use client';

import { ModalForm, ProFormText, ProFormRadio, ProFormUploadButton, ProFormTextArea, ProFormInstance } from '@ant-design/pro-components';
import { useRouter } from 'next/navigation';

import { PaymentMethodStatus } from '@prisma/client';
import {toast} from 'react-hot-toast';
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
      console.log('values',values);
      // TODO: Implement API call
      if (initialValues) {
        await axios.put(`/api/admin/payment-methods/${initialValues.id}`, values);
        toast.success('修改成功');
        onSuccess();
      } else {
        await axios.post('/api/admin/payment-methods', values);
        toast.success('新增成功');
        onSuccess();
      }
      return false;
    } catch (error) {
      toast.error('操作失败');
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
        status: initialValues?.status || PaymentMethodStatus.ENABLED,
        driver: initialValues?.driver || 'ALIPAY',
      }}
      onFinish={handleSubmit}
      modalProps={{ destroyOnClose: true }}
      submitter={{
        searchConfig: { submitText: '保存' },
        resetButtonProps: { style: { display: 'none' } },
      }}
    >
      <ProFormText
        name="name"
        label="名称"
        rules={[{ required: true, message: '请输入支付方法名称' }]}
      />
      <ProFormUploadButton
        name="icon"
        label="图标"
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
          return value;
        }}
        rules={[{ required: true, message: '请上传图标' }]}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <ProFormRadio.Group
          name="driver"
          label="支付驱动"
          options={[
            { label: '支付宝', value: 'ALIPAY' },
            { label: '微信', value: 'WECHAT' },
          ]}
          rules={[{ required: true, message: '请选择支付驱动' }]}
        />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            { label: '启用', value: PaymentMethodStatus.ENABLED },
            { label: '禁用', value: PaymentMethodStatus.DISABLED },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
      </div>
      <ProFormTextArea
        name="config"
        label="配置"
        placeholder="请输入JSON格式的配置"
        rules={[
          { required: true, message: '请输入配置' },
          {
            validator: (_, value) => {
              try {
                if (value) {
                  JSON.parse(value);
                }
                return Promise.resolve();
              } catch (error) {
                return Promise.reject('请输入有效的JSON格式');
              }
            },
          },
        ]}
      />
    </ModalForm>
  );
}