import { google } from "googleapis";
import { createCalendarClient } from "./calendar.service.js";
import { Google } from "../../models/google.model.js";
import { User } from "../../models/user.model.js";
import { oauth2Client } from "./auth.service.js";

export async function getUpcomingEvents(user) {
    try {
        const googleAccount = await Google.findByPk(user.googleId);
        if (!googleAccount) {
            console.error(`No Google account found for user ${user.email}`);
            return [];
        }


        const calendar = createCalendarClient(googleAccount.refreshToken);

        const now = new Date();
        const timeMin = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
        const timeMax = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

        const res = await calendar.events.list({
            auth: oauth2Client,
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
        });

        return res.data.items || [];
    } catch (error) {
        console.error(`Error fetching events for ${user.email}:`, error);
        return [];
    }
}

export async function subscribeToCalendar(userId, refreshToken) {
    try {


        const calendar = createCalendarClient(refreshToken);

        const response = await calendar.events.watch({
            calendarId: "primary",
            requestBody: {
                id: `channel-${Date.now()}`,
                type: "webhook",
                address: "https://authentic-lightweight-rrp-till.trycloudflare.com/auth/webhook",
                params: {
                    ttl: 86400,
                },
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
            { where: { id: user.googleId } }
        );

        console.log("Subscribed to Google Calendar updates for user:");
    } catch (error) {
        console.error("Error subscribing to calendar:", error);
    }
}

export async function fetchUpdatedEvents(resourceId) {
    try {
        console.log("Updated Events-------");

        const user = await Google.findOne({
            where: {
                webhookResourceId: resourceId,
            },
        });



        const calendar = createCalendarClient(user.refreshToken);

        const response = await calendar.events.list({
            calendarId: "primary",
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        return response.data.items;
    } catch (error) {
        console.error("Error fetching updated events:", error);
    }
}
