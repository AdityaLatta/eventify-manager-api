import { calendar } from "../../controllers/events.controller.js";
import { oauth2Client } from "./auth.service.js";

export async function getUpcomingEvents(user) {
    try {
        oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

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
