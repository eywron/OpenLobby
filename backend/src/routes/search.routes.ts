import { Router } from "express";

import { optionalAuthMiddleware } from "../middleware/auth.middleware";
import * as searchController from "../controllers/search.controller";

export const searchRouter = Router();

searchRouter.use(optionalAuthMiddleware);

searchRouter.get("/", searchController.search);
