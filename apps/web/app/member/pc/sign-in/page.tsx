'use client';
import { Form, Input, Button, Typography, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authClient } from '@/libs/better-client';
const { Title } = Typography;

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.back();
    }
  }, [session, router]);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const res = await authClient.signIn.username({
        username: values.username,
        password: values.password,
        rememberMe: true  
      }); 
      if (res?.error) {
        throw new Error(res.error.message);
      }

      toast.success('登录成功');
      router.push('/member');
    } catch (error) {
      console.error(error);
      toast.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className='w-full h-full flex flex-1 justify-center items-center'>
      <Card style={{ 
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e8e8e8'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          登录
        </Title>
        <Form
          name="signin"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <Button block onClick={() => router.push('/member/pc/sign-up')}>
              没有账号？去注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
