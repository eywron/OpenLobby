import { prisma } from "../lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() }
  });
}

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function findUserWithSettings(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true }
  });
}

export async function createUser(data: {
  username: string;
  displayName: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      username: data.username.toLowerCase(),
      displayName: data.displayName,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      settings: {
        create: {
          emailNotifications: true,
          pushNotifications: true,
          directMessageNotifications: true,
          privacyProfilePublic: true
        }
      }
    },
    include: { settings: true }
  });
}

export async function createSession(data: {
  userId: string;
  refreshTokenHash: string;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
  ipAddress?: string;
  expiresAt: Date;
}) {
  return prisma.session.create({
    data: {
      userId: data.userId,
      refreshTokenHash: data.refreshTokenHash,
      deviceName: data.deviceName,
      browser: data.browser,
      operatingSystem: data.operatingSystem,
      ipAddress: data.ipAddress,
      expiresAt: data.expiresAt,
      lastActivityAt: new Date()
    }
  });
}

export async function findSessionById(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId }
  });
}

export async function updateSessionActivity(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { lastActivityAt: new Date() }
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.session.delete({
    where: { id: sessionId }
  });
}

export async function deleteAllUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId }
  });
}

export async function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({
    data: {
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt
    }
  });
}

export async function findPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date()
      }
    },
    include: { user: true }
  });
}

export async function markPasswordResetTokenAsUsed(tokenId: string) {
  return prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() }
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });
}
