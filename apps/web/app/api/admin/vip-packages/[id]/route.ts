import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vipPackage = await prisma.vipPackage.findUnique({
      where: { id: BigInt(id) },
    });

    if (!vipPackage) {
      return NextResponse.json(
        {
          code: 404,
          message: 'VIP套餐不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: vipPackage,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}
const updateSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  subtitle: z.string().optional(),
  price: z.number().min(0, '价格不能为空'),
  duration: z.number().min(1, '有效期不能为空'),
  status: z.enum(['ENABLED', 'DISABLED']).default('ENABLED'),
}); 
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, subtitle, price, duration, status } = await updateSchema.parseAsync(body);
    const vipPackage = await prisma.vipPackage.update({
      where: { id: BigInt(id) },
      data: { title, subtitle, price, duration, status },
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        vipPackage: {
          ...vipPackage,
          id: Number(vipPackage.id),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.vipPackage.delete({
        where: { id: BigInt(id) },
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}
