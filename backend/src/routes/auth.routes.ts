import { Router } from "express";

import * as authController from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/logout-all", authController.logoutAll);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/password-reset-request", authController.requestPasswordReset);
authRouter.post("/password-reset", authController.resetPassword);
