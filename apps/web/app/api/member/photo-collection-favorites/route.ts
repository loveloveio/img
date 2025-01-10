import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/better-auth";

export const GET = async (request: NextRequest) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session?.user?.id) {
        return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;

    const [total, favorites] = await Promise.all([
        prisma.photoCollectionFavorite.count({
            where: {
                userId: session.user.id,
                deletedAt: null
            }
        }),
        prisma.photoCollectionFavorite.findMany({
            where: {
                userId: session.user.id,
                deletedAt: null
            },
            include: {
                photoCollection: {
                    select: {
                        uuid: true,
                        title: true,
                        subtitle: true,
                        cover: true,
                        tags: true,
                        imageCount: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: pageSize
        })
    ]);

    return NextResponse.json({
        data: {
            total,
            items: favorites.map(favorite => {
                return {
                    uuid: favorite.photoCollection.uuid,
                    title: favorite.photoCollection.title,
                    subtitle: favorite.photoCollection.subtitle,
                    cover: favorite.photoCollection.cover,
                    tags: favorite.photoCollection.tags,
                    imageCount: favorite.photoCollection.imageCount,
                    createdAt: favorite.createdAt
                }
            })
        }
    });
};
