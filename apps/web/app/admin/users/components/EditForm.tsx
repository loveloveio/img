'use client';

import { ModalForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormDateTimePicker, ProForm } from '@ant-design/pro-components';
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
        const response = await axios.put(`/api/admin/users/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update user');
        }
        message.success('用户更新成功');
        onSuccess();
        return false;
      } else {
        const response = await axios.post('/api/admin/users', values);
        if (response.status !== 200) {
          throw new Error('Failed to create user');
        }
        message.success('用户创建成功');
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
        banned: initialValues?.banned || false,
        emailVerified: initialValues?.emailVerified || false,
        vipExpiredAt: initialValues?.vipExpiredAt || null,
        banExpires: initialValues?.banExpires || null,
        banReason: initialValues?.banReason || null,
        role: initialValues?.role || 'user',
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
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      />
      <ProFormText
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        rules={[{ required: true, message: '请输入邮箱' }]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        rules={[
          { required: !initialValues, message: '请输入密码' },
          { min: 8, message: '密码长度不能小于8位' },
          { max: 32, message: '密码长度不能大于32位' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
            message: '密码必须包含大小写字母和数字'
          }
        ]}
      />
      <ProForm.Group>
        <ProFormRadio.Group
          name="emailVerified"
          label="邮箱验证"
          options={[
            { label: '未验证', value: false },
            { label: '已验证', value: true }
          ]}
        />
        <ProFormRadio.Group
          name="role"
          label="角色"
          options={[
            { label: '用户', value: 'user' },
            { label: '管理员', value: 'admin' }
          ]}
        />
        <ProFormRadio.Group
          name="banned"
          label="封禁状态"
          options={[
            { label: '正常', value: false },
            { label: '封禁', value: true }
          ]}
        />
      </ProForm.Group>
      <ProFormDateTimePicker
        name="banExpires"
        label="封禁到期时间"
      />
      <ProFormTextArea
        name="banReason"
        label="封禁原因"
      />

    </ModalForm>
  );
}