import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';

// Get site detail
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
  try {
    const { id } = await params;
    const site = await prisma.site.findUnique({
      where: { id: BigInt(id) }
    });

    if (!site) {
      return NextResponse.json({
        code: 404,
        message: '站点不存在'
      }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        site: {
          ...site,
          id: Number(site.id)
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

// Update site
const updateSchema = z.object({
  name: z.string().min(1, '名称不能为空').optional(),
  url: z.string().url('请输入有效的URL').optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['ENABLED', 'DISABLED']).optional(),
  sort: z.number().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await updateSchema.parseAsync(body);

    const site = await prisma.site.update({
      where: { id: BigInt(id) },
      data
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        site: {
          ...site,
          id: Number(site.id)
        }
      }
    });
  } catch (error) {
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

// Delete site
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
  try {
    const { id } = await params;
    await prisma.site.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      code: 200,
      message: 'success'
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '服务器错误'
    }, { status: 500 });
  }
}
