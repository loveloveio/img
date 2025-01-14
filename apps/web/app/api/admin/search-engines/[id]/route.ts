import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/libs/db'
import { SearchEngineStatus } from '@prisma/client'


const updateSchema = z.object({
  icon: z.string().url(),
  name: z.string(),
  url: z.string().url(),
  remark: z.string().optional(),
  status: z.enum([SearchEngineStatus.ENABLED, SearchEngineStatus.DISABLED]),
  sort: z.number().optional().default(0)
})

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  try {
    const searchEngine = await prisma.searchEngine.findUnique({
      where: {
        id
      }
    })

    if (!searchEngine) {
      return NextResponse.json(
        { status: 404, message: 'Search engine not found',data: null },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: 200,
      message: 'Search engine found',
      data: null,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal server error',data: null },
      { status: 500 }
    )
  }
}

// Update search engine
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    console.log("id####",id)
    const body = await request.json()
    const validatedData = await updateSchema.parseAsync(body)
    console.log("validatedData####",validatedData)
     await prisma.searchEngine.update({
      where: {
        id
      },
      data: validatedData
    })

    return NextResponse.json({
      status: 200,
      message: 'Search engine updated successfully',
      data: null,
    })
  } catch (error) {
    console.log("error####",error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: 'Invalid request',data: null },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { status: 500, message: 'Internal server error',data: null },
      { status: 500 }
    )
  }
}

// Delete search engine
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    await prisma.searchEngine.delete({
      where: {
        id
      }
    })

    return NextResponse.json(
      { status: 200, message: 'Search engine deleted successfully',data: null },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal server error',data: null },
      { status: 500 }
    )
  }
}
