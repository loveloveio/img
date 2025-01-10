import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPhotoCollectionIndex } from "@/libs/meilisearch";
import { PhotoCollection } from "@prisma/client";

const searchParamsSchema = z.object({
    q: z.string().optional(),
    recommend: z.string().transform(val => val === 'true').optional(),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    pageSize: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = await searchParamsSchema.parseAsync({
            ...Object.fromEntries(searchParams),
            tags: searchParams.getAll('tags')
        });
        const filter = ['status = ENABLED'];
        if (params.recommend) {
            filter.push('recommend = true');
        }
        const index = await getPhotoCollectionIndex();
        const result = await index?.search(params.q, {
            filter: filter,
            limit: params.pageSize,
            offset: (params.page - 1) * params.pageSize
        });
        const photoCollections = ((result?.hits ?? []) as PhotoCollection[]).map(item => ({
            uuid: item.uuid,
            title: item.title,
            subtitle: item.subtitle,
            cover: item.cover,
            recommend: item.recommend,
            imageCount: item.imageCount,
        }));
        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                photoCollections: photoCollections,
            }
        });
    } catch (error) {
        console.error('Error fetching photo collections:', error);
        return NextResponse.json({
            code: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}
