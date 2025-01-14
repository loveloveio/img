import { NextResponse } from "next/server";
import { prisma } from "@/libs/db";


export async function GET() {
    try {
        const searchEngines = await prisma.searchEngine.findMany({
            where: {
                status: 'ENABLED'
            },
            select: {
                id: true,
                name: true,
                icon: true,
                url: true,
            },
            orderBy: {
                sort: 'asc'
            }
        });

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                searchEngines
            }
        });
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}
