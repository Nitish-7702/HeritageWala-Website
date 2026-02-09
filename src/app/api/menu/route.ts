import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        items: {
            where: { isAvailable: true }
        }
      },
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
