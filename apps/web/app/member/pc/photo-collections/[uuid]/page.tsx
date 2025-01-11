'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PhotoCollection } from '@prisma/client';
import { PhotoCollectionCard } from '@/member/pc/components/photo-collection-card';
import { Row, Image, Button } from 'antd';
import { authClient } from '@/libs/better-client';
import dayjs from 'dayjs';
import axios from 'axios';

export default function PhotoCollectionDetailPage() {
    const { uuid } = useParams();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isVip, setIsVip] = useState(false);
    const [login, setLogin] = useState(false);
    const [photoCollection, setPhotoCollection] = useState<PhotoCollection | null>(null);
    const [recommendedCollections, setRecommendedCollections] = useState<any[]>([]);
    const [images, setImages] = useState<{ src: string }[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkFavoriteStatus = useCallback(async () => {
        try {
            const response = await axios.get(`/api/member/photo-collection-favorites/${uuid}`);
            console.log('checkFavoriteStatus', response.data.data.isFavorited);
            setIsFavorite(response.data.data.isFavorited);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    },[])
    const fetchPhotoCollection = useCallback(async () => {
        try {
            const response = await axios.get(`/api/member/photo-collections/${uuid}`);
            const data = response.data;
            if (data.code === 200) {
                setPhotoCollection(data.data.photoCollection);
                setImages([...data.data.photoCollection.previewImages, ...data.data.photoCollection.paidImages].map((image) => ({ src: image })));
                setIsFavorite(data.data.photoCollection.isFavorite);
            }
        } catch (error) {
            console.error('Error fetching photo collection:', error);
        }
    },[]);
    const fetchRecommended = useCallback(async () => {
        try {
            const response = await axios.get('/api/member/photo-collections?recommend=true');
            const data = response.data;
            if (data.code === 200) {
                // 排除自己
                const filteredCollections = data.data.photoCollections.filter((collection: any) => collection.uuid !== uuid);
                // 随机排序
                const shuffledCollections = filteredCollections.sort(() => Math.random() - 0.5);
                setRecommendedCollections(shuffledCollections);
            }
        } catch (error) {
            console.error('Error fetching recommended collections:', error);
        }
    },[])
    const init = () => {
        fetchPhotoCollection();
        fetchRecommended();
    }
    useEffect(() => {
        if (!isPending) {
            if (session) {
                setLogin(true);
                if (!session.user.vipExpiredAt) {
                    setIsVip(false);
                } else {
                    dayjs(session.user.vipExpiredAt).isAfter(dayjs()) ? setIsVip(true) : setIsVip(false);
                }

                checkFavoriteStatus();
                
            } else {
                setLogin(false);
            }
        }
    }, [session, isPending]);
    useEffect(() => {
        init();
    },[])

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* 相册详情 */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold mb-4">{photoCollection?.title}</h1>
                    <Button
                        type={isFavorite ? "primary" : "default"}
                        onClick={async () => {
                            if (!login) {
                                router.push('/member/mobile/login');
                                return;
                            }
                            try {
                                if (isFavorite) {
                                    await axios.delete(`/api/member/photo-collection-favorites/${uuid}`);
                                    setIsFavorite(false);
                                } else {
                                    await axios.post(`/api/member/photo-collection-favorites/${uuid}`);
                                    setIsFavorite(true);
                                }
                            } catch (error) {
                                console.error('Failed to update favorite status:', error);
                            }
                        }}
                        loading={loading}
                    >
                        {isFavorite ? '取消收藏' : '收藏'}
                    </Button>
                </div>
                <p className="text-gray-600">{photoCollection?.description}</p>
            </div>

            {/* 预览图片列表 */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={image.src}
                            alt={`Preview ${index + 1}`}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
            {!isVip && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-2">升级会员，享受完整内容</h2>
                    <p className="text-gray-600 mb-4">成为会员即可查看所有高清图片</p>
                    <button onClick={() => {
                        if (login) {
                            router.push('/member/pc/top-up')
                        } else {
                            router.push('/member/pc/sign-in')
                        }
                    }} className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
                        立即开通会员，解锁VIP专享图片
                    </button>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">💝 猜你喜欢</h2>
                <Row gutter={[24, 24]}>
                    {recommendedCollections.map((collection) => (
                        <PhotoCollectionCard key={collection.uuid} item={collection} />
                    ))}
                </Row>
            </div>
        </div>
    );
}