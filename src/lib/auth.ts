import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod'

export const getJwtSecretKey = () => {
  const secret = JWT_SECRET
  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET is not set.')
  }
  return new TextEncoder().encode(secret)
}

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey())
    return verified.payload
  } catch (err) {
    throw new Error('Your token has expired.')
  }
}

export const signToken = async (payload: any) => {
  const secret = getJwtSecretKey()
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}
