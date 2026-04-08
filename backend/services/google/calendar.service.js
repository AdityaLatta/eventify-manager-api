import { google } from "googleapis";
import { createOAuth2Client } from "./auth.service.js";

export const PRIMARY_CALENDAR = "primary";

export function createCalendarClient(refreshToken) {
    const oauth2 = createOAuth2Client();
    oauth2.setCredentials({ refresh_token: refreshToken });
    return google.calendar({ version: "v3", auth: oauth2 });
}
