import { Col, Card } from 'antd';
import { PhotoCollection } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {UAParser} from 'ua-parser-js'
export interface PhotoCollectionCardProps {
  item: PhotoCollection;
}

export const PhotoCollectionCard = ({ item }: PhotoCollectionCardProps) => {
  const router = useRouter();
  return <Col xs={24} sm={12} md={8} lg={6} key={item.uuid}>
  <Card
    onClick={() => {
      const parser = new UAParser(window.navigator.userAgent);
      if (parser.getDevice().is('mobile')) {
        router.push(`/member/mobile/photo-collections/${item.uuid}`)
      } else {
        router.push(`/member/pc/photo-collections/${item.uuid}`)
      }
    }}
    hoverable
    cover={
      <div style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className='w-[432px] h-[288px] bg-red-500'>
          <img 
            src={item.cover  ? item.cover+'?imageMogr2/format/webp/thumbnail/x288' :  ''} 
            alt={item.title} 
            style={{ 
              width: '100%', 
              height: '100%',
            }} 
          />
        </div>
      </div>
    }
  >
    <Card.Meta
      title={item.title}
      description={
        <div className="flex justify-between items-center">
          <span>{item.subtitle}</span>
          <span className="text-gray-500">{item.imageCount}P</span>
        </div>
      }
    />
  </Card>
</Col>;
};