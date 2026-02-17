import * as Sentry from '@sentry/nextjs'
import { env } from './src/lib/env'

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: !!env.SENTRY_DSN,
  environment: env.NODE_ENV,
})

