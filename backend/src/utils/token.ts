import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

import { env } from "../config/env";

export type AccessTokenPayload = {
  userId: string;
  username: string;
  role: string;
};

export type RefreshTokenPayload = {
  sessionId: string;
  userId: string;
};

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DEFAULT = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_EXPIRY_REMEMBER_ME = 30 * 24 * 60 * 60;

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload, rememberMe: boolean = false): string {
  const expiresIn = rememberMe ? REFRESH_TOKEN_EXPIRY_REMEMBER_ME : REFRESH_TOKEN_EXPIRY_DEFAULT;

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn
  });
}

export function generateRefreshTokenValue(): string {
  return randomBytes(32).toString("hex");
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    return null;
  }
}
