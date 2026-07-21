import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../utils/token";
import { logger } from "../lib/logger";

export const authMiddleware: RequestHandler = (request, _response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError({
      message: "Missing or invalid authorization header",
      statusCode: 401,
      code: "MISSING_AUTH_HEADER"
    });
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    throw new AppError({
      message: "Invalid or expired token",
      statusCode: 401,
      code: "INVALID_TOKEN"
    });
  }

  request.user = payload;

  logger.debug({ userId: payload.userId, username: payload.username }, "User authenticated");

  next();
};

export const optionalAuthMiddleware: RequestHandler = (request, _response, next) => {
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (payload) {
      request.user = payload;
    }
  }
  next();
};
