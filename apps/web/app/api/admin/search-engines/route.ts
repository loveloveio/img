import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { SearchEngineStatus } from '@prisma/client';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.nativeEnum(SearchEngineStatus).optional(),
  q: z.string().optional(),
});

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, status, q } = await querySchema.parseAsync(searchParams);

    const where: any = {
      AND: []
    };

    if (status) {
      where.AND.push({ status });
    }

    if (q) {
      where.AND.push({
        name: {
          contains: q
        }
      });
    }

    // If no search conditions, remove AND array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Get total count
    const [total, searchEngines] = await prisma.$transaction([
      prisma.searchEngine.count({ where }),
      prisma.searchEngine.findMany({
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
        searchEngines: searchEngines,
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
};

const createSchema = z.object({
  icon: z.string().url(),
  name: z.string(),
  url: z.string(),
  remark: z.string().optional(),
  status: z.nativeEnum(SearchEngineStatus).optional().default(SearchEngineStatus.ENABLED),
  sort: z.number().optional().default(0)
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = await createSchema.parseAsync(body);
    await prisma.searchEngine.create({
      data:{
        ...data,
        remark: data.remark || ''
      },
    });
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: null
    });

  } catch (error) {
    console.error('Create search engine failed:', error);

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
};