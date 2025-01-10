'use client';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { PhotoCollection } from '@prisma/client';
import { PhotoCollectionCard } from '../components/photo-collection-card';
import axios from 'axios';
import { NavBar } from '@/member/mobile/components/nav-bar';

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
    const pageSize = 10;

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
        <>
            <NavBar title="我的收藏" />
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {favorites.map((favorite) => (
                        <PhotoCollectionCard
                            key={favorite.uuid}
                            item={favorite}
                        />
                    ))}
                </div>

                {hasMore && (
                    <div className="mt-4 text-center">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={loadMore}
                            isLoading={loading}
                        >
                            {loading ? '加载中...' : '加载更多'}
                        </Button>
                    </div>
                )}

                {!hasMore && favorites.length > 0 && (
                    <div className="mt-4 text-center text-gray-500">
                        没有更多内容了
                    </div>
                )}

                {favorites.length === 0 && !loading && (
                    <div className="text-center text-gray-500 mt-8">
                        暂无收藏内容
                    </div>
                )}
            </div>
        </>
    );
}
