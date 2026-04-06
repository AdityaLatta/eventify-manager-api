import { Discord } from "../models/discord.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
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

export const login = (req, res) => {
    const url = generateAuthUrl();
    res.json({ Message: "Please visit url below to login", url });
};

export const auth = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        let { email } = await getUserProfile();

        const user = await saveUser(email, tokens.refresh_token);

        await subscribeToCalendar(user.id, tokens.refresh_token);

        const payload = { userId: user.id };

        const token = getJwtToken(payload);

        res.json({ token });

        // res.send(`
        //     <script>
        //       window.opener.postMessage({
        //         type: 'oauth-success',
        //         token: '${token}'
        //       }, 'http://localhost:5173'); 
        //       window.close();
        //     </script>
        //   `);
    } catch (error) {
        res.status(500).send("Authentication failed");
    }
};

export const setToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        jwt.verify(token, config.jwt.JWT_SECRET);

        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 36000000,
        });

        res.send({ message: "cookies set successfully" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const logout = (req, res) => {
    res.send("To be done");
};

export const updateDiscord = async (req, res) => {
    const { discordId } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

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

        res.json({ message: "Discord ID updated successfully" });
    } catch (error) {
        console.error("Error updating Discord ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const webhook = async (req, res) => {
    if (req.headers["x-goog-channel-token"] !== process.env.WEBHOOK_SECRET) {
        return res.sendStatus(403);
    }
    
    console.log("Received Google Calendar Webhook Notification:", req.headers);

    // Google sends notifications when events are updated/deleted
    const resourceId = req.headers["x-goog-resource-id"];
    const resourceState = req.headers["x-goog-resource-state"];

    if (resourceState === "exists" || resourceState === "sync") {
        console.log(`Calendar updated: ${resourceId}`);
        // Fetch the updated events from Google Calendar
        const events = await fetchUpdatedEvents(resourceId);

        console.log(events);
    }

    res.sendStatus(200); // Acknowledge receipt
};
