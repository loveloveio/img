import { Card } from 'antd';
import { PhotoCollection } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { UAParser } from 'ua-parser-js'
export interface PhotoCollectionCardProps {
  item: PhotoCollection;
}

export const PhotoCollectionCard = ({ item }: PhotoCollectionCardProps) => {
  const router = useRouter();
  return <Card
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
      <div className='w-full bg-gray-100 flex items-center justify-center'>
        <img
          src={item.cover ? item.cover + '?imageMogr2/format/webp/thumbnail/432x' : ''}
          alt={item.title}
          className="w-full"
        />
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
};