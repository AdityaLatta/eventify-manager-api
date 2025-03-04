import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const credentialsPath = path.resolve(dirname, "../config/credentials.json");
const tokenPath = path.resolve(dirname, "../config/token.json");

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
const { client_id, client_secret, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

const generateAuthUrl = () => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar"],
    });

    return url;
};

const saveToken = (token) => {
    fs.writeFileSync(tokenPath, JSON.stringify(token, null, 4));
};

const getToken = () => {
    if (fs.existsSync(tokenPath)) {
        return JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    } else {
        return null;
    }
};

const removeToken = () => {
    if (fs.existsSync(tokenPath)) {
        fs.unlinkSync(tokenPath);
    }
};

export { oauth2Client, generateAuthUrl, saveToken, getToken, removeToken };
