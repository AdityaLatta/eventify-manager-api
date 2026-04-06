import { config } from "../config/index.js";
import { Google } from "../models/google.model.js";
import { User } from "../models/user.model.js";
import { oauth2Client } from "../services/google/auth.service.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/winston.js";

export async function isAuthenticated(req, res, next) {
    try {
        const cookie = req.cookies;

        const token = cookie["auth-token"];

        const decodedToken = jwt.verify(token, config.jwt.JWT_SECRET);

        const userId = decodedToken.userId;

        if (!userId) {
            return res
                .status(400)
                .json({ message: "Invalid token: Email not found" });
        }

        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const googleAccount = await Google.findByPk(user.googleId);

        if (!googleAccount)
            return res
                .status(404)
                .json({ message: "Google account not found" });

        req.googleRefreshToken = googleAccount.refreshToken;
        req.userId = userId;
        next();
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: "User not authenticated" });
    }
}
