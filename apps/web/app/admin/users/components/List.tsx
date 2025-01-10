'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './EditForm';
import axios from 'axios';

import { User } from '@prisma/client';

export const List = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<User>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      fixed: 'left',
      width: 150,
      fieldProps: {
        placeholder: '请输入用户名'
      },
      ellipsis: true
    },
    {
      title: '姓名', 
      dataIndex: 'name',
      width: 150,
      fieldProps: {
        placeholder: '请输入姓名'
      },
      ellipsis: true
    },
    {
      title: '邮箱',
      dataIndex: 'email', 
      width: 200,
      fieldProps: {
        placeholder: '请输入邮箱'
      },
      ellipsis: true
    },
    {
      title: '邮箱验证',
      dataIndex: 'emailVerified',
      width: 100,
      valueEnum: {
        true: { text: '已验证', status: 'Success' },
        false: { text: '未验证', status: 'Error' },
      },
      ellipsis: true
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      valueEnum: {
        admin: { text: '管理员', status: 'Success' },
        user: { text: '用户', status: 'Default' },
      },
    },
    {
      title: '封禁状态',
      dataIndex: 'banned',
      width: 100,
      valueEnum: {
        true: { text: '已封禁', status: 'Error' },
        false: { text: '正常', status: 'Success' },
      },
      ellipsis: true
    },
    {
      title: '封禁原因',
      dataIndex: 'banReason',
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: '封禁到期',
      dataIndex: 'banExpires',
      valueType: 'dateTime',
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: 'VIP到期',
      dataIndex: 'vipExpiredAt',
      valueType: 'dateTime', 
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 200,
      search: false,
      ellipsis: true
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      search: false,
      render: (_, record: User) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRecord(record);
            setEditModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={async () => {
            try {
              await axios.delete(`/api/admin/users/${record.id}`);
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
      <ProTable<User>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/users', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                username: params.username,
                name: params.name,
                email: params.email,
                emailVerified: params.emailVerified,
                role: params.role,
                banned: params.banned
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
            新增用户
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑用户' : '新增用户'}
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