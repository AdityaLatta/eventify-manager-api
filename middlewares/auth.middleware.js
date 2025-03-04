import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { oauth2Client } from "../services/auth.service.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(dirname, "../config/token.json");

export function isAuthenticated(req, res, next) {
    if (fs.existsSync(tokenPath)) {
        const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
        oauth2Client.setCredentials(token);

        if (new Date(token.expiry_date) < new Date()) {
            res.status(401).json({ error: "Unauthorized! Please log in." });
        }

        next();
    } else {
        res.status(401).json({ error: "Unauthorized! Please log in." });
    }
}
