'use client'
import { Card, Avatar, Descriptions, Button } from 'antd';
import MainLayout from '../components/main-layout';
import { authClient } from '@/libs/better-client';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <MainLayout>
      <Card title="会员信息">
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center mr-8'>
            <Avatar 
              size={64} 
              src={session?.user?.image ?? ''}
              alt={session?.user?.username ?? ''}
              className='border-2 border-gray-500'
            />
          </div>
          <div>
            <Descriptions column={1}>
              <Descriptions.Item label="注册时间">{dayjs(session?.user?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
              <Descriptions.Item label="名称">{session?.user?.username}</Descriptions.Item>
              <Descriptions.Item label="ID">{session?.user?.id}</Descriptions.Item>
              <Descriptions.Item label="会员到期时间">
                <div className="flex items-center gap-4 justify-center">
                  <span>{session?.user?.vipExpiredAt ? dayjs(session?.user?.vipExpiredAt).format('YYYY-MM-DD') : ''}</span>
                  <Button 
                    type="primary"
                    onClick={() => router.push('/member/pc/top-up')}
                  >
                    {session?.user?.vipExpiredAt ? '续费会员' : '开通会员'}
                  </Button>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}