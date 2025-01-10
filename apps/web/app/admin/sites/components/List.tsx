'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag as AntdTag } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './EditForm';
import axios from 'axios';

import { Site } from '@prisma/client';

export const List = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<Site>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
      fieldProps: {
        placeholder: '请输入名称'
      }
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: 300,
      search: false,
      ellipsis: true
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      search: false,
      render: (_, record) => record.icon && <img src={record.icon} alt={record.name} style={{ width: 20, height: 20 }} />
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      search: false,
      render: (_, record) => (
        <>
          {record.tags.map(tag => (
            <AntdTag key={tag}>{tag}</AntdTag>
          ))}
        </>
      )
    },
    {
      title: '点击数',
      dataIndex: 'clickCount',
      width: 100,
      search: false
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        ENABLED: { text: '启用', status: 'Success' },
        DISABLED: { text: '禁用', status: 'Error' }
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
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
      render: (text: React.ReactNode, record: Site) => [
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
          key="delete"
          title="确定要删除吗？"
          onConfirm={async () => {
            try {
              await axios.delete(`/api/admin/sites/${record.id}`);
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
      <ProTable<Site>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/sites', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                name: params.name,
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
              setEditModalVisible(true);
            }}
          >
            新增站点
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑站点' : '新增站点'}
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