import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";
import { Google } from "../../models/google.model.js";
import { User } from "../../models/user.model.js";

const { client_id, client_secret, redirect_uris } = config.google.web;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris
);

const generateAuthUrl = () => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/calendar",
            "openid",
            "email",
            "profile",
        ],
    });

    return url;
};

const getUserProfile = async () => {
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    return userInfo.data;
};

async function saveUser(email, googleRefreshToken) {
    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
            // Check if a Google record exists for the user
            let googleAccount = await Google.findOne({
                where: { id: user.googleId },
            });

            if (googleAccount) {
                // Update the refresh token
                googleAccount.refreshToken = googleRefreshToken;
                await googleAccount.save();
            } else {
                // Create new Google record and link it to the User
                googleAccount = await Google.create({
                    refreshToken: googleRefreshToken,
                });
                user.googleId = googleAccount.id;
                await user.save();
            }
        } else {
            // Create a new Google record first
            const googleAccount = await Google.create({
                refreshToken: googleRefreshToken,
            });

            // Create a new User and link it to Google
            user = await User.create({ email, googleId: googleAccount.id });
        }

        return user;
    } catch (error) {
        console.error("Error saving user:", error);
        throw error;
    }
}

function getJwtToken(payload) {
    return jwt.sign(payload, config.jwt.JWT_SECRET, { expiresIn: "1d" });
}

export { generateAuthUrl, getJwtToken, getUserProfile, saveUser, oauth2Client };
