'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './EditForm';
import axios from 'axios';
import { PaymentMethod } from '@prisma/client';
import { message } from 'antd';
export default function List() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const columns: ProColumns<PaymentMethod>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '驱动',
      dataIndex: 'driver',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
      valueEnum: {
        ENABLED: '启用',
        DISABLED: '禁用',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: PaymentMethod) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRecord({
              ...record,
              icon: record.icon ? [
                {
                  uid: window.crypto.randomUUID(),
                  url: record.icon,
                  status: 'done',
                }
              ] : null,
            });
            setEditModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
          onConfirm={async () => {
            await axios.delete(`/api/admin/payment-methods/${record.id}`);
            message.success('删除成功');
            ref.current?.reload();
          }}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  const ref = useRef<ActionType>();
  return (
    <>
      <ProTable<PaymentMethod>
        actionRef={ref}
        columns={columns}
        loading={loading}
        pagination={false}
        request={async () => {
          const res = await axios.get('/api/admin/payment-methods');
          if (res.data.code === 200) {
            return {
              data: res.data.data.paymentMethods,
              success: true,
            };
          }
          return {
            data: [],
            success: true,
          };
        }}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setCurrentRecord(null);
              setEditModalVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑支付方法' : '新增支付方法'}
        open={editModalVisible}
        onOpenChange={(state) => {
          setEditModalVisible(state);
          if(!state){
            setCurrentRecord(null);
          }
        }}
        initialValues={currentRecord}
        onSuccess={() => {
          setEditModalVisible(false);
          ref.current?.reload();
        }}
      />
    </>
  );
}