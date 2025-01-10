'use client'
import { Card, Statistic, Table, Button, Space } from 'antd';
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined';
import ArrowDownOutlined from '@ant-design/icons/ArrowDownOutlined';
import { MainLayout } from "@/admin/components/main-layout"
import { authClient } from '@/libs/better-client';
import { useEffect } from 'react';
const columns = [
  {
    title: 'Activity',
    dataIndex: 'activity',
    key: 'activity',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const dataSource = [
  {
    key: '1',
    activity: 'User login',
    time: '10:42 AM',
    status: 'Completed',
  },
  {
    key: '2',
    activity: 'Data export',
    time: '10:15 AM',
    status: 'Processing',
  },
  {
    key: '3',
    activity: 'System update',
    time: '9:30 AM',
    status: 'Completed',
  },
];

const Dashboard = () => {
  const {
    data: session,
  } = authClient.useSession()
  useEffect(() => {
    console.log('session', session);
  }, [session]);
  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Card>
              <Statistic
                title="Active Users"
                value={1128}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="System Errors"
                value={2}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Pending Tasks"
                value={15}
                precision={0}
              />
            </Card>
          </div>

          <Card title="Recent Activity">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Card>

          <Card title="Quick Actions">
            <Space>
              <Button type="primary">Create Report</Button>
              <Button>Manage Users</Button>
              <Button>System Settings</Button>
            </Space>
          </Card>
        </Space>
      </div>

    </MainLayout>
  );
}

export default Dashboard;