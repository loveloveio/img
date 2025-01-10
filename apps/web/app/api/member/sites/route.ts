import { NextResponse } from "next/server";
import { prisma } from "@/libs/db";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const keyword = searchParams.get("q") || "";

    try {
        const sites = await prisma.site.findMany({
            select: {
                id: true,
                name: true,
                url: true,
                icon: true,
                sort: true
            },
            where: {
                deletedAt: null,
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } }
                ]
            },
            orderBy: {
                sort: 'asc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        const total = await prisma.site.count({
            where: {
                deletedAt: null,
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } }
                ]
            }
        });

        return NextResponse.json({
            code: 0,
            message: "success",
            data: {
                sites: sites.map((site) => ({
                    ...site,
                    id: Number(site.id)
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching sites:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
