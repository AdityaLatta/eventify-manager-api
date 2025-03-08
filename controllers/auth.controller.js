import { User } from "../models/user.model.js";
import {
    generateAuthUrl,
    getJwtToken,
    getUserProfile,
    oauth2Client,
    saveUser,
} from "../services/google/auth.service.js";

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

        const payload = { userId: user.id };

        const token = getJwtToken(payload);

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.redirect("http://localhost:5173/");
    } catch (error) {
        res.status(500).send("Authentication failed");
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

export const updateDiscord = async (req, res) => {
    const { email, discordId } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "User not found" });

        user.discordId = discordId;
        await user.save();

        res.json({ message: "Discord ID updated successfully" });
    } catch (error) {
        console.error("Error updating Discord ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};
