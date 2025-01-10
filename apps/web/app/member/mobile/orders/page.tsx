'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Card, CardBody, CardHeader, Divider, Spinner } from '@nextui-org/react';
import {NavBar} from '@/member/mobile/components/nav-bar';
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

const getStatusText = (status: string) => {
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
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchOrders = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/member/orders`, {
        params: {
          page: pageNum,
          pageSize
        }
      });
      if (response.data.code === 200) {
        if (pageNum === 1) {
          setOrders(response.data.data.list);
        } else {
          setOrders(prev => [...prev, ...response.data.data.list]);
        }
        setHasMore(response.data.data.total > pageNum * pageSize);
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

  return (
    <>
    <NavBar/>
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">我的订单</h1>
      
      {orders.map((order) => (
        <Card key={order.no} className="mb-4">
          <CardHeader className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-gray-500">订单号: {order.no}</div>
            <div className="text-sm font-semibold">{getStatusText(order.status)}</div>
          </CardHeader>
          <Divider/>
          <CardBody className="px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img src={order.paymentMethod.icon} alt={order.paymentMethod.name} className="w-4 h-4 mr-2" />
                <span>{order.paymentMethod.name}</span>
              </div>
              <div className="font-bold">¥{order.paidAmount}</div>
            </div>
            
            <div className="text-sm text-gray-500 mb-2">
              套餐: {order.vipPackage.title} ({order.vipPackage.duration}天)
            </div>
            
            <div className="text-xs text-gray-400">
              <div>创建时间: {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
              {order.paidAt && (
                <div>支付时间: {dayjs(order.paidAt).format('YYYY-MM-DD HH:mm:ss')}</div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {hasMore && !loading && (
        <button
          className="w-full py-2 text-blue-500"
          onClick={() => {
            setPage(prev => prev + 1);
            fetchOrders(page + 1);
          }}
        >
          加载更多
        </button>
      )}
    </div>
    </>
  );
}