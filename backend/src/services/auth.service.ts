import { createHash } from "crypto";

import { AppError } from "../errors/app-error";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  generateRefreshTokenValue,
  verifyRefreshToken
} from "../utils/token";
import * as authRepository from "../repositories/auth.repository";
import type { RegisterInput, LoginInput, PasswordResetInput } from "../schemas/auth.schema";

export async function registerUser(input: RegisterInput) {
  const { username, displayName, email, password } = input;

  const existingByUsername = await authRepository.findUserByUsername(username);
  if (existingByUsername) {
    throw new AppError({
      message: "Username is already taken",
      statusCode: 400,
      code: "USERNAME_TAKEN"
    });
  }

  const existingByEmail = await authRepository.findUserByEmail(email);
  if (existingByEmail) {
    throw new AppError({
      message: "Email is already registered",
      statusCode: 400,
      code: "EMAIL_TAKEN"
    });
  }

  const passwordHash = await hashPassword(password);

  const user = await authRepository.createUser({
    username,
    displayName,
    email,
    passwordHash
  });

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    role: user.role
  };
}

export async function loginUser(input: LoginInput) {
  const { emailOrUsername, password, rememberMe } = input;

  const user = await authRepository.findUserByEmail(emailOrUsername);
  if (!user) {
    const userByUsername = await authRepository.findUserByUsername(emailOrUsername);
    if (!userByUsername) {
      throw new AppError({
        message: "Invalid email or username / password",
        statusCode: 401,
        code: "INVALID_CREDENTIALS"
      });
    }
    throw new AppError({
      message: "Invalid email or username / password",
      statusCode: 401,
      code: "INVALID_CREDENTIALS"
    });
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new AppError({
      message: "Account is not active",
      statusCode: 403,
      code: "ACCOUNT_INACTIVE"
    });
  }

  const isPasswordValid = await verifyPassword(user.passwordHash, password);
  if (!isPasswordValid) {
    throw new AppError({
      message: "Invalid email or username / password",
      statusCode: 401,
      code: "INVALID_CREDENTIALS"
    });
  }

  const refreshTokenValue = generateRefreshTokenValue();
  const refreshTokenHash = createHash("sha256").update(refreshTokenValue).digest("hex");

  const expiresAtMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expiresAtMs);

  const session = await authRepository.createSession({
    userId: user.id,
    refreshTokenHash,
    expiresAt
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  const refreshToken = generateRefreshToken(
    {
      sessionId: session.id,
      userId: user.id
    },
    rememberMe
  );

  return {
    accessToken,
    refreshToken,
    refreshTokenValue,
    sessionId: session.id,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role
    }
  };
}

export async function logoutUser(sessionId: string) {
  await authRepository.deleteSession(sessionId);
}

export async function logoutAllUserSessions(userId: string) {
  await authRepository.deleteAllUserSessions(userId);
}

export async function refreshAccessToken(refreshToken: string, refreshTokenValue: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new AppError({
      message: "Invalid or expired refresh token",
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN"
    });
  }

  const session = await authRepository.findSessionById(payload.sessionId);
  if (!session || session.deletedAt) {
    throw new AppError({
      message: "Session not found or has been revoked",
      statusCode: 401,
      code: "SESSION_REVOKED"
    });
  }

  const refreshTokenHash = createHash("sha256").update(refreshTokenValue).digest("hex");
  if (session.refreshTokenHash !== refreshTokenHash) {
    throw new AppError({
      message: "Invalid refresh token",
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN"
    });
  }

  const user = await authRepository.findUserById(payload.userId);
  if (!user || user.accountStatus !== "ACTIVE") {
    throw new AppError({
      message: "User not found or account is inactive",
      statusCode: 401,
      code: "ACCOUNT_INACTIVE"
    });
  }

  await authRepository.updateSessionActivity(session.id);

  const newAccessToken = generateAccessToken({
    userId: user.id,
    username: user.username,
    role: user.role
  });

  return {
    accessToken: newAccessToken
  };
}

export async function requestPasswordReset(email: string) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    return { success: true };
  }

  const tokenValue = generateRefreshTokenValue();
  const tokenHash = createHash("sha256").update(tokenValue).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await authRepository.createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt
  });

  return {
    success: true,
    resetToken: tokenValue
  };
}

export async function resetPassword(input: PasswordResetInput) {
  const { token, password } = input;

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const resetToken = await authRepository.findPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new AppError({
      message: "Invalid or expired reset token",
      statusCode: 400,
      code: "INVALID_RESET_TOKEN"
    });
  }

  const passwordHash = await hashPassword(password);

  await authRepository.updateUserPassword(resetToken.userId, passwordHash);
  await authRepository.markPasswordResetTokenAsUsed(resetToken.id);
  await authRepository.deleteAllUserSessions(resetToken.userId);

  return {
    success: true
  };
}
