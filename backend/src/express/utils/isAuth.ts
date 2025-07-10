import express from "express";
import { extractTokenFromHeader, verifyToken } from "./jwt";

export function isAuth(req: express.Request): boolean {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) return false;

  const payload = verifyToken(token);
  return payload !== null;
}

export function getUserFromToken(req: express.Request) {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) return null;

  return verifyToken(token);
}
