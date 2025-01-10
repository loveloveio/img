import { auth } from "@/libs/better-auth";
import { prisma } from "@/libs/db";
import { OrderStatus, VipPackageStatus } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
    paymentMethodId: z.number({
        required_error: "支付方式不能为空",
        invalid_type_error: "支付方式必须是数字"
    }).refine(async (id) => {
        const payMethod = await prisma.paymentMethod.findUnique({
            where: { id: BigInt(id) }
        });
        return payMethod !== null;
    }, {
        message: "支付方式不存在"
    }),
    vipPackageId: z.number({
        required_error: "VIP套餐不能为空",
        invalid_type_error: "VIP套餐必须是数字" 
    }).refine(async (id) => {
        const vipPackage = await prisma.vipPackage.findUnique({
            where: { id: BigInt(id) }
        });
        return vipPackage !== null;
    }, {
        message: "VIP套餐不存在"
    })
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const session = await auth.api.getSession({
            headers: req.headers
        });
        const { paymentMethodId, vipPackageId } = await createOrderSchema.parseAsync(body);
        const vipPackage = await prisma.vipPackage.findFirst({
            where: { id: BigInt(vipPackageId) }
        });
        if (!vipPackage || vipPackage.status !== VipPackageStatus.ENABLED) {
            return NextResponse.json({
                code: 400,
                message: "VIP套餐不存在",
            }, { status: 400 });
        }
        const no = dayjs().format('YYYYMMDDHHmmss') + Math.random().toString(36).substring(2, 15);
        const order = await prisma.order.create({
            data: {
                no,
                paymentMethodId: BigInt(paymentMethodId),
                vipPackageId: BigInt(vipPackageId),
                userId: session?.user.id ?? '',
                status: OrderStatus.PENDING,
                paidAmount: Number(vipPackage.price),
            }
        });
        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                no: order.no,
                redirectUrl: 'https://www.baidu.com'
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                code: 400,
                message: error.errors[0]?.message,
            }, { status: 400 });
        }
        return NextResponse.json({
            code: 500,
            message: "服务器错误",
        }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session?.user?.id) {
            return NextResponse.json({
                code: 401,
                message: "未登录",
            }, { status: 401 });
        }
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        if (page < 1 || pageSize < 1) {
            return NextResponse.json({
                code: 400,
                message: "参数错误",
            }, { status: 400 });
        }
        if (pageSize > 100) {
            return NextResponse.json({
                code: 400,
                message: "参数错误",
            }, { status: 400 });
        }
        const [total, orders] = await Promise.all([
            prisma.order.count({
                where: {
                    userId: session.user.id
                }
            }),
            prisma.order.findMany({
                where: {
                    userId: session.user.id
                },
                include: {
                    paymentMethod: true,
                    vipPackage: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (page - 1) * pageSize,
                take: pageSize
            })
        ]);

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                total,
                list: orders.map(order => ({
                    no: order.no,
                    status: order.status,
                    paidAmount: order.paidAmount,
                    createdAt: order.createdAt,
                    vipPackage: {
                        title: order.vipPackage.title,
                        price: order.vipPackage.price,
                        duration: order.vipPackage.duration,
                    },
                    paymentMethod: {
                        name: order.paymentMethod.name,
                        icon: order.paymentMethod.icon,
                    },
                    paidAt: order.paidAt,
                })),
                page,
                pageSize
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json({
            code: 500,
            message: "服务器错误",
        }, { status: 500 });
    }
}
