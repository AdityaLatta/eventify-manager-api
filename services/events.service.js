import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { oauth2Client } from "./auth.service.js";
import { calendar } from "../controllers/events.controller.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(dirname, "../config/token.json");

export async function getUpcomingEvents() {
    if (fs.existsSync(tokenPath)) {
        const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
        oauth2Client.setCredentials(token);
    }

    const now = new Date();
    const after5Minutes = new Date();
    after5Minutes.setMinutes(now.getMinutes() + 10);

    const timeMin = now.toISOString();
    const timeMax = after5Minutes.toISOString();

    const res = await calendar.events.list({
        calendarId: "primary",
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
    });

    return res.data.items;
}
