import { Google, User } from "../../models/index.js";
import { logger } from "../../utils/winston.js";
import { createCalendarClient, PRIMARY_CALENDAR } from "./calendar.service.js";

export async function getUpcomingEvents(user) {
    try {
        const googleAccount = await Google.findByPk(user.googleId);
        if (!googleAccount) {
            logger.error(`No Google account found for user ${user.email}`);
            return [];
        }

        const calendar = createCalendarClient(googleAccount.refreshToken);

        const now = new Date();
        const timeMin = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
        const timeMax = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

        const res = await calendar.events.list({
            calendarId: PRIMARY_CALENDAR,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
        });

        return res.data.items || [];
    } catch (error) {
        logger.error(`Error fetching events for ${user.email}: ${error.message}`);
        return [];
    }
}

export async function subscribeToCalendar(userId, refreshToken) {
    try {
        const calendar = createCalendarClient(refreshToken);

        const response = await calendar.events.watch({
            calendarId: PRIMARY_CALENDAR,
            requestBody: {
                id: `channel-${Date.now()}`,
                type: "webhook",
                address: process.env.WEBHOOK_URL,
                params: {
                    ttl: 86400,
                },
                token: process.env.WEBHOOK_SECRET,
            },
        });

        const user = await User.findByPk(userId);

        // Save webhook subscription details in DB
        await Google.update(
            {
                webhookChannelId: response.data.id,
                webhookResourceId: response.data.resourceId,
                webhookExpiration: new Date(Date.now() + 86400 * 1000),
            },
            { where: { id: user.googleId } },
        );

        logger.info(
            `Subscribed to Google Calendar updates for user: ${user.email}`,
        );
    } catch (error) {
        logger.error(`Error subscribing to calendar: ${error.message}`);
    }
}

export async function fetchUpdatedEvents(resourceId) {
    try {
        logger.info("Fetching updated events...");

        const user = await Google.findOne({
            where: {
                webhookResourceId: resourceId,
            },
        });

        const calendar = createCalendarClient(user.refreshToken);

        const response = await calendar.events.list({
            calendarId: PRIMARY_CALENDAR,
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        return response.data.items;
    } catch (error) {
        logger.error(`Error fetching updated events: ${error.message}`);
    }
}
