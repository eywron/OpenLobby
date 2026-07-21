import { Router } from "express";

import { env } from "../config/env";
import { createSuccessResponse } from "../utils/api-response";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
import { postRouter } from "./post.routes";
import { notificationRouter } from "./notification.routes";
import { moderationRouter } from "./moderation.routes";

import { conversationRouter, messageRouter } from "./message.routes";
import { searchRouter } from "./search.routes";

export const apiRouter = Router();

apiRouter.get("/", (_request, response) => {
  response
    .status(200)
    .json(createSuccessResponse({ service: "openlobby-backend", version: "v1" }, `${env.NODE_ENV} API is running`));
});

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/admin", moderationRouter);
apiRouter.use("/conversations", conversationRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/search", searchRouter);