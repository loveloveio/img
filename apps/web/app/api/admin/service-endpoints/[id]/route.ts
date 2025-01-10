import { NextResponse } from 'next/server'
import { prisma } from '@/libs/db'
import { z } from 'zod'



const updateSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  remark: z.string().optional(),
  url: z.string().url('请输入有效的URL'),
  status: z.enum(['ENABLED', 'DISABLED']),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const serviceEndpoint = await prisma.serviceEndpoint.findUnique({
      where: { id: BigInt(id) }
    });

    if (!serviceEndpoint) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      data: {
        serviceEndpoint: {
          ...serviceEndpoint,
          id: Number(serviceEndpoint.id)
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params
    const body = await request.json();
    console.log('body',body)
    const data = await updateSchema.parseAsync(body);
    console.log('data',data)
    const updated = await prisma.serviceEndpoint.update({
      where: { id: BigInt(id) },
      data
    });
    
    return NextResponse.json({
      code: 200,
      data: {
        serviceEndpoint: {
          ...updated,
          id: Number(updated.id)
        }
      }
    });
  } catch (error) {
    console.error(error);
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
    const { id } = await params
    
    await prisma.serviceEndpoint.delete({
      where: { id: BigInt(id) }
    });
    
    return NextResponse.json({
      code: 200,
      data: {
        serviceEndpoint: {
          id: Number(id)
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}