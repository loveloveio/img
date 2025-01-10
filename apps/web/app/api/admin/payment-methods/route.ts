import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';

export const GET = async (_: NextRequest) => {
    try {
        const paymentMethods = await prisma.paymentMethod.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                paymentMethods: paymentMethods.map((paymentMethod) => ({
                    ...paymentMethod,
                    id: Number(paymentMethod.id)
                }))
            }
        });
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "服务器错误"
        }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const paymentMethod = await prisma.paymentMethod.create({
            data: {
                name: data.name,
                icon: data.icon,
                driver: data.driver,
                status: data.status,
                config: data.config || {}
            }
        });

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                paymentMethod: {
                    ...paymentMethod,
                    id: Number(paymentMethod.id)
                }
            }
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            code: 500,
            message: "创建支付方法失败"
        }, { status: 500 });
    }
}
