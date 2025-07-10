import jwt from "jsonwebtoken";
import { User } from "../../entities/User";

const secret = process.env.APP_SECRET || "secret";

export interface JWTPayload {
  username: string;
  email: string;
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    username: user.Username,
    email: user.Email,
  };

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}
