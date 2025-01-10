import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  status: z.nativeEnum(OrderStatus).optional(),
  no: z.string().optional(),
  outTradeNo: z.string().optional()
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, status, no, outTradeNo } = await querySchema.parseAsync(searchParams);
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (no) {
      where.no = {
        contains: no
      };
    }
    if (outTradeNo) {
      where.outTradeNo = {
        contains: outTradeNo
      };
    }

    // Get total count
    const total = await prisma.order.count({ where });

    // Get paginated orders
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        no: true,
        status: true,
        outTradeNo: true,
        paidAt: true,
        paidAmount: true,
        vipPackage: {
          select: {
            title: true
          }
        },
        paymentMethod: {
          select: {
            name: true
          }
        }
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
        list: orders.map((order) => ({
          ...order,
          id: Number(order.id),
        })),
        pagination: {
          current: page,
          limit,
          total
        }
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
