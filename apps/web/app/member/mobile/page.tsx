'use client';
import { Tab, Tabs } from "@nextui-org/react";
import { TabLayout } from "./components/tab-layout";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { PhotoCollection, Tag } from "@prisma/client";
import axios from "axios";
import { PhotoCollectionCard } from "./components/photo-collection-card";
interface Tab {
    title: string;
    key: string;
}
export default function Mobile() {
    const router = useRouter();
    const [tag, setTag] = useState<Tag[]>([]);
    const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>([]);
    const [keywords, setKeywords] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const loadingRef = useRef<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(5);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchPhotoCollections = async (params: {
        keywords: string;
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
                    q: params.keywords,
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
    };

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch('/api/member/tags');
            const data = await res.json();
            if (data.data.tags.length > 0) {
                setTag(data.data.tags);
                setKeywords(data.data.tags[0].keywords);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (keywords) {
            setPage(1);
            fetchPhotoCollections({
                keywords: keywords,
                page: 1,
                pageSize: pageSize
            });
        }
    }, [keywords, pageSize]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loading || !hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop <= clientHeight + 100) {
                setPage(prev => prev + 1);
                fetchPhotoCollections({
                    keywords,
                    page: page + 1,
                    pageSize,
                    append: true
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, keywords, page, pageSize]);

    return <TabLayout>
        <div ref={containerRef} className="overflow-y-auto pb-32 h-screen flex flex-col">
            <div className="flex w-full relative h-[60px] items-center">
                <div className="w-full overflow-x-auto scrollbar-hide pr-10">
                    <Tabs onSelectionChange={(key) => setKeywords(key.toString())} variant="underlined" color="primary" aria-label="分类选项" className="w-max">
                        {tag.map((tag) => (
                            <Tab key={tag.keywords} title={tag.title}></Tab>
                        ))}
                    </Tabs>
                </div>
                <div onClick={() => router.push(`/member/mobile/search`)} className="absolute h-full px-2 flex items-center justify-center right-0 top-0 bg-white/50 dark:bg-gray-800/50">
                    <SearchOutlined size={32} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
                {photoCollections.map((album, index) => (
                    <PhotoCollectionCard key={index} item={album} />
                ))}
            </div>
            {loading && (
                <div className="flex justify-center items-center p-4">
                    <LoadingOutlined className="animate-spin" size={24} />
                </div>
            )}
            {!hasMore && photoCollections.length > 0 && (
                <div className="text-center text-gray-500 p-4">
                    没有更多数据了
                </div>
            )}
        </div>
    </TabLayout>;
}
