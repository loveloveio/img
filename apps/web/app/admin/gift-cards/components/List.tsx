'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './CreateForm';
import axios from 'axios';

import { GiftCard } from '@prisma/client';

export const List = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<GiftCard>[] = [
    {
      title: '礼品卡编号',
      dataIndex: 'code',
      fixed: 'left',
      width: 300,
      copyable: true,
      fieldProps: {
        placeholder: '请输入礼品卡编号'
      }
    },
    {
      title: '礼品卡套餐',
      dataIndex: ['giftCardPackage', 'title'],
      width: 200,
      search: false
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      search: true,
      valueEnum: {
        UNUSED: { text: '未使用', status: 'Default' },
        USED: { text: '已使用', status: 'Success' },
        EXPIRED: { text: '已过期', status: 'Error' },
      }
    },
    {
      title: '使用会员',
      dataIndex: ['user', 'username'],
      width: 200,
      search: false
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
      search: false
    },
    {
      title: '使用时间',
      dataIndex: 'usedAt', 
      valueType: 'dateTime',
      width: 200,
      search: false
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      search: false,
      render: (_, record: GiftCard) => [
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={async () => {
            try {
              await axios.delete(`/api/admin/gift-cards/${record.id}`);
              actionRef.current?.reload();
            } catch (error) {
              console.error('Delete failed:', error);
            }
          }}
        >
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable<GiftCard>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/gift-cards', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                code: params.code,
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
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setCurrentRecord(null);
              setCreateModalVisible(true);
            }}
          >
            新增礼品卡
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑礼品卡' : '新增礼品卡'}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />
    </>
  );
}