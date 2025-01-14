import { NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1, '标题不能为空').optional(),
  remark: z.string().optional(),
  url: z.string().min(1, 'URL不能为空').optional(),
  status: z.enum(['ENABLED', 'DISABLED']).optional(),
  free: z.boolean().optional(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const proxyNode = await prisma.proxyNode.findUnique({
      where: { id: BigInt(id) }
    });

    if (!proxyNode) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        ...proxyNode,
        id: Number(proxyNode.id)
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      code: 400,
      message: 'Invalid request'
    }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } =await params;
    const body = await request.json();
    const data = await updateSchema.parseAsync(body);
    
    const updated = await prisma.proxyNode.update({
      where: { id: BigInt(id) },
      data
    });
    
    return NextResponse.json({
      code: 200,
      message: '更新成功',
      data: {
        ...updated,
        id: Number(updated.id)
      }
    });
  } catch (error) {
    console.log('error',error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        code: 400,
        message: error.errors[0]?.message
      }, { status: 400 });
    }

    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.proxyNode.delete({
      where: { id: BigInt(id) }
    });
    
    return NextResponse.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '删除失败'
    }, { status: 500 });
  }
}