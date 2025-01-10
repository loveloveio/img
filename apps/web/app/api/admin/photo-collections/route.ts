import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { PhotoCollectionStatus } from '@prisma/client';
import { z } from 'zod';
const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.nativeEnum(PhotoCollectionStatus).optional(),
  title: z.string().optional(),
  tags: z.string().optional(),
  recommend: z.string().transform((value) => value === 'true').optional()
});

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, status, title, tags, recommend } = await querySchema.parseAsync(searchParams);

    const where: any = {
      AND: []
    };

    if (status) {
      where.AND.push({ status });
    }

    if (title) {
      where.AND.push({
        title: {
          contains: title
        }
      });
    }

    if (tags) {
      where.AND.push({
        tags: {
          hasSome: tags.split(',')
        }
      });
    }

    if (recommend) {
      where.AND.push({
        recommend: recommend
      });
    }

    // If no search conditions, remove OR array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Get total count
    const [total, photoCollections] = await prisma.$transaction([
      prisma.photoCollection.count({ where }),
      prisma.photoCollection.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: 'desc'
        }
      })
    ]);


    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: photoCollections.map((item) => ({
          ...item,
          id: Number(item.id)
        })),
        pagination: {
          current: page,
          limit,
          total
        }
      }
    });

  } catch (error) {
    console.error('Fetch data failed:', error);
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


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const createSchema = z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      cover: z.string(),
      tags: z.array(z.string()).optional().default([]),
      previewImages: z.array(z.string()).optional().default([]),
      paidImages: z.array(z.string()).optional().default([]),
      sort: z.number(),
      status: z.enum([PhotoCollectionStatus.ENABLED, PhotoCollectionStatus.DISABLED]).optional().default(PhotoCollectionStatus.ENABLED),
      recommend: z.boolean().optional().default(false)
    });
    const data = await createSchema.parseAsync(body);
    const imageCount = (data.paidImages?.length || 0) + (data.previewImages?.length || 0);
    const photoCollection = await prisma.photoCollection.create({
      data: {
        ...data,
        imageCount
      },
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
    console.error('Create photo collection failed:', error);
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
