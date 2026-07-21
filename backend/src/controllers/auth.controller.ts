import type { Request, Response } from "express";

import { AppError } from "../errors/app-error";
import { createSuccessResponse, createErrorResponse } from "../utils/api-response";
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  refreshTokenSchema
} from "../schemas/auth.schema";
import * as authService from "../services/auth.service";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_VALUE_COOKIE_NAME = "refreshTokenValue";

export async function register(request: Request, response: Response): Promise<void> {
  const validation = registerSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const user = await authService.registerUser(validation.data);
  response.status(201).json(createSuccessResponse(user, "Registration successful"));
}

export async function login(request: Request, response: Response): Promise<void> {
  const validation = loginSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const { accessToken, refreshToken, refreshTokenValue, sessionId, user } =
    await authService.loginUser(validation.data);

  const maxAge = validation.data.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge
  });

  response.cookie(REFRESH_TOKEN_VALUE_COOKIE_NAME, refreshTokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge
  });

  response.status(200).json(
    createSuccessResponse(
      {
        accessToken,
        sessionId,
        user
      },
      "Login successful"
    )
  );
}

export async function logout(request: Request, response: Response): Promise<void> {
  const sessionId = request.body.sessionId as string | undefined;
  if (!sessionId) {
    throw new AppError({
      message: "Session ID is required",
      statusCode: 400,
      code: "MISSING_SESSION_ID"
    });
  }

  await authService.logoutUser(sessionId);

  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  response.clearCookie(REFRESH_TOKEN_VALUE_COOKIE_NAME);

  response.status(200).json(createSuccessResponse({ success: true }, "Logout successful"));
}

export async function logoutAll(request: Request, response: Response): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AppError({
      message: "User not authenticated",
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  await authService.logoutAllUserSessions(userId);

  response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  response.clearCookie(REFRESH_TOKEN_VALUE_COOKIE_NAME);

  response.status(200).json(createSuccessResponse({ success: true }, "Logged out from all devices"));
}

export async function refresh(request: Request, response: Response): Promise<void> {
  const validation = refreshTokenSchema.safeParse({
    refreshToken: request.cookies[REFRESH_TOKEN_COOKIE_NAME]
  });

  if (!validation.success) {
    throw new AppError({
      message: "Refresh token is missing or invalid",
      statusCode: 401,
      code: "MISSING_REFRESH_TOKEN"
    });
  }

  const refreshTokenValue = request.cookies[REFRESH_TOKEN_VALUE_COOKIE_NAME] as string | undefined;
  if (!refreshTokenValue) {
    throw new AppError({
      message: "Refresh token value is missing",
      statusCode: 401,
      code: "MISSING_REFRESH_TOKEN_VALUE"
    });
  }

  const { accessToken } = await authService.refreshAccessToken(
    validation.data.refreshToken,
    refreshTokenValue
  );

  response.status(200).json(createSuccessResponse({ accessToken }, "Token refreshed"));
}

export async function requestPasswordReset(request: Request, response: Response): Promise<void> {
  const validation = passwordResetRequestSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const result = await authService.requestPasswordReset(validation.data.email);

  response.status(200).json(
    createSuccessResponse(
      { success: result.success },
      "If the email exists, a password reset link will be sent"
    )
  );
}

export async function resetPassword(request: Request, response: Response): Promise<void> {
  const validation = passwordResetSchema.safeParse(request.body);
  if (!validation.success) {
    response.status(400).json(
      createErrorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: validation.error.flatten()
      })
    );
    return;
  }

  const result = await authService.resetPassword(validation.data);

  response.status(200).json(
    createSuccessResponse({ success: result.success }, "Password has been reset successfully")
  );
}
