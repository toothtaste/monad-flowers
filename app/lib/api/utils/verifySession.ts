import jwt, { JwtPayload } from "jsonwebtoken"

export function verifySession(session: string): JwtPayload {
  const { JWT_SECRET } = process.env
  if (!JWT_SECRET) throw new Error("VerifyCredentialsNotConfigured")

  return jwt.verify(session, JWT_SECRET) as JwtPayload
}
