import { NextResponse } from 'next/server'
import { prisma } from '@/libs/db'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const giftCard = await prisma.giftCard.findUnique({
      where: { id: BigInt(id) },
      include: {
        giftCardPackage: true,
        user: true,
      }
    });

    if (!giftCard) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        ...giftCard,
        id: Number(giftCard.id),
        giftCardPackageId: Number(giftCard.giftCardPackageId),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.giftCard.update({
      where: { id: BigInt(id), deletedAt: null, status: {
        not: 'USED'
      } },
      data: {
        deletedAt: new Date(),
      }
    });
    
    return NextResponse.json({
      code: 200,
      message: 'success'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
