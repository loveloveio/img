import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/db";
import { auth } from "@/libs/better-auth";
import dayjs from "dayjs";
export const GET = async (req: NextRequest) => {
    
    const { searchParams } = new URL(req.url);
    const free = searchParams.get('free') || 'false';
    if(free=='false'){
        const session = await auth.api.getSession({
            headers: req.headers
        });
        if(!session){
            return  new NextResponse('');
        }
    
        const user = session.user;
        if(!user){
            return new NextResponse('');
        }
        const vipExpired = user.vipExpiredAt;
        if(!vipExpired || dayjs(vipExpired).isBefore(dayjs())){
            return new NextResponse('');
        }

    }
    const where: Prisma.ProxyNodeWhereInput = {
        free: free === 'true'
    };

    const proxyNotes = await prisma.proxyNode.findMany({
        select: {
            title: true,
            url: true,
        },
        where,
        orderBy: {
            updatedAt: 'desc'
        },
    });
    const nodes = proxyNotes.map((proxyNode) => {
        const name = encodeURIComponent('#'+proxyNode.title);
        return `${proxyNode.url}${name}`;
    });
    const base64Nodes = Buffer.from(nodes.join('\n')).toString('base64');
    return new NextResponse(base64Nodes, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
