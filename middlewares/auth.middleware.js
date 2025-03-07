import { config } from "../config/index.js";
import { User } from "../models/user.model.js";
import { oauth2Client } from "../services/google/auth.service.js";
import jwt from "jsonwebtoken";

export async function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Missing or invalid token" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, config.jwt.JWT_SECRET);

        const userId = decodedToken.userId;

        if (!userId) {
            return res
                .status(400)
                .json({ message: "Invalid token: Email not found" });
        }

        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ message: "User not authenticated" });
    }
}
