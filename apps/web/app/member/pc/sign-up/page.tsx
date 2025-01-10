'use client';
import { Form, Input, Button, Layout, Typography, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authClient } from '@/libs/better-client';
import { z } from 'zod';

const { Content } = Layout;
const { Title } = Typography;

const signUpSchema = z.object({
  username: z.string()
    .min(3, "用户名至少3个字符")
    .max(18, '用户名最长18个字符'),
  password: z.string()
    .min(6, "密码至少6个字符")
    .max(32, "密码最长32个字符")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/, "密码必须包含字母和数字"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"]
});

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.back();
    }
  }, [session, router]);

  const onFinish = async (values: { 
    username: string; 
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const {username, password} = await signUpSchema.parseAsync(values);
      
      const res = await authClient.signUp.email({
        username,
        name: username,
        email: `${window.crypto.randomUUID()}@member.local`,
        password,
        image: `https://robohash.org/${window.crypto.randomUUID()}`
      });

      if (res?.error) {
        throw new Error(res.error.message);
      }

      toast.success('注册成功');
      router.push('/member/pc');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          message.error(err.message);
        });
        return;
      }
      toast.error('注册失败，请稍后重试');
    }
  };

  return (
    <Content style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card style={{ 
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e8e8e8'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          注册
        </Title>
        <Form
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 18, message: '用户名最长18个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 32, message: '密码最长32个字符' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/,
                message: '密码必须包含字母和数字',
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不匹配'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => router.push('/member/pc/sign-in')}>
              已有账号？去登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
}
