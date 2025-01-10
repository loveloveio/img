'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import axios from 'axios';

import { Order } from '@prisma/client';

export const List = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<Order>[] = [
    {
      title: '订单号',
      dataIndex: 'no',
      fixed: 'left',
      width: 200,
      copyable: true,
      fieldProps: {
        placeholder: '请输入订单号'
      }
    },
    {
      title: '商户订单号',
      dataIndex: 'outTradeNo',
      width: 200,
      search: false
    },
    {
      title: 'VIP套餐',
      dataIndex: ['vipPackage', 'title'],
      width: 200,
      search: false
    },
    {
      title: '支付金额',
      dataIndex: 'paidAmount',
      width: 120,
      search: false,
      valueType: 'money'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: true,
      valueEnum: {
        PENDING: { text: '待支付', status: 'Warning' },
        PAID: { text: '已支付', status: 'Success' },
        CANCELLED: { text: '已取消', status: 'Error' },
      }
    },
    {
      title: '用户',
      dataIndex: ['user', 'name'],
      width: 150,
      search: false
    },
    {
      title: '支付方式',
      dataIndex: ['paymentMethod', 'name'],
      width: 150,
      search: false
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
      search: false
    },
    {
      title: '支付时间',
      dataIndex: 'paidAt',
      valueType: 'dateTime',
      width: 180,
      search: false
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      search: false,
      render: (_, record: Order) => [
        record.status === 'PENDING' && (
          <Popconfirm
            title="确认该订单已支付？"
            onConfirm={async () => {
              try {
                await axios.post(`/api/admin/orders/${record.id}/confirm-payment`);
                actionRef.current?.reload();
              } catch (error) {
                console.error('Confirm payment failed:', error);
              }
            }}
          >
            <Button type="link">确认支付</Button>
          </Popconfirm>
        ),
        record.status === 'PENDING' && (
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={async () => {
              try {
                await axios.delete(`/api/admin/orders/${record.id}`);
                actionRef.current?.reload();
              } catch (error) {
                console.error('Delete failed:', error);
              }
            }}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        )
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable<Order>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1800 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/orders', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                no: params.no,
                status: params.status
              }
            });

            if (result.code === 200) {
              return {
                data: result.data.list,
                success: true,
                total: result.data.total,
              };
            }
            return {
              data: [],
              success: false,
            };
          } catch (error) {
            console.error('Fetch data failed:', error);
            return {
              data: [],
              success: false,
            };
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </>
  );
}