import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/better-auth";

// Get favorite status
export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ "photo-collection-id": string }> }
) => {
    const session = await auth.api.getSession({
        headers: req.headers
    });
    if (!session?.user?.id) {
        return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }
    const { "photo-collection-id": photoCollectionId } = await params;
    const photoCollection = await prisma.photoCollection.findFirst({
        where: {
            uuid: photoCollectionId,
            deletedAt: null
        }
    });

    if (!photoCollection) {
        return NextResponse.json({ message: "Photo collection not found" }, { status: 404 });
    }

    const favorite = await prisma.photoCollectionFavorite.findFirst({
        where: {
            userId: session.user.id,
            photoCollectionId: photoCollection.id,
            deletedAt: null
        }
    });

    return NextResponse.json({
        data: {
            isFavorited: !!favorite
        }
    });
};

// Add to favorites
export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ "photo-collection-id": string }> }
) => {
    const session = await auth.api.getSession({
        headers: req.headers
    });
    if (!session?.user?.id) {
        return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    const { "photo-collection-id": photoCollectionId } = await params;
    const photoCollection = await prisma.photoCollection.findFirst({
        where: {
            uuid: photoCollectionId,
            deletedAt: null
        }
    });

    if (!photoCollection) {
        return NextResponse.json({ message: "Photo collection not found" }, { status: 404 });
    }

    const existingFavorite = await prisma.photoCollectionFavorite.findFirst({
        where: {
            userId: session.user.id,
            photoCollectionId: photoCollection.id,
            deletedAt: null
        }
    });

    if (existingFavorite) {
        return NextResponse.json({ message: "Already favorited" }, { status: 400 });
    }

    await prisma.photoCollectionFavorite.create({
        data: {
            userId: session.user.id,
            photoCollectionId: photoCollection.id
        }
    });

    return NextResponse.json({
        data: {
            message: "Added to favorites successfully"
        }
    });
};

// Remove from favorites
export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ "photo-collection-id": string }> }
) => {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session?.user?.id) {
        return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    const { "photo-collection-id": photoCollectionId } = await params;
    const photoCollection = await prisma.photoCollection.findFirst({
        where: {
            uuid: photoCollectionId,
            deletedAt: null
        }
    });

    if (!photoCollection) {
        return NextResponse.json({ status: 404, message: "Photo collection not found" }, { status: 404 });
    }

    const favorite = await prisma.photoCollectionFavorite.findFirst({
        where: {
            userId: session.user.id,
            photoCollectionId: photoCollection.id,
            deletedAt: null
        }
    });

    if (!favorite) {
        return NextResponse.json({ status: 404, message: "Favorite not found" }, { status: 404 });
    }

    await prisma.photoCollectionFavorite.delete({
        where: {
            id: favorite.id
        }
    });

    return NextResponse.json({
        status: 200,
        message: "Removed from favorites successfully"
    });
};
