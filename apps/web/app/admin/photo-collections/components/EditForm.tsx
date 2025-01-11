'use client';

import { ModalForm, ProFormText, ProFormRadio, ProFormUploadButton, ProFormDigit, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import axios from 'axios';

import { PaymentMethodStatus } from '@prisma/client';
import { useState } from 'react';
import { useRef } from 'react';
import type { UploadFile } from 'antd';
class RequestQueue {
  concurrency: number;
  queue: any[];
  processing: number;
  constructor(concurrency = 5) {
    this.concurrency = concurrency;
    this.queue = [];
    this.processing = 0;
  }
  // 查询对列数量
  getQueueLength() {
    return this.queue.length;
  }
  add(request: any) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing >= this.concurrency || this.queue.length === 0) {
      return;
    }
    this.processing++;
    const { request, resolve, reject } = this.queue.shift();
    try {
      const response = await request();
      resolve(response);
    } catch (error) {
      reject(error);
    } finally {
      this.processing--;
      this.processQueue();
    }
  }
}
type Props = {
  initialValues?: any;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};
export default function EditForm({ initialValues, onSuccess, open, onOpenChange, title }: Props) {
  const [form] = Form.useForm();
  const [previewImageFiles, setPreviewImageFiles] = useState<UploadFile[]>([]);
  const [paidImageFiles, setPaidImageFiles] = useState<UploadFile[]>([]);

  const currentRequestQueue = useRef<RequestQueue>(new RequestQueue(2));
  const handleSubmit = async (values: any) => {
    try {
      // 检查图片是否上传完成
      if (currentRequestQueue.current.getQueueLength() > 0) {
        message.error('请等待图片上传完成');
        return false;
      }

      if (initialValues) {
        // Update existing
        const response = await axios.put(`/api/admin/photo-collections/${initialValues.id}`, values);
        if (response.status !== 200) {
          throw new Error('Failed to update photo collection');
        }
        message.success('Photo collection updated successfully');
        onSuccess();
        return false; // 阻止表单提交
      } else {
        const response = await axios.post('/api/admin/photo-collections', values);

        if (response.status !== 200) {
          throw new Error('Failed to create photo collection');
        }
        message.success('Photo collection saved successfully');
        onSuccess();
        return false;
      }
    } catch (error) {
      message.error('Failed to save photo collection');
      return false;
    }
  };
  return (
    <ModalForm
      form={form}
      title={title}
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
        if (!state) {
          setPreviewImageFiles([]);
          setPaidImageFiles([]);
          form.resetFields();
        }
      }}
      initialValues={{
        ...initialValues,
        status: initialValues?.status || PaymentMethodStatus.ENABLED,
        sort: initialValues?.sort || 0,
        recommend: initialValues?.recommend || false,
        tags: initialValues?.tags || [],
      }}
      onFinish={handleSubmit}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }
      }}
      submitter={{
        searchConfig: { submitText: '保存' },
        resetButtonProps: { style: { display: 'none' } },
      }}
    >
      <ProFormText
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormText
        name="subtitle"
        label="副标题"
      />
      <ProFormTextArea
        name="description"
        label="描述"
      />
      <ProFormSelect
        name="tags"
        label="标签"
        mode="tags"
      />
      <ProFormUploadButton
        name="cover"
        label="封面"
        max={1}
        action="/api/admin/upload"
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        transform={(value) => {
          if (value && value[0]) {
            return value[0]?.response?.url || value[0]?.url;
          }
          return '';
        }}
        rules={[{ required: true, message: '请上传封面图片' }]}
      />
      <ProFormUploadButton
        name="previewImages"
        label="预览图列表"
        max={200}
        action="/api/admin/upload"
        fileList={previewImageFiles}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          multiple: true,
          beforeUpload: (file) => {
            const t: UploadFile = {
              uid: file.uid,
              name: file.name,
              thumbUrl: '',
              status: 'uploading',
              originFileObj: file,
            }
            setPreviewImageFiles((pre) => [...pre, t]);
            currentRequestQueue.current.add(() => {
              const formData = new FormData();
              formData.append('file', file);
              return axios.post('/api/admin/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
            }).then((response: any) => {
              setPreviewImageFiles((pre) => pre.map((item) => item.uid === file.uid ? { ...item, status: 'done', url: response.data.url, thumbUrl: response.data.url } : item));
            })
            .catch(error => {
              console.error('文件上传失败:', error);
              setPreviewImageFiles((pre) => pre.map((item) => item.uid === file.uid ? { ...item, status: 'error' } : item));
            });;
            return false;
          },
          onRemove: (file) => {
            if (file.status === 'uploading') return false;
            setPreviewImageFiles((pre) => pre.filter((item) => item.uid !== file.uid));
          }
        }}
        transform={(value) => {
          if (!value) return [];
          return {
            previewImages: previewImageFiles.map((item: any) => (item?.url ?? null)).filter((item: any) => item !== null)
          }
        }}
        rules={[{ required: true, message: '请上传预览图片' }]}
      />
      <ProFormUploadButton
        name="paidImages"
        label="付费图列表"
        max={200}
        action="/api/admin/upload"
        fileList={paidImageFiles}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          multiple: true,
          beforeUpload: (file) => {
            const t: UploadFile = {
              uid: file.uid,
              name: file.name,
              thumbUrl: '',
              status: 'uploading',
              originFileObj: file,
            }
            setPaidImageFiles((pre) => [...pre, t]);
            currentRequestQueue.current.add(() => {
              const formData = new FormData();
              formData.append('file', file);
              return axios.post('/api/admin/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
            }).then((response: any) => {
              setPaidImageFiles((pre) => pre.map((item) => item.uid === file.uid ? { ...item, status: 'done', url: response.data.url, thumbUrl: response.data.url } : item));
            })
            .catch(error => {
              console.error('文件上传失败:', error);
              setPaidImageFiles((pre) => pre.map((item) => item.uid === file.uid ? { ...item, status: 'error' } : item));
            });
            return false;
          },
          onRemove: (file) => {
            if (file.status === 'uploading') return false;
            setPaidImageFiles((pre) => pre.filter((item) => item.uid !== file.uid));
          }
        }}
        transform={(value) => {
          console.log('@@@@@@@@@value', paidImageFiles);
          if (!value) return [];
          return {
            paidImages: paidImageFiles.map((item: any) => (item?.url ?? null)).filter((item: any) => item !== null)
          }
        }}
        rules={[{ required: true, message: '请上传付费图片' }]}
      />
      <div style={{ display: 'flex', gap: '16px' }}>
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            { label: '启用', value: PaymentMethodStatus.ENABLED },
            { label: '禁用', value: PaymentMethodStatus.DISABLED },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormRadio.Group
          name="recommend"
          label="推荐"
          options={[
            { label: '是', value: true },
            { label: '否', value: false },
          ]}
          rules={[{ required: true, message: '请选择是否推荐' }]}
        />
        <ProFormDigit
          name="sort"
          label="排序"
          min={0}
          fieldProps={{ precision: 0 }}
        />
      </div>
    </ModalForm>
  );
}