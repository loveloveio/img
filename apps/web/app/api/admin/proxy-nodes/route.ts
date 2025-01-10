import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  title: z.string().optional(),
  status: z.string().optional(),
});

const createSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  remark: z.string().optional(),
  url: z.string().min(1, 'URL不能为空'),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, title, status } = await querySchema.parseAsync(searchParams);
    const where: any = {};
    
    if (title) {
      where.title = {
        contains: title
      };
    }
    if (status) {
      where.status = status;
    }

    const total = await prisma.proxyNode.count({ where });

    const nodes = await prisma.proxyNode.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: nodes.map((node) => ({
          ...node,
          id: Number(node.id)
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
    const { title, remark, url, status } = await createSchema.parseAsync(body);

    const node = await prisma.proxyNode.create({
      data: {
        title,
        remark,
        url,
        status
      }
    });

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        ...node,
        id: Number(node.id)
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