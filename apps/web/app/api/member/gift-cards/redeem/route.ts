import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import { auth } from '@/libs/better-auth';
import dayjs from 'dayjs';

const redeemSchema = z.object({
  code: z.string().min(1, '兑换码不能为空'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
        headers: req.headers,
    })
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          code: 401,
          message: '未登录',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { code } = await redeemSchema.parseAsync(body);

    const giftCard = await prisma.giftCard.findFirst({
      where: { code },
    });

    if (!giftCard) {
      return NextResponse.json(
        {
          code: 404,
          message: '礼品卡不存在',
        },
        { status: 404 }
      );
    }
    if (giftCard.status === 'USED') {
      return NextResponse.json(
        {
          code: 400,
          message: '礼品卡已被使用',
        },
        { status: 400 }
      );
    }

    if (giftCard.status === 'EXPIRED') {
      return NextResponse.json(
        {
          code: 400,
          message: '礼品卡已过期',
        },
        { status: 400 }
      );
    }
    // 开启事务处理兑换过程
    await prisma.$transaction(async (tx) => {
      // 更新礼品卡状态
      const updatedGiftCard = await tx.giftCard.update({
        where: { id: giftCard.id },
        data: {
          status: 'USED',
          usedAt: new Date(),
          userId: session.user.id,
        },
      });
      const vipPackage = await tx.giftCardPackage.findUnique({
        where: { id: giftCard.giftCardPackageId },
      });
      if (!vipPackage) {
        throw new Error('VIP套餐不存在');
      }
      let vipExpiredAt = dayjs().add(vipPackage.duration, 'day').toDate();
      if(session.user.vipExpiredAt && dayjs(session.user.vipExpiredAt).isAfter(dayjs()) ) {
        vipExpiredAt = dayjs(session.user.vipExpiredAt).add(vipPackage.duration, 'day').toDate();
      }
      await tx.user.update({
        where: { id: session.user.id },
        data: {
           vipExpiredAt
        },
      });

      return updatedGiftCard;
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Gift card redemption error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}
