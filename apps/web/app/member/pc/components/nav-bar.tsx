'use client';

import { Layout, Avatar, Dropdown, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { authClient } from '@/libs/better-client';

const { Header } = Layout;

export default function NavBar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/member/pc/sign-in');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      onClick: () => router.push('/member/pc/profile')
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  return (
    <>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://www.baidu.com/favicon.ico"
            alt="Logo"
            width={32}
            height={32}
            style={{ marginRight: 8 }}
          />
          <Button
            type="text"
            style={{ fontSize: 18, fontWeight: 'bold' }}
            onClick={() => router.push('/member/pc')}
          >
            站点名称
          </Button>
          <Button
            type="text"
            style={{ fontSize: 16, marginLeft: 16 }}
            onClick={() => router.push('/member/pc/vip-manual')}
          >
            VIP手册
          </Button>
        </div>

        {session ? (
          <Dropdown 
            menu={{ items: userMenuItems }}
            placement="bottomRight"
          >
            <Avatar 
              size={32}
              src={session?.user?.image ?? ''}
              alt={session?.user?.username ?? ''}
              className='cursor-pointer hover:border-2 hover:border-gray-500'
            />
          </Dropdown>
        ) : (
          <Space>
            <Button 
              type="primary" 
              onClick={() => router.push('/member/pc/sign-in')}
              style={{ backgroundColor: '#1890ff' }}
            >
              登录
            </Button>
            <Button 
              type="default" 
              onClick={() => router.push('/member/pc/sign-up')}
            >
              注册
            </Button>
          </Space>
        )}
      </Header>
    </>
  );
}
