import { NextResponse } from "next/server";
import { prisma } from "@/libs/db";
import { VipPackageStatus } from "@prisma/client";

export async function GET() {
    const vipPackages = await prisma.vipPackage.findMany({
        select: {
            id: true,
            title: true,
            subtitle: true,
            status: true,
            price: true,
            duration: true,
        },
        where: {
            status: VipPackageStatus.ENABLED
        }
    });
    return NextResponse.json({
        code: 200,
        message: "success",
        data: {
            vipPackages: vipPackages.map(item => ({
                id: Number(item.id) ,
                title: item.title,
                subtitle: item.subtitle,
                price: Number(item.price),
                duration: item.duration,
            }))
        }
    });
}