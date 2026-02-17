export function sanitizeInput<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(/[<>]/g, '').trim() as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInput(item)) as T
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = sanitizeInput(val)
    }
    return result as T
  }
  return value
}

