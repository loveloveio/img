import { NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import dayjs from 'dayjs';

const writeOffSchema = z.object({
  userId: z.string().optional(),
});

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params
      const body = await request.json();
      const data = await writeOffSchema.parseAsync(body);
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        return NextResponse.json({ code: 400, message: '会员不存在' }, { status: 400 });
      }
      const giftCard = await prisma.giftCard.findUnique({
        select: {
          id: true,
          status: true,
          usedAt: true,
          userId: true,
          giftCardPackage: {
            select: {
              id: true,
              duration: true,
            }
          }
        },
        where: { id: BigInt(id) },
      });
      if (!giftCard) {
        return NextResponse.json({ code: 400, message: '礼品卡不存在' }, { status: 400 });
      }
      if (giftCard.status !== 'UNUSED') {
        return NextResponse.json({ code: 400, message: '礼品卡已使用' }, { status: 400 });
      }
      const updated = await prisma.$transaction(async (tx) => {
        const updated = await tx.giftCard.update({
          where: { id: BigInt(id) },
          data: {
            ...data,
            status: 'USED',
            usedAt: new Date(),
            userId: user.id,
          }
        });
        const duration = giftCard.giftCardPackage.duration;
        if(user.vipExpiredAt) {
          if(dayjs(user.vipExpiredAt).isBefore(dayjs())) {
            user.vipExpiredAt = dayjs().add(duration, 'day').toDate();
          } else {
            user.vipExpiredAt = dayjs(user.vipExpiredAt).add(duration, 'day').toDate();
          }
        } else {
          user.vipExpiredAt = dayjs().add(duration, 'day').toDate();
        }
        await tx.user.update({
          where: { id: user.id },
          data: {
            vipExpiredAt: user.vipExpiredAt,
          }
        });
        return updated;
      });
      return NextResponse.json({
        code: 200,
        message: 'success',
        data: {
          ...updated,
          id: Number(updated.id),
          giftCardPackageId: Number(updated.giftCardPackageId),
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          code: 400,
          message: error.errors[0]?.message
        }, { status: 400 });
      }
      
      return NextResponse.json({ message: '服务异常', code: 500 }, { status: 500 });
    }
  }