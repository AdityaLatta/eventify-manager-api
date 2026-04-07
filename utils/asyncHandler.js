import { errorResponse } from "./response.js";
import { logger } from "./winston.js";

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        logger.error(`${req.method} ${req.path}: ${error.message}`);
        errorResponse(res, "Internal server error", 500);
    });
};
