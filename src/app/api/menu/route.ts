import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export const revalidate = 60 // Cache for 60 seconds
export const dynamic = 'force-static' // Pre-render at build time

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        order: true,
        items: {
          where: { isAvailable: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            isVeg: true,
            spiceLevel: true,
            image: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    logger.error('Error fetching menu', { error })
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
