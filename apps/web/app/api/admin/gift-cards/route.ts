import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  code: z.string().optional(),
  status: z.enum(['UNUSED', 'USED', 'EXPIRED']).optional(),
});
export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { page, limit, code, status } = await querySchema.parseAsync(searchParams);
    const where: any = {};
    
    if (code) {
      where.code = {
        contains: code
      };
    }
    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.giftCard.count({ where });

    // Get paginated gift cards
    const giftCards = await prisma.giftCard.findMany({
      select: {
        id: true,
        code: true,
        status: true,
        createdAt: true,
        usedAt: true,
        giftCardPackage: {
          select: {
            title: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
          }
        }
      },
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
        list: giftCards.map(card => ({
          ...card,
          id: Number(card.id),
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