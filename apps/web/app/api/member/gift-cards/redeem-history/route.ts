import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { auth } from '@/libs/better-auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          code: 401,
          message: '未登录',
        },
        { status: 401 }
      );
    }

    const giftCards = await prisma.giftCard.findMany({
      where: {
        userId: session.user.id,
        status: 'USED'
      },
      select: {
        code: true,
        usedAt: true,
        giftCardPackage: {
          select: {
            duration: true
          }
        }
      },
      orderBy: {
        usedAt: 'desc'
      }
    });
    console.log('giftCards', giftCards)
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: giftCards.map(card => ({
          code: card.code,
          duration: card.giftCardPackage.duration,
          usedAt: card.usedAt,
        }))
      }
    });

  } catch (error) {
    console.error('Get gift card history error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}
