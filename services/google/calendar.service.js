import { google } from "googleapis";
import { config } from "../../config/index.js";

const { client_id, client_secret, redirect_uris } = config.google.web;

export function createCalendarClient(refreshToken) {
    const oauth2 = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
    oauth2.setCredentials({ refresh_token: refreshToken });
    return google.calendar({ version: "v3", auth: oauth2 });
}
