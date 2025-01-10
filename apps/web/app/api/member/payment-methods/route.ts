import { NextResponse } from "next/server";
import { prisma } from "@/libs/db";
import { PaymentMethodStatus } from "@prisma/client";
export async function GET() {
    const paymentMethods = await prisma.paymentMethod.findMany({
        select: {
            id: true,
            name: true,
            icon: true,
        },
        where: {
            status: PaymentMethodStatus.ENABLED
        }
    });
    return NextResponse.json({
        code: 200,
        message: "success",
        data: {
            paymentMethods: paymentMethods.map(item => ({
                id: Number(item.id),
                name: item.name,
                icon: item.icon,
            }))
        }
    });
}