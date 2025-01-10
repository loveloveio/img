import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  name: z.string().optional(),
  status: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  url: z.string().url('请输入有效的URL'),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
  remark: z.string().optional(),
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
    const total = await prisma.serviceEndpoint.count({ where });

    // Get paginated endpoints
    const endpoints = await prisma.serviceEndpoint.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: endpoints.map((endpoint) => ({
          ...endpoint,
          id: Number(endpoint.id)
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
    const { name, url, status, remark } = await createSchema.parseAsync(body);

    const endpoint = await prisma.serviceEndpoint.create({
      data: {
        name,
        url,
        status,
        remark
      }
    });

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        ...endpoint,
        id: Number(endpoint.id)
      }
    });

  } catch (error) {
    console.error(error);
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