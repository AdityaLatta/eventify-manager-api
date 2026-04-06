import { errorResponse } from "../utils/response.js";

export function validateEventBody(req, res, next) {
    const { summary, start, end } = req.body;
    
    if (!summary || typeof summary !== "string" || summary.trim() === "") {
        return errorResponse(res, "Invalid or missing 'summary'", 400);
    }

    if (!start || (!start.dateTime && !start.date)) {
        return errorResponse(res, "Invalid or missing 'start' object (must contain dateTime or date)", 400);
    }

    if (!end || (!end.dateTime && !end.date)) {
        return errorResponse(res, "Invalid or missing 'end' object (must contain dateTime or date)", 400);
    }

    next();
}
