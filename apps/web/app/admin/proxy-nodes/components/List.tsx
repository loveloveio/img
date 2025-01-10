'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './EditForm';
import axios from 'axios';

import { ProxyNode } from '@prisma/client';

export const List = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<ProxyNode>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      fixed: 'left',
      width: 200,
      fieldProps: {
        placeholder: '请输入标题'
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      search: false
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: 200,
      search: false
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      
      valueEnum: {
        ENABLED: { text: '启用', status: 'Success' },
        DISABLED: { text: '禁用', status: 'Error' },
      },
      valueType: 'select',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
      search: false
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt', 
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
      render: (text: React.ReactNode, record: ProxyNode) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRecord({
              ...record,
              id: Number(record.id)
            });
            setEditModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={async () => {
            try {
              await axios.delete(`/api/admin/proxy-nodes/${record.id}`);
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
      <ProTable<ProxyNode>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/proxy-nodes', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                title: params.title,
                status: params.status
              }
            });
            
            if (result.code === 200) {
              return {
                data: result.data.list,
                success: true,
                total: result.data.pagination.total,
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
              setEditModalVisible(true);
            }}
          >
            新增代理节点
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑代理节点' : '新增代理节点'}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        initialValues={currentRecord}
        onSuccess={() => {
          setEditModalVisible(false);
          actionRef.current?.reload();
        }}
      />
    </>
  );
}