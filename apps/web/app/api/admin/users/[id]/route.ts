import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import { auth } from '@/libs/better-auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        username: true,
        vipExpiredAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          code: 404,
          message: '用户不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: user,
    });
  } catch (error) {
    console.error(error);
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
  name: z.string().min(1, '请输入姓名'),
  username: z.string().min(1, '请输入用户名'),
  email: z.string().email('请输入有效的邮箱'),
  emailVerified: z.boolean().default(false),
  role: z.enum(['user', 'admin']).default('user'),
  banned: z.boolean().default(false),
  banReason: z.string().optional(),
  banExpires: z.string().datetime().optional(),
  password: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await updateSchema.parseAsync(body);
    const ctx = await auth.$context;
    console.log('data', data);
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        username: true,
        vipExpiredAt: true
      }
    });
    if(data.password) {
      const hash = await ctx.password.hash(data.password);
      await ctx.internalAdapter.updatePassword(user.id, hash);
    }
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        user
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        code: 400,
        message: error.errors[0]?.message
      }, { status: 400 });
    }
    
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id }
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
