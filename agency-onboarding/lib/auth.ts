import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'digitalkronosagency-secret-key-change-in-production'
)

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ role: 'admin', email: process.env.ADMIN_EMAIL })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function createClientSession(clientId: string): Promise<string> {
  return new SignJWT({ role: 'client', clientId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(SECRET)
}

export async function verifyClientToken(token: string): Promise<{ clientId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (payload.role === 'client' && payload.clientId) {
      return { clientId: payload.clientId as string }
    }
    return null
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null
  const isValid = await verifyAdminToken(token)
  return isValid ? { role: 'admin' } : null
}

export async function getClientSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('client_session')?.value
  if (!token) return null
  return await verifyClientToken(token)
}
