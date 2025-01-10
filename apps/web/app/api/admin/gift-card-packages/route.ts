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
  title: z.string().min(1, '标题不能为空'),
  subtitle: z.string().optional(),
  cover: z.string().optional(),
  price: z.number().min(0, '价格不能为负'),
  duration: z.number().min(1, '有效期不能小于1天'),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, name, status } = await querySchema.parseAsync(searchParams);
    const where: any = {
      deletedAt: null
    };
    
    if (name) {
      where.title = {
        contains: name
      };
    }
    if (status) {
      where.status = status;
    }

    const total = await prisma.giftCardPackage.count({ where });

    const packages = await prisma.giftCardPackage.findMany({
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
        list: packages.map((pkg) => ({
          ...pkg,
          id: Number(pkg.id)
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
    const { title, subtitle, cover, price, duration, status } = await createSchema.parseAsync(body);

    const pkg = await prisma.giftCardPackage.create({
      data: {
        title,
        subtitle,
        cover,
        price,
        duration,
        status
      }
    });

    return NextResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        ...pkg,
        id: Number(pkg.id)
      }
    });

  } catch (error) {
    console.log('error', error);
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