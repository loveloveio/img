'use client';
import { Form, Input, Button, Layout, Typography, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authClient } from '@/libs/better-client';
import MainLayout from '../components/main-layout';

const { Content } = Layout;
const { Title } = Typography;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) {
      router.push('/member/pc/sign-in');
    }
  }, [session, router]);

  const onFinish = async (values: { 
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        throw new Error('新密码与确认密码不一致');
      }

      const res = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      if (res?.error) {
        throw new Error(res.error.message);
      }

      toast.success('密码修改成功');
      router.push('/member/pc/profile');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '密码修改失败');
    }
  };

  return (
    <MainLayout>
      <Content style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e8e8e8'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          修改密码
        </Title>
        <Form
          name="changePassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[
              { required: true, message: '请输入当前密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 32, message: '密码最长32个字符' }
            ]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 32, message: '密码最长32个字符' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/,
                message: '密码必须包含字母和数字',
              },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>

          <Form.Item>
            <Button block onClick={() => router.push('/member/pc/profile')}>
              返回个人中心
            </Button>
          </Form.Item>
          </Form>
        </Card>
      </Content>
    </MainLayout>
  );
}
