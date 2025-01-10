'use client'
import { Layout, Menu } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  ShoppingOutlined, 
  LockOutlined, 
  CustomerServiceOutlined 
} from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Sider, Content } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [selectedKey, setSelectedKey] = useState<string>('1');
  useEffect(() => {
    console.log(location.pathname);
    setSelectedKey(location.pathname);
  }, []);

  return (
    <Layout className='p-4'>
      <Sider style={{ background: '#fff' }}>
        <Menu selectedKeys={[selectedKey]} mode="inline">
          <Menu.Item key="/member/pc/profile" icon={<UserOutlined />}>
            <Link href="/member/pc/profile">会员信息</Link>
          </Menu.Item>
          <Menu.Item key="/member/pc/likes" icon={<HeartOutlined />}>
            <Link href="/member/pc/likes">我的喜欢</Link>
          </Menu.Item>
          <Menu.Item key="/member/pc/orders" icon={<ShoppingOutlined />}>
            <Link href="/member/pc/orders">我的订单</Link>
          </Menu.Item>
          <Menu.Item key="/member/pc/change-password" icon={<LockOutlined />}>
            <Link href="/member/pc/change-password">修改密码</Link>
          </Menu.Item>
          <Menu.Item key="/member/pc/contact" icon={<CustomerServiceOutlined />}>
            <a href="https://support.example.com" target="_blank" rel="noopener noreferrer">
              联系客服
            </a>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        <div className='pl-4'>
          {children}
        </div>
      </Content>
    </Layout>
  );
}