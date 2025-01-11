'use client';

import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './EditForm';
import axios from 'axios';

import { PhotoCollection } from '@prisma/client';
export const List = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);

  const columns: ProColumns<PhotoCollection>[] = [
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
      title: '副标题', 
      dataIndex: 'subtitle',
      width: 200,
      search: false
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
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
      fieldProps: {
        placeholder: '请选择状态'
      }
    },
    {
      title: '推荐',
      dataIndex: 'recommend',
      width: 100,
      valueEnum: {
        true: { text: '是', status: 'Success' },
        false: { text: '否', status: 'Default' },
      },
      fieldProps: {
        placeholder: '请选择是否推荐'
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      fieldProps: {
        placeholder: '请输入标签'
      }
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
      render: (text: React.ReactNode, record: PhotoCollection) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRecord({
              ...record,
              tags: record?.tags ?? [],
              cover: [{
                uid: window.crypto.randomUUID(),
                name: record.cover,
                url: record.cover,
              }],
              previewImages: record.previewImages.map((url) => ({
                uid: window.crypto.randomUUID(),
                name: url,
                url: url,
              })),
              paidImages: record.paidImages.map((url) => ({
                uid: window.crypto.randomUUID(),
                name: url,
                url: url,
              }))
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
              await axios.delete(`/api/admin/photo-collections/${record.id}`);
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
      <ProTable<PhotoCollection>
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1500 }}
        request={async (params) => {
          try {
            const { data: result } = await axios.get('/api/admin/photo-collections', {
              params: {
                page: params.current || 1,
                limit: params.pageSize || 10,
                title: params.title,
                status: params.status,
                recommend: params.recommend,
                tags: params.tags
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
            新增图集
          </Button>,
        ]}
      />

      <EditForm
        title={currentRecord ? '编辑图集' : '新增图集'}
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
          actionRef.current?.reload();
        }}
      />
    </>
  );
}