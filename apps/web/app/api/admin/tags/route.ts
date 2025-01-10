import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  title: z.string().optional(),
  keywords: z.string().optional(),
  allowDevices: z.array(z.string()).default([]).optional()
});

const createSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  keywords: z.string().optional(),
  sort: z.number().default(0),
  allowDevices: z.array(z.string()).default([])
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, title, keywords, allowDevices } = await querySchema.parseAsync(searchParams);
    const where: any = {};
    
    if (title) {
      where.title = {
        contains: title
      };
    }
    if (keywords) {
      where.keywords = {
        contains: keywords
      };
    }
    if (allowDevices) {
      where.allowDevices = {
        hasSome: allowDevices
      };
    }

    // Get total count
    const total = await prisma.tag.count({ where });

    // Get paginated tags
    const tags = await prisma.tag.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        sort: 'asc'
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: tags.map((tag) => ({
          ...tag,
          id: Number(tag.id)
        })),
        pagination: {
          current: page,
          limit,
          total
        }
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        code: 400,
        message: error.errors[0]?.message
      }, { status: 400 });
    }

    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, keywords, sort, allowDevices } = await createSchema.parseAsync(body);

    const tag = await prisma.tag.create({
      data: {
        title,
        keywords,
        sort,
        allowDevices
      }
    });

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        ...tag,
        id: Number(tag.id)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        code: 400,
        message: error.errors[0]?.message
      }, { status: 400 });
    }

    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}
