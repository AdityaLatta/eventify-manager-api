import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { Discord, User } from "../models/index.js";
import {
    generateAuthUrl,
    getJwtToken,
    getUserProfile,
    oauth2Client,
    saveUser,
} from "../services/google/auth.service.js";
import {
    fetchUpdatedEvents,
    subscribeToCalendar,
} from "../services/google/events.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../utils/winston.js";

export const login = (req, res) => {
    const url = generateAuthUrl();
    successResponse(res, { Message: "Please visit url below to login", url });
};

export const auth = asyncHandler(async (req, res) => {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    let { email } = await getUserProfile();

    const user = await saveUser(email, tokens.refresh_token);

    await subscribeToCalendar(user.id, tokens.refresh_token);

    const payload = { userId: user.id };

    const token = getJwtToken(payload);

    successResponse(res, { token });
});

export const setToken = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return errorResponse(res, "Invalid token", 401);
    }

    try {
        jwt.verify(token, config.jwt.JWT_SECRET);
    } catch (error) {
        logger.error(`Token validation error: ${error.message}`);
        return errorResponse(res, "Invalid token", 401);
    }

    res.cookie("auth-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 36000000,
    });

    successResponse(res, { message: "cookies set successfully" });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("auth-token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });
    successResponse(res, { message: "Logged out successfully" });
});

export const updateDiscord = asyncHandler(async (req, res) => {
    const { discordId } = req.body;
    const userId = req.userId;

    if (!discordId || typeof discordId !== "string" || !/^\d{17,20}$/.test(discordId)) {
        return errorResponse(res, "Invalid discordId format", 400);
    }

    const user = await User.findByPk(userId);

    if (!user) return errorResponse(res, "User not found", 404);

    // Check if Discord record exists
    let discordAccount = await Discord.findOne({
        where: { id: user.discordId },
    });

    if (discordAccount) {
        // Update existing Discord record
        discordAccount.discordId = discordId;
        await discordAccount.save();
    } else {
        // Create new Discord record and link to User
        discordAccount = await Discord.create({ discordId });
        user.discordId = discordAccount.id;
        await user.save();
    }

    successResponse(res, { message: "Discord ID updated successfully" });
});

export const webhook = asyncHandler(async (req, res) => {
    if (req.headers["x-goog-channel-token"] !== config.google.webhook.secret) {
        return res.sendStatus(403);
    }

    logger.info(`Received Google Calendar Webhook Notification for resource ${req.headers["x-goog-resource-id"]}`);

    // Google sends notifications when events are updated/deleted
    const resourceId = req.headers["x-goog-resource-id"];
    const resourceState = req.headers["x-goog-resource-state"];

    if (resourceState === "exists" || resourceState === "sync") {
        logger.info(`Calendar updated: ${resourceId}`);
        // Fetch the updated events from Google Calendar
        const events = await fetchUpdatedEvents(resourceId);

        logger.info(`Fetched ${events ? events.length : 0} updated events`);
    }

    res.sendStatus(200); // Acknowledge receipt
});
