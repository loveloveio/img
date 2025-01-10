'use client'
import { Card, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;

interface DataType {
  key: string;
  service: string;
  vip1: string;
  vip2: string;
  vip3: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '服务项目',
    dataIndex: 'service',
    key: 'service',
    width: 200,
  },
  {
    title: 'VIP1',
    dataIndex: 'vip1',
    key: 'vip1',
    align: 'center',
  },
  {
    title: 'VIP2',
    dataIndex: 'vip2',
    key: 'vip2',
    align: 'center',
  },
  {
    title: 'VIP3',
    dataIndex: 'vip3',
    key: 'vip3',
    align: 'center',
  },
];

const dataSource = [
  {
    key: '1',
    service: '服务时长',
    vip1: '1年',
    vip2: '1年',
    vip3: '2年',
  },
  {
    key: '2',
    service: '价格',
    vip1: '¥198元',
    vip2: '¥268元',
    vip3: '¥498元',
  },
  {
    key: '3',
    service: '赠送雅币',
    vip1: '1980雅币',
    vip2: '2680雅币',
    vip3: '5000雅币',
  },
  {
    key: '4',
    service: '充值优惠',
    vip1: '无优惠',
    vip2: '9.5折',
    vip3: '9.0折',
  },
  {
    key: '5',
    service: '可订类型',
    vip1: '图片',
    vip2: '图片+视频',
    vip3: '图片+视频',
  },
  {
    key: '6',
    service: '影院级欣赏',
    vip1: '支持',
    vip2: '支持',
    vip3: '支持',
  },
  {
    key: '7',
    service: '图片像素',
    vip1: '千万级',
    vip2: '千万级',
    vip3: '千万级',
  },
  {
    key: '8',
    service: '质量精度',
    vip1: '300DPI+',
    vip2: '300DPI+',
    vip3: '300DPI+',
  },
  {
    key: '9',
    service: '网盘下载',
    vip1: '支持',
    vip2: '支持',
    vip3: '支持',
  },
];

export default function VIPManual() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <Title level={2} className="text-center mb-6">VIP说明</Title>
        
        <div className="space-y-4 mb-8">
          <Paragraph>
            1、除免费欣赏作品外，其他所有的作品均为VIP会员才可以订阅欣赏，图片作品需要VIP1或以上，视频需要VIP2或以上等级。
          </Paragraph>
          <Paragraph>
            2、作品列表里面的作品，所有VIP会员均可直接欣赏、下载等。精选作品及视频，需要花费一定数量的雅币才可以订阅欣赏。
          </Paragraph>
          <Paragraph>
            3、雅币做为订阅精选作品和视频用的一种虚拟币，开通会员时均有赠送一定数量的雅币，雅币用完后，可通过充值购买。
          </Paragraph>
        </div>

        <Title level={4} className="text-center mb-4">VIP等级及费用说明</Title>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
}