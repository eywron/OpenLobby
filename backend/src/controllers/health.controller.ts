import type { Request, Response } from "express";

import { getHealthStatus } from "../services/health.service";
import { createSuccessResponse } from "../utils/api-response";

export function getHealth(_request: Request, response: Response): void {
  response.status(200).json(createSuccessResponse(getHealthStatus(), "Service is healthy"));
}