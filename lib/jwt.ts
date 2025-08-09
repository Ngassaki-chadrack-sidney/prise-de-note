import {jwtVerify, SignJWT} from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

// Créer un token JWT
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token valide 7 jours
    .sign(secret)
}

// Vérifier et décoder un token JWT
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    throw new Error('Token invalide')
  }
}

// Créer un refresh token (durée de vie plus longue)
export async function signRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Refresh token valide 30 jours
    .sign(secret)
}