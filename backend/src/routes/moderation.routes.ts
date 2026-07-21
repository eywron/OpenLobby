import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import * as moderationController from "../controllers/moderation.controller";

export const moderationRouter = Router();

// Middleware to check admin role
const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req.user as { role?: string } | undefined)?.role;
  if (userRole !== "ADMIN" && userRole !== "MODERATOR") {
    return res.status(403).json({
      ok: false,
      code: "FORBIDDEN",
      message: "Only admins and moderators can perform this action"
    });
  }
  next();
};

// Public report creation
moderationRouter.post("/reports", authMiddleware, moderationController.createReport);

// Admin/Moderator routes
moderationRouter.use(authMiddleware, adminOnly);

moderationRouter.get("/reports", moderationController.getReports);
moderationRouter.get("/reports/:reportId", moderationController.getReportById);
moderationRouter.post("/reports/:reportId/review", moderationController.reviewReport);

// User management
moderationRouter.post("/users/:userId/suspend", moderationController.suspendUser);
moderationRouter.post("/users/:userId/unsuspend", moderationController.unsuspendUser);
moderationRouter.delete("/users/:userId", moderationController.deleteUser);

// Content moderation
moderationRouter.post("/content/delete", moderationController.deleteContent);

// Audit logs
moderationRouter.get("/audit-logs", moderationController.getAuditLogs);
