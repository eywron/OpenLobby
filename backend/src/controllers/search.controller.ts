import type { Request, Response } from "express";

import { createSuccessResponse, createErrorResponse } from "../utils/api-response";
import { searchQuerySchema } from "../schemas/search.schema";
import * as searchService from "../services/search.service";

export async function search(request: Request, response: Response): Promise<void> {
	const validation = searchQuerySchema.safeParse(request.query);
	if (!validation.success) {
		response.status(400).json(
			createErrorResponse({
				code: "VALIDATION_ERROR",
				message: "Invalid query parameters",
				details: validation.error.flatten()
			})
		);
		return;
	}

	const result = await searchService.search(validation.data);
	response.status(200).json(createSuccessResponse(result, "Search results retrieved"));
}
