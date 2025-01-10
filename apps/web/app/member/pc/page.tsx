'use client';
import { Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoCollection, Tag } from "@prisma/client";
import { PhotoCollectionCard } from "./components/photo-collection-card";
export default function Page() {
  const router = useRouter();
  const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    const fetchPhotoCollections = async () => {
      const res = await fetch('/api/member/photo-collections?recommend=true');
      const data = await res.json();
      console.log('data', data);
      setPhotoCollections(data.data.photoCollections);
    };
    fetchPhotoCollections();
    const fetchTags = async () => {
      const res = await fetch('/api/member/tags');
      const data = await res.json();
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
            <div  onClick={() => {
              router.push(`/member/pc/search?q=${tag.keywords}`);
            }} className="cursor-pointer text-blue-500 hover:text-blue-700 text-base font-bold px-4 py-2 rounded-md border border-blue-500 hover:border-blue-700" key={tag.id}>{tag.title}</div>
          ))}
        </div>
      </div>

      <div className="px-32 mb-32">
        <h1 className="text-2xl font-bold my-8">推荐图集</h1>
        <Row gutter={[16, 16]}>
          {photoCollections.map((item) => (
            <PhotoCollectionCard key={item.id} item={item} />
          ))}
        </Row>
      </div>
    </div>
  );
}
