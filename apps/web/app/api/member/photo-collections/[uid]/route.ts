import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/db";
import { auth } from "@/libs/better-auth";
import { PhotoCollectionStatus } from "@prisma/client";
import dayjs from "dayjs";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });
        const { uid } = await params;
        const collection = await prisma.photoCollection.findFirst({
            where: {
                uuid:uid,
                status: PhotoCollectionStatus.ENABLED,
                deletedAt: null
            },
            select: {
                uuid: true,
                title: true,
                subtitle: true,
                description: true,
                cover: true,
                tags: true,
                previewImages: true,
                paidImages: true,
                createdAt: true
            }
        });

        if (!collection) {
            return NextResponse.json({
                code: 404,
                message: "Photo collection not found"
            }, { status: 404 });
        }

        const member = await prisma.user.findUnique({
            where: { id: session?.user.id },
            select: {
                vipExpiredAt: true
            }
        });
        const isValidVip = member?.vipExpiredAt && dayjs().isBefore(member.vipExpiredAt);

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                photoCollection: {
                    ...collection,
                    uuid: collection.uuid,
                    paidImages: isValidVip ? collection.paidImages : []
                }
            }
        });

    } catch (error) {
        console.error('Error fetching photo collection:', error);
        return NextResponse.json({
            code: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}
