'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PhotoCollection } from '@prisma/client';
import { PhotoCollectionCard } from '@/member/pc/components/photo-collection-card';
import { authClient } from '@/libs/better-client';
import dayjs from 'dayjs';
import { Card, Image, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    const fetchPhotoCollection = useCallback(async () => {
        try {
            const response = await axios.get(`/api/member/photo-collections/${uuid}`);
            const data = response.data;
            if (data.code === 200) {
                setPhotoCollection(data.data.photoCollection);
                setImages([...data.data.photoCollection.previewImages, ...data.data.photoCollection.paidImages].map((image) => ({ src: image })));
            }
        } catch (error) {
            console.error('Error fetching photo collection:', error);
        }
    }, [])
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
    }, [])
    const checkFavoriteStatus = useCallback(async () => {
        try {
            const response = await axios.get(`/api/member/photo-collection-favorites/${uuid}`);
            setIsFavorited(response.data.data.isFavorited);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    }, [])

    const init = async () => {
        fetchPhotoCollection();
        fetchRecommended();
    };
    useEffect(() => {
        console.log(session, isPending);
        if (!isPending) {
            if (session) {
                setLogin(true);
                if (!session.user.vipExpiredAt) {
                    setIsVip(false);
                } else {
                    dayjs(session.user.vipExpiredAt).isAfter(dayjs()) ? setIsVip(true) : setIsVip(false);
                }
                console.log('init');
                checkFavoriteStatus();
            } else {
                setLogin(false);
            }
        }
    }, [session, isPending]);
    useEffect(() => {
        init();
    }, [])

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand>
                    <button onClick={() => router.back()} className="text-lg">
                        ←
                    </button>
                </NavbarBrand>
                <NavbarContent justify="center" className="bg-primary-50">
                    <NavbarItem>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <div className="max-w-screen-md py-4">
                {/* 相册详情 */}
                <Card className="mb-4 p-4 mx-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl mb-2">{photoCollection?.title}</h1>
                            <p className="text-gray-500">{photoCollection?.subtitle}</p>
                            <p className="text-gray-500">{photoCollection?.description}</p>
                        </div>
                    </div>
                </Card>
                <div className="grid grid-cols-1 gap-2 mx-4">
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={image.src}
                            alt={`Preview ${index + 1}`}
                            className="w-full"
                            onClick={() => {
                                setIndex(index);
                                setOpen(true);
                            }}
                        />
                    ))}
                </div>

                {!isVip && (
                    <Card className="mb-4 mx-4 p-4 bg-warning-50 mt-4">
                        <h2 className="text-lg mb-2">升级会员，享受完整内容</h2>
                        <p className="text-gray-500 mb-4">成为会员即可查看所有高清图片</p>
                        <Button
                            color="warning"
                            onPress={() => {
                                if (login) {
                                    router.push('/member/mobile/top-up')
                                } else {
                                    router.push('/member/mobile/login')
                                }
                            }}
                        >
                            立即开通会员，解锁VIP专享图片
                        </Button>
                    </Card>
                )}
                <Card className="mb-4 mx-4 p-4">
                    <Button
                        color={isFavorited ? "danger" : "primary"}
                        variant={isFavorited ? "flat" : "solid"}
                        onPress={async () => {
                            if (!login) {
                                router.push('/member/mobile/login');
                                return;
                            }
                            try {
                                if (isFavorited) {
                                    await axios.delete(`/api/member/photo-collection-favorites/${uuid}`);
                                    setIsFavorited(false);
                                } else {
                                    await axios.post(`/api/member/photo-collection-favorites/${uuid}`);
                                    setIsFavorited(true);
                                }
                            } catch (error) {
                                console.error('Failed to update favorite status:', error);
                            }
                        }}
                        className="w-full"
                    >
                        {isFavorited ? '取消收藏' : '添加到收藏'}
                    </Button>
                </Card>
                <h2 className="text-lg px-4">💝 猜你喜欢</h2>
                <div className="grid grid-cols-2 gap-4 p-4">
                    {recommendedCollections.map((album) => (
                        <PhotoCollectionCard key={album.uuid} item={album} />
                    ))}
                </div>
            </div>
            <Lightbox
                open={open}
                index={index}
                close={() => setOpen(false)}
                slides={images}
            />
        </>
    );
}