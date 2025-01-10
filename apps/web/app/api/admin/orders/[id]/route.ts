import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { OrderStatus } from '@prisma/client';

// 统一错误响应处理
const errorResponse = (status: number, message: string) => {
    return NextResponse.json({ code: status, message }, { status });
};

// 统一成功响应处理
const successResponse = (data?: any) => {
    return NextResponse.json({
        code: 200,
        message: "success",
        ...(data && { data })
    });
};

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id: BigInt(id) },
            include: {
                paymentMethod: true,
                vipPackage: true,
                user: true
            }
        });

        if (!order) {
            return errorResponse(404, "订单不存在");
        }

        return successResponse({ order });
    } catch (error) {
        return errorResponse(500, "服务器错误");
    }
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id: BigInt(id), status: OrderStatus.PENDING     }
        });

        if (!order) {
            return errorResponse(404, "订单不存在");
        }

        await prisma.order.delete({
            where: { id: BigInt(id) }
        });

        return successResponse();
    } catch (error) {
        return errorResponse(500, "服务器错误");
    }
}
