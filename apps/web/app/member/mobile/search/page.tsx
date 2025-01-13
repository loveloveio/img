'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { PhotoCollection } from "@prisma/client";
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
    const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>([]);
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [loading, setLoading] = useState<boolean>(false);
    const loadingRef = useRef<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(5);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchPhotoCollections = useCallback(async (params: {
        keyword: string;
        page: number;
        pageSize: number;
        append?: boolean;
    }) => {
        if (loadingRef.current) {
            return;
        }
        setLoading(true);
        loadingRef.current = true;
        try {
            const res = await axios.get(`/api/member/photo-collections`, {
                params: {
                    q: params.keyword,
                    page: params.page,
                    pageSize: params.pageSize
                }
            });
            const newCollections = res.data.data.photoCollections;
            if (newCollections.length < pageSize) {
                setHasMore(false);
            }
            if (params.append) {
                setPhotoCollections(prev => [...prev, ...newCollections]);
            } else {
                setPhotoCollections(newCollections);
                setHasMore(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || !hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop <= clientHeight + 100) {
                setPage(prev => prev + 1);
                fetchPhotoCollections({
                    keyword,
                    page: page + 1,
                    pageSize,
                    append: true
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, keyword, page, pageSize]);

    return (
        <div ref={containerRef} className="overflow-y-auto pb-32 h-screen flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.replace(`/member/mobile/search?q=${keyword}`);
                                    setPage(1);
                                    fetchPhotoCollections({
                                        keyword: keyword,
                                        page: 1,
                                        pageSize: pageSize
                                    });
                                }
                            }}
                            placeholder="搜索图集..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:border-blue-500"
                        />
                        <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-2">
                {photoCollections.map((album) => (
                    <div key={album.id} className="mb-4 break-inside-avoid">
                        <PhotoCollectionCard item={album} />
                    </div>
                ))}
            </div>
            {loading && (
                <div className="flex justify-center items-center p-4">
                    <LoadingOutlined className="animate-spin" />
                </div>
            )}
            {!hasMore && photoCollections.length > 0 && (
                <div className="text-center text-gray-500 p-4">
                    没有更多数据了
                </div>
            )}
        </div>
    );
}
