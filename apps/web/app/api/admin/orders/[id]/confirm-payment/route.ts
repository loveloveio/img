import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';

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

// 在 Next.js 15 的 App Router 中，动态路由参数通过 context 对象获取
// 文件路径为 app/api/admin/orders/[id]/confirm-payment/route.ts
export async function POST(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 查找订单
        const order = await prisma.order.findUnique({
            where: { id: BigInt(id) }
        });

        if (!order) {
            return errorResponse(404, "订单不存在");
        }

        if (order.status !== OrderStatus.PENDING) {
            return errorResponse(400, "只能确认待支付的订单");
        }
        await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id: BigInt(id) },
                data: {
                    status: OrderStatus.PAID,
                    paidAt: new Date()
                }
            });
            const vipPackage = await tx.vipPackage.findUnique({
                where: { id: order.vipPackageId }
            });
            if (!vipPackage) {
                throw new Error("VIP套餐不存在");
            }
            const user = await tx.user.findUnique({
                where: { id: order.userId }
            });
            if (user) {
                const vipExpiredAt = user.vipExpiredAt ?? new Date();
                if (dayjs(vipExpiredAt).isBefore(dayjs())) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: { vipExpiredAt: dayjs(vipExpiredAt).add(vipPackage.duration, 'day').toDate() }
                    });
                } else {
                    await tx.user.update({
                        where: { id: user.id },
                        data: { vipExpiredAt: dayjs().add(vipPackage.duration, 'day').toDate() }
                    });

                }   
            } else {
                throw new Error("用户不存在");
            }
        });
        return successResponse();
    } catch (error) {
        return errorResponse(500, "服务器错误");
    }
}
