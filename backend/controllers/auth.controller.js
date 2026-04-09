import { config } from "../config/index.js";
import { Discord, User } from "../models/index.js";
import {
    generateAuthUrl,
    getJwtToken,
    getUserProfile,
    getTokensFromCode,
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
    res.redirect(url);
};

export const auth = asyncHandler(async (req, res) => {
    const { code } = req.query;

    const tokens = await getTokensFromCode(code);

    let { email } = await getUserProfile(tokens);

    const user = await saveUser(email, tokens.refresh_token);

    await subscribeToCalendar(user.id, tokens.refresh_token);

    const payload = { userId: user.id };

    const token = getJwtToken(payload);

    res.cookie("auth-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 36000000,
    });

    res.redirect(config.frontend.url);
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

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId, {
        include: [
            {
                model: Discord,
                attributes: ["discordId"],
            },
        ],
    });

    if (!user) {
        return errorResponse(res, "User not found", 404);
    }

    successResponse(res, {
        id: user.id,
        email: user.email,
        discordId: user.Discord ? user.Discord.discordId : null,
    });
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
        try {
            const events = await fetchUpdatedEvents(resourceId);
            logger.info(`Fetched ${events ? events.length : 0} updated events`);
        } catch (error) {
            logger.error(`Error handling webhook events: ${error.message}`);
        }
    }

    res.sendStatus(200); // Acknowledge receipt
});
