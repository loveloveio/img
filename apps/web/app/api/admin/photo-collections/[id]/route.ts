import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { PhotoCollectionStatus } from '@prisma/client';
import { z } from 'zod';

// Schema for PUT request body
const updateSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string(),
  previewImages: z.array(z.string()).optional(),
  paidImages: z.array(z.string()).optional(),
  sort: z.number().optional(),
  status: z.nativeEnum(PhotoCollectionStatus).optional(),
  recommend: z.boolean().optional()
});

// GET - Get photo collection details
export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const photoCollection = await prisma.photoCollection.findUnique({
      where: { id: BigInt(id) }
    });

    if (!photoCollection) {
      return NextResponse.json({
        code: 404,
        message: 'Photo collection not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: photoCollection
    });

  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT - Update photo collection
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await updateSchema.parseAsync(body);
    const imageCount = (data.paidImages?.length || 0) + (data.previewImages?.length || 0);
    const photoCollection = await prisma.photoCollection.update({
      where: { id: BigInt(id) },
      data: {
        ...data,
        imageCount
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        photoCollection: {
          ...photoCollection,
          id: Number(photoCollection.id)
        }
      }
    });

  } catch (error) {
    console.error('Error updating photo collection:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        code: 400,
        message: error.errors[0]?.message
      }, { status: 400 });
    }

    return NextResponse.json({
      code: 500, 
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE - Delete photo collection
export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) => {
  try {
    const { id } = await params;
    await prisma.photoCollection.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      code: 200,
      message: 'success'
    });

  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
