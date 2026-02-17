import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function validateCsrf(req: NextRequest) {
  const csrfHeader = req.headers.get('x-csrf-token')
  const csrfCookie = req.cookies.get('csrf-token')?.value

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  return null
}

