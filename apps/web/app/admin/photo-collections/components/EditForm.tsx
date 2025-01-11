'use client';

import { ModalForm, ProFormText, ProFormRadio, ProFormUploadButton, ProFormDigit, ProFormTextArea, ProFormSelect, ProFormInstance } from '@ant-design/pro-components';
import { Image, message, Dropdown } from 'antd';
import axios from 'axios';
import { RiImageCircleLine, RiCreativeCommonsNcLine, RiMoneyDollarCircleLine } from "@remixicon/react";
import { PaymentMethodStatus } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import type { GetProp, MenuProps, UploadFile, UploadProps } from 'antd';
import { CSS } from '@dnd-kit/utilities';
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';

export interface PhotoCollectionImage extends UploadFile {
  isCover: boolean;
  isPaid: boolean;
}
interface DraggableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: PhotoCollectionImage;
}
const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // prevent preview event when drag end
      className={isDragging ? 'is-dragging' : ''}
      {...attributes}
      {...listeners}
    >
      {/* hide error tooltip when dragging */}
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
};
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
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function EditForm({ initialValues, onSuccess, open, onOpenChange, title }: Props) {
  const formRef = useRef<ProFormInstance>();
  const [imageFiles, setImageFiles] = useState<PhotoCollectionImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const currentRequestQueue = useRef<RequestQueue>(new RequestQueue(2));
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setImageFiles((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        if (prev[activeIndex]?.isCover) {
          return prev; // Do not move the cover image
        }
        if (prev[activeIndex]?.isPaid !== prev[overIndex]?.isPaid){
          return prev;
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
      
    }
  };
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const [type, uid] = e.key.split('/');
    if (type === 'cover') {
      setImageFiles((pre) => {
        const cover = pre.find((item) => item.isCover);
        if (!cover || cover.uid !== uid) {
          return pre.map((item, index) => 
            item.uid === uid 
              ? { ...item, isCover: true, isPaid: false, order: 0 }
              : { ...item, isCover: false, order: index + 1 }
          ).sort((a, b) => a.order - b.order);
        }
        return pre;
      });
    } else if (type === 'free') {
      setImageFiles((pre) => {
        const updatedFiles = pre.map((item) => item.uid === uid ? { ...item, isPaid: !item.isPaid } : item);
        console.log('updatedFiles',updatedFiles);
        const cover = updatedFiles.find((item) => item.isCover);
        const freeFiles = updatedFiles.filter((item) => !item.isPaid && !item.isCover);
        const paidFiles = updatedFiles.filter((item) => item.isPaid && !item.isCover);
        if (!cover && freeFiles.length > 0) {
          freeFiles[0]!.isCover = true;
          freeFiles[0]!.isPaid = false;
        }
        
        return cover ? [cover, ...freeFiles, ...paidFiles] : [...freeFiles, ...paidFiles];
      });
    }
  };
  const handlePreview = async (file: PhotoCollectionImage) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
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
  useEffect(() => {
    if (open && initialValues) {
      if (initialValues?.imageFiles) {
        setImageFiles(initialValues.imageFiles.map((item: any) => ({
          uid: window.crypto.randomUUID(),
          name: item.name,
          url: item.url,
          thumbUrl: item.url,
          isCover: item.isCover,
          isPaid: item.isPaid,
          status: 'done',
        })));
      }
    }
    if (!open) {
      setImageFiles([]);
      formRef.current?.resetFields();
    }
  }, [open, initialValues]);
  return (
    <ModalForm
      formRef={formRef}
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={initialValues}
      onFinish={handleSubmit}
      modalProps={{
        onCancel: () => {
          onOpenChange(false);
        },
        onClose: () => {
          onOpenChange(false);
        },
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
        initialValue={initialValues?.title}
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormText
        name="subtitle"
        label="副标题"
      />
      <ProFormTextArea
        name="description"
        label="描述"
        initialValue={initialValues?.description}
      />
      <ProFormSelect
        name="tags"
        label="标签"
        mode="tags"
      />
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
      <SortableContext items={imageFiles.map((i) => i.uid)} strategy={horizontalListSortingStrategy}>
      <ProFormUploadButton
        name="previewImages"
        label="图片列表"
        max={200}
        initialValue={initialValues?.previewImages}
        action="/api/admin/upload"
        fileList={imageFiles}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          multiple: true,
          onPreview: (file) => {
            handlePreview(file as PhotoCollectionImage);
          },
          beforeUpload: (file) => {
            const t: PhotoCollectionImage = {
              uid: file.uid,
              name: file.name,
              thumbUrl: '',
              status: 'uploading',
              originFileObj: file,
              isCover: false,
              isPaid: true,
            }
            console.log('t',t);
            setImageFiles((pre) => [...pre, t]);
            currentRequestQueue.current.add(() => {
              const formData = new FormData();
              formData.append('file', file);
              return axios.post('/api/admin/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
            }).then((response: any) => {
              setImageFiles((pre) => {
                const cover = pre.find((item) => item.isCover);
                const isCover = !cover;
                const isPaid = !isCover;
                return pre.map((item) => item.uid === file.uid ? { ...item, status: 'done', url: response.data.url, thumbUrl: response.data.url, isCover, isPaid } : item)
              });
            })
              .catch(error => {
                console.error('文件上传失败:', error);
                setImageFiles((pre) => pre.map((item) => item.uid === file.uid ? { ...item, status: 'error' } : item));
              });;
            return false;
          },
          onRemove: (file) => {
            if (file.status === 'uploading') return false;
            setImageFiles((pre) => pre.filter((item) => item.uid !== file.uid));
          },
          itemRender: (originNode, file) => {
            const f = imageFiles.find((item) => item.uid === file.uid);
            if (!f) return null;
            console.log('f',f);
            return <DraggableUploadListItem originNode={<div className='w-[102px] h-[102px] relative'>
              <Dropdown menu={{ items: [{ label: f?.isCover ? '取消封面' : '设为封面', key: 'cover/' + f?.uid }, f?.isCover ? null : { label: f?.isPaid ? '设为免费' : '取消免费', key: 'free/' + f?.uid }], onClick: handleMenuClick }}>
                {originNode}
              </Dropdown>
              <div className='absolute bottom-1 right-1 flex'>
                {f?.isCover && <RiImageCircleLine size={20} style={{ color: '#1890ff' }} />}
                {f?.isPaid && <RiMoneyDollarCircleLine size={20} style={{ color: '#faad14' }} /> }
                {!f?.isPaid && <RiCreativeCommonsNcLine size={20} style={{ color: '#52c41a' }} />}
              </div>
            </div>} file={f} />
          }
        }}
        transform={(value) => {
          if (!value) return [];
          const cover = imageFiles.find((item) => item.isCover);
          const previewImages = imageFiles.filter((item) => !item.isPaid).map((item) => item.url);
          const paidImages = imageFiles.filter((item) => item.isPaid).map((item) => item.url);
          return {
            previewImages,
            cover: cover?.url ?? null,
            paidImages
          }
        }}
        rules={[{ required: true, message: '请上传预览图片' }]}
      />
       </SortableContext>
      </DndContext>
      <div style={{ display: 'flex', gap: '16px' }}>
        <ProFormRadio.Group
          name="status"
          label="状态"
          initialValue={initialValues?.status}
          options={[
            { label: '启用', value: PaymentMethodStatus.ENABLED },
            { label: '禁用', value: PaymentMethodStatus.DISABLED },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormRadio.Group
          name="recommend"
          initialValue={initialValues?.recommend}
          label="推荐"
          options={[
            { label: '是', value: true },
            { label: '否', value: false },
          ]}
          rules={[{ required: true, message: '请选择是否推荐' }]}
        />
        <ProFormDigit
          name="sort"
          initialValue={initialValues?.sort}
          label="排序"
          min={0}
          fieldProps={{ precision: 0 }}
        />
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>
    </ModalForm>
  );
}