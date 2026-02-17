import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateCsrf } from '@/lib/csrf'
import { sanitizeInput } from '@/lib/sanitize'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'login', {
    limit: 5,
    window: 15 * 60_000,
  })
  if (rateLimited) return rateLimited

  const csrfInvalid = validateCsrf(req)
  if (csrfInvalid) return csrfInvalid

  try {
    const body = await req.json()
    const parsed = loginSchema.parse(body)
    const { email, password } = sanitizeInput(parsed)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: 'admin-token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    logger.error('Login error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
