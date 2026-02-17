import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = process.env.NODE_ENV !== 'production'
const isVerbose = process.env.VERBOSE_LOGGING === 'true'

const formatMessage = (level: LogLevel, message: string, meta?: unknown) => {
  const base = { level, message, meta, timestamp: new Date().toISOString() }
  return base
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (!isDev || !isVerbose) return
    console.debug(formatMessage('debug', message, meta))
  },
  info(message: string, meta?: unknown) {
    if (!isVerbose && isDev) return
    if (isDev) {
      console.info(formatMessage('info', message, meta))
    }
  },
  warn(message: string, meta?: unknown) {
    if (isDev || isVerbose) {
      console.warn(formatMessage('warn', message, meta))
    }
  },
  error(message: string, meta?: unknown) {
    const payload = formatMessage('error', message, meta)
    if (isDev || isVerbose) {
      console.error(payload)
    }
    if (!isDev) {
      if (meta && typeof meta === 'object' && 'error' in (meta as any)) {
        const err = (meta as any).error
        if (err instanceof Error) {
          Sentry.captureException(err, { extra: payload })
          return
        }
      }
      Sentry.captureMessage(message, { level: 'error', extra: payload })
    }
  },
}
