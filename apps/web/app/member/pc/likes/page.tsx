'use client';
import { useEffect, useState } from 'react';
import { Button, Card, Row, Empty, Spin } from 'antd';
import { PhotoCollection } from '@prisma/client';
import { PhotoCollectionCard } from '../components/photo-collection-card';
import axios from 'axios';
import MainLayout from '@/member/pc/components/main-layout';

interface FavoriteResponse {
  data: {
    total: number;
    items: PhotoCollection[];
  }
}

export default function LikesPage() {
  const [favorites, setFavorites] = useState<PhotoCollection[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageSize = 24; // 增加每页显示数量

  const fetchFavorites = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/member/photo-collection-favorites', {
        params: {
          page: pageNum,
          pageSize: pageSize
        }
      });
      const data: FavoriteResponse = response.data;

      if (pageNum === 1) {
        setFavorites(data.data.items);
      } else {
        setFavorites(prev => [...prev, ...data.data.items]);
      }

      setHasMore(data.data.items.length === pageSize);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFavorites(nextPage);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto py-8 px-6">
        <Card title="我的收藏" bordered={false}>
          <Spin spinning={loading && favorites.length === 0}>
            {favorites.length > 0 ? (
              <>
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {favorites.map((album) => (
                    <div key={album.id} className="mb-4 break-inside-avoid">
                      <PhotoCollectionCard item={album} />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={loadMore}
                    >
                      {loading ? '加载中...' : '加载更多'}
                    </Button>
                  </div>
                )}

                {!hasMore && (
                  <div className="text-center text-gray-500 mt-12">
                    没有更多内容了
                  </div>
                )}
              </>
            ) : !loading ? (
              <Empty
                description="暂无收藏内容"
                className="py-16"
              />
            ) : null}
          </Spin>
        </Card>
      </div>
    </MainLayout>
  );
}
