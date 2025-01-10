import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import { PaymentMethodStatus } from '@prisma/client';

const updatePaymentMethodSchema = z.object({
    name: z.string().min(1, "名称不能为空"),
    icon: z.string().min(1, "图标不能为空"), 
    driver: z.enum(['ALIPAY', 'WECHAT']),
    status: z.enum([PaymentMethodStatus.ENABLED, PaymentMethodStatus.DISABLED]),
    config: z.string().refine(
        (val) => {
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        },
        "配置必须是有效的JSON格式"
    )
});

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

// 查找支付方式
const findPaymentMethod = async (id: string) => {
    const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: BigInt(id) }
    });

    if (!paymentMethod) {
        throw new Error("支付方式不存在");
    }

    return paymentMethod;
};

export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const paymentMethod = await findPaymentMethod(id);
        return successResponse(paymentMethod);
    } catch (error) {
        return error instanceof Error 
            ? errorResponse(404, error.message)
            : errorResponse(500, "服务器错误");
    }
};

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const body = await req.json();
        const data = await updatePaymentMethodSchema.parseAsync(body);
        
        const { id } = await params;
        await findPaymentMethod(id);
        const updated = await prisma.paymentMethod.update({
            where: { id: BigInt(id) },
            data: {
                name: data.name,
                icon: data.icon,
                driver: data.driver,
                status: data.status,
                config: data.config
            }
        });
        return successResponse({
            ...updated, 
            id: Number(updated.id)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return errorResponse(400, error.errors[0]?.message || "");
        }
        if (error instanceof Error) {
            return errorResponse(404, error.message);
        }
        return errorResponse(500, "服务器错误");
    }
};

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await findPaymentMethod(id);
        
        await prisma.paymentMethod.delete({
            where: { id: BigInt(id) }
        });

        return successResponse();
    } catch (error) {
        return error instanceof Error
            ? errorResponse(404, error.message)
            : errorResponse(500, "服务器错误");
    }
};
