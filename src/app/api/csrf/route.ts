import { NextResponse } from 'next/server'

export async function GET() {
  const token = crypto.randomUUID()

  const response = NextResponse.json({ token })
  response.cookies.set('csrf-token', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'development',
    path: '/',
  })

  return response
}

