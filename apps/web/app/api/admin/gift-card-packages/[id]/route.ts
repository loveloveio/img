import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const updateSchema = z.object({
    title: z.string().min(1, '标题不能为空').optional(),
    subtitle: z.string().optional(),
    cover: z.string().optional(),
    price: z.number().min(0.1, '价格不能为负').optional(),
    duration: z.number().min(1, '有效期不能小于1天').optional(),
    status: z.enum(['ENABLED', 'DISABLED']).optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const pkg = await prisma.giftCardPackage.findUnique({
            where: { id: BigInt(id), deletedAt: null },
        });

        if (!pkg) {
            return NextResponse.json({
                code: 404,
                message: '礼品卡套餐不存在'
            }, { status: 404 });
        }

        return NextResponse.json({
            code: 200,
            message: 'success',
            data: {
                ...pkg,
                id: Number(pkg.id)
            }
        });

    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误'
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, subtitle, cover, price, duration, status } = await updateSchema.parseAsync(body);

        const pkg = await prisma.giftCardPackage.update({
            where: { id: BigInt(id), deletedAt: null },
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
            message: '更新成功',
            data: {
                ...pkg,
                id: Number(pkg.id)
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

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await prisma.giftCardPackage.update({
            where: { id: BigInt(id), deletedAt: null },
            data: {
                deletedAt: new Date()
            }
        });

        return NextResponse.json({
            code: 200,
            message: '删除成功'
        });

    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: '服务器错误'
        }, { status: 500 });
    }
}
