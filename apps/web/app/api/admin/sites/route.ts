import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  name: z.string().optional(),
  status: z.enum(['ENABLED', 'DISABLED']).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, name, status } = await querySchema.parseAsync(searchParams);
    const where: any = {};

    if (name) {
      where.name = {
        contains: name
      };
    }
    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.site.count({ where });

    // Get paginated sites
    const sites = await prisma.site.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      },
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: sites.map(site => ({
          ...site,
          id: Number(site.id),
        })),
        total
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

const createSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  url: z.string().url('请输入有效的URL'),
  icon: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
  sort: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await createSchema.parseAsync(body);

    const site = await prisma.site.create({
      data
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        site: {
          ...site,
          id: Number(site.id),
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
