import { config } from "../config/index.js";
import { Google } from "../models/google.model.js";
import { User } from "../models/user.model.js";
import { oauth2Client } from "../services/google/auth.service.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/winston.js";
import { errorResponse } from "../utils/response.js";

export async function isAuthenticated(req, res, next) {
    try {
        const cookie = req.cookies;

        const token = cookie["auth-token"];

        const decodedToken = jwt.verify(token, config.jwt.JWT_SECRET);

        const userId = decodedToken.userId;

        if (!userId) {
            return errorResponse(res, "Invalid token: Email not found", 400);
        }

        const user = await User.findByPk(userId, { include: [Google] });

        if (!user) return errorResponse(res, "User not found", 404);

        const googleAccount = user.Google;

        if (!googleAccount) return errorResponse(res, "Google account not found", 404);

        req.googleRefreshToken = googleAccount.refreshToken;
        req.userId = userId;
        next();
    } catch (error) {
        logger.error(error.message);
        errorResponse(res, "User not authenticated", 500);
    }
}
