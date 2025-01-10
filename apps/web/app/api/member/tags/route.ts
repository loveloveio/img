import { NextResponse } from 'next/server';
import { prisma } from '@/libs/db';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        title: true,
        keywords: true,
        sort: true,
        allowDevices: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        tags
      }
    });
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json(
      { code: 500, message: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
