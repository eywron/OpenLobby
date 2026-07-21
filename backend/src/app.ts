import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { requestLogger } from "./middleware/request-logger";
import { apiRouter } from "./routes";
import { createSuccessResponse } from "./utils/api-response";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(cookieParser());
  app.use(requestLogger);

  app.get("/", (_request, response) => {
    response.status(200).json(
      createSuccessResponse(
        {
          service: "openlobby-backend",
          version: "v1"
        },
        "OpenLobby backend is running"
      )
    );
  });

  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}