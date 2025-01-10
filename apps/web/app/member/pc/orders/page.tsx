'use client'
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '../components/main-layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface OrderType {
  no: string;
  status: string;
  paidAmount: number;
  createdAt: string;
  vipPackage: {
    title: string;
    price: number;
    duration: number;
  };
  paymentMethod: {
    name: string;
    icon: string;
  };
  paidAt: string;
}

const columns: ColumnsType<OrderType> = [
  { 
    title: '订单号', 
    dataIndex: 'no', 
    key: 'no' 
  },
  { 
    title: '创建时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  },
  { 
    title: '支付金额', 
    dataIndex: 'paidAmount', 
    key: 'paidAmount',
    render: (amount) => `¥${amount}`
  },
  { 
    title: '支付方式', 
    dataIndex: ['paymentMethod', 'name'], 
    key: 'paymentMethod',
    render: (text, record) => (
      <div className="flex items-center">
        <img src={record.paymentMethod.icon} alt={text} className="w-4 h-4 mr-2" />
        {text}
      </div>
    )
  },
  { 
    title: '状态', 
    dataIndex: 'status', 
    key: 'status',
    render: (status) => {
      switch (status) {
        case 'PAID':
          return '已支付';
        case 'PENDING':
          return '待支付';
        case 'CANCELLED':
          return '已取消';
        default:
          return status;
      }
    }
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0
  });

  const fetchOrders = async (page = 1, pageSize = 2) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/member/orders`, {
        params: {
          page,
          pageSize
        }
      });
      if (response.data.code === 200) {
        setOrders(response.data.data.list);
        setPagination({
          current: response.data.data.page,
          pageSize: response.data.data.pageSize,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Fetch orders failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

  return (
    <MainLayout>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="no"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4">
              <p>套餐名称: {record.vipPackage.title}</p>
              <p>套餐时长: {record.vipPackage.duration}天</p>
              <p>支付时间: {record.paidAt ? dayjs(record.paidAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
            </div>
          ),
        }}
        title={() => '我的订单'}
      />
    </MainLayout>
  );
}