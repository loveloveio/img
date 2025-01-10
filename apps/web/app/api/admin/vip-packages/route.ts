import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  title: z.string().optional(),
  status: z.enum(['ENABLED', 'DISABLED']).optional(),
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

    // Get total count
    const total = await prisma.vipPackage.count({ where });

    // Get paginated VIP packages
    const vipPackages = await prisma.vipPackage.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        status: true,
        price: true,
        duration: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: vipPackages.map(pkg => ({
          ...pkg,
          id: Number(pkg.id),
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
  title: z.string().min(1, '标题不能为空'),
  subtitle: z.string().optional(),
  price: z.number().min(0, '价格不能为空'),
  duration: z.number().min(1, '有效期不能为空'),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, price, duration, status } = await createSchema.parseAsync(body);
    const data = await prisma.vipPackage.create({
      data: {
        title,
        subtitle,
        price,
        duration,
        status,
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        vipPackage: {
            ...data,
            id: Number(data.id),
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}
