'use client';
import { PhotoCollection } from '@prisma/client';
import { useRouter } from 'next/navigation';

export interface PhotoCollectionCardProps {
  item: PhotoCollection;
}

export const PhotoCollectionCard = ({ item }: PhotoCollectionCardProps) => {
  const router = useRouter();
  return <div onClick={() => router.push(`/member/mobile/photo-collections/${item.uuid}`)} className="bg-white dark:bg-gray-800 shadow-md overflow-hidden relative">
    <div className='w-full bg-gray-100 flex items-center justify-center'>
      <img
        src={item.cover ? item.cover + '?imageMogr2/format/webp/thumbnail/432x' : ''}
        alt={item.title}
        className="w-full"
      />
    </div>
    {item.recommend && (
      <div className="absolute top-0 right-0">
        <span className="text-xs text-white bg-red-500 px-2 py-1">推荐</span>
      </div>
    )}
    <div className="p-2">
      <h3 className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">{item.title}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded px-1 inline-block">
        {item.imageCount}p
      </p>
    </div>
  </div>
};