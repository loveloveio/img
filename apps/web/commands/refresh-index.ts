import { prisma } from '@/libs/db';
import '@/libs/meilisearch';
import { getPhotoCollectionIndex } from "@/libs/meilisearch";
(async () => {
    const index = await getPhotoCollectionIndex();
    console.log('开始删除索引',index);
     await index?.deleteAllDocuments();
    const photoCollections = await prisma.photoCollection.findMany();
    console.log('photoCollections',photoCollections);
    const documents: any[] = [];
    for (const photoCollection of photoCollections) {
            documents.push({
                id: Number(photoCollection.id),
                imageCount: photoCollection.imageCount,
                uuid: photoCollection.uuid ?? '',
                title: photoCollection.title ?? '',
                cover: photoCollection.cover ?? '',
                subtitle: photoCollection.subtitle ?? '',
                tags: photoCollection.tags ?? [],
                recommend: photoCollection.recommend,
                status: photoCollection.status,
                description: photoCollection.description ?? '',
                createdAt: photoCollection.createdAt,
                updatedAt: photoCollection.updatedAt,
                _geo: {
                    lat: Math.random() * 180 - 90,
                    lng: Math.random() * 360 - 180
                },
            });
    }
    const resq = await index?.addDocuments(documents);
    console.log('索引更新完成',resq);
    process.exit(0);
})();