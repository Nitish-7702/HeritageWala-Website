import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const routes = [
    '/',
    '/menu',
    '/about',
    '/contact',
    '/reservations',
    '/catering',
    '/locations',
    '/cart',
    '/checkout',
    '/checkout/success',
    '/checkout/cancel',
    '/admin',
    '/admin/login',
  ]

  const now = new Date()

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changefreq: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}

