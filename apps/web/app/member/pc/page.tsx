'use client';
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoCollection, Tag } from "@prisma/client";
import { PhotoCollectionCard } from "./components/photo-collection-card";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [geo, ] = useState({
    lat: Math.random() * 180 - 90,
    lng: Math.random() * 360 - 180
  });

  const fetchPhotoCollections = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/member/photo-collections', {
        params: {
          page: currentPage,
          pageSize: 10,
          recommend: true,
          random: true,
          lat: geo.lat,
          lng: geo.lng
        }
      });
      const data = res.data;
      if (currentPage === 1) {
        setPhotoCollections(data.data.photoCollections);
      } else {
        setPhotoCollections(prev => [...prev, ...data.data.photoCollections]);
      }
      setHasMore(data.data.photoCollections.length > 0);
      setPage(currentPage);
    } catch (error) {
      console.error('Failed to fetch photo collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoCollections(1);
    const fetchTags = async () => {
      const res = await axios.get('/api/member/tags');
      const data = res.data;
      setTags(data.data.tags.filter((tag: Tag) => tag.allowDevices.includes('DESKTOP')));
    };
    fetchTags();
  }, []);
  return (
    <div className="w-full">
      <div className="flex flex-col items-center my-16">
        <h1 style={{ textAlign: 'center', marginBottom: 24, fontSize: '2em' }}>
          探索精彩图集 🖼️✨
        </h1>
        <Input.Search
          placeholder="搜索图集..."
          enterButton
          size="large"
          onSearch={(value) => {
            if (value) {
              router.push(`/member/pc/search?q=${value}`);
            }
          }}
          prefix={<SearchOutlined />}
          style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <div onClick={() => {
              router.push(`/member/pc/search?q=${tag.keywords}`);
            }} className="cursor-pointer text-blue-500 hover:text-blue-700 text-base font-bold px-4 py-2 rounded-md border border-blue-500 hover:border-blue-700" key={tag.id}>{tag.title}</div>
          ))}
        </div>
      </div>

      <div className="px-32 mb-32">
        <h1 className="text-2xl font-bold my-8">推荐图集</h1>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-2">
          {photoCollections.map((album) => (
            <div key={album.id} className="mb-4 break-inside-avoid">
              <PhotoCollectionCard item={album} />
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button 
              loading={loading}
              onClick={() => {
                fetchPhotoCollections(page + 1);
              }}
              size="large"
            >
              加载更多
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
