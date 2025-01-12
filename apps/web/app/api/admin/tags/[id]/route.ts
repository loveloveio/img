import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

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

const updateSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  keywords: z.string().optional(),
  sort: z.number().default(0),
  allowDevices: z.array(z.string()).default([])
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tag = await prisma.tag.findUnique({
            where: { id: BigInt(id) }
        });

        if (!tag) {
            return errorResponse(404, "标签不存在");
        }

        return successResponse({
            ...tag,
            id: Number(tag.id)
        });
    } catch (error) {
        console.error(error);
        return errorResponse(500, "服务器错误");
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, keywords, sort, allowDevices } = await updateSchema.parseAsync(body);

        const tag = await prisma.tag.update({
            where: { id: BigInt(id) },
            data: {
                title,
                keywords,
                sort,
                allowDevices
            }
        });

        return successResponse({
            ...tag,
            id: Number(tag.id)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return errorResponse(400, error.errors[0]?.message || '参数错误');
        }
        return errorResponse(500, "服务器错误");
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        await prisma.tag.delete({
            where: { id: BigInt(id) }
        });

        return successResponse();
    } catch (error) {
        return errorResponse(500, "服务器错误");
    }
}
