'use client';
import { Suspense, useCallback } from 'react';
import { useEffect, useState } from "react";
import { Input, Row, Spin, Empty, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PhotoCollection } from "@prisma/client";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { PhotoCollectionCard } from "../components/photo-collection-card";

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 20;

    const handleSearch = useCallback(async (currentPage: number, append: boolean = false) => {
        if (!keyword.trim()) return;

        setLoading(true);
        try {
            const res = await axios.get(`/api/member/photo-collections`, {
                params: {
                    q: keyword,
                    page: currentPage,
                    pageSize
                }
            });
            const newCollections = res.data.data.photoCollections;
            
            if (newCollections.length < pageSize) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (append) {
                setPhotoCollections(prev => [...prev, ...newCollections]);
            } else {
                setPhotoCollections(newCollections);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setPage(1);
        const timer = setTimeout(() => {
            handleSearch(1);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        handleSearch(nextPage, true);
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <Input.Search
                    placeholder="搜索图集..."
                    enterButton
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                    }}
                    size="large"
                    onSearch={(value) => {
                        setTimeout(() => {
                            handleSearch(1);
                            router.replace(`/member/pc/search?q=${value}`);
                        }, 500);
                    }}
                    prefix={<SearchOutlined />}
                    style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}
                />
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {photoCollections.map((album) => (
                    <div key={album.id} className="mb-4 break-inside-avoid">
                        <PhotoCollectionCard item={album} />
                    </div>
                ))}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Spin size="large" />
                </div>
            )}

            {!loading && photoCollections.length === 0 && keyword && (
                <div style={{ marginTop: 32 }}>
                    <Empty description="未找到相关相册" />
                </div>
            )}

            {!loading && hasMore && photoCollections.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Button onClick={loadMore}>加载更多</Button>
                </div>
            )}

            {!loading && !hasMore && photoCollections.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 32, color: '#999' }}>
                    没有更多数据了
                </div>
            )}
        </div>
    );
}
