import { NextResponse } from 'next/server';
import { prisma } from '@/libs/db';

export async function GET() {
  try {
    const giftCardPackages = await prisma.giftCardPackage.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        duration: true,
      },
      where: {
        status: 'ENABLED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const options = giftCardPackages.map((item) => ({
      label: `${item.title} - ${item.price} - ${item.duration}天`,
      value: Number(item.id),
    }));

    return NextResponse.json({
      code: 200,
      data: {
        options
      },
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: '服务器错误' },
      { status: 500 },
    );
  }
}
