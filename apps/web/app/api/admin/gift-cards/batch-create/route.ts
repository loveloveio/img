import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import Crypto from 'crypto';
import { Prisma } from '@prisma/client';

const batchCreateSchema = z.object({
    giftCardPackageId: z.number().int().positive(),
    count: z.number().int().min(1).max(10000),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { giftCardPackageId, count } = await batchCreateSchema.parseAsync(body);

        const giftCards = [];
        for (let i = 0; i < count; i++) {
            const code = 'G' + Crypto.randomBytes(16).toString('hex').toUpperCase();
            giftCards.push({
                code,
                giftCardPackageId: BigInt(giftCardPackageId),
                status: 'UNUSED',
            });
        }

        await prisma.giftCard.createMany({
            data: giftCards as Prisma.GiftCardCreateManyInput[],
        });

        return NextResponse.json({
            code: 200,
            message: '批量创建成功',
        });

    } catch (error) {
        console.error('批量创建礼品卡失败', error);
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
