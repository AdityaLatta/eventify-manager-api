import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";
import { Google, User } from "../../models/index.js";

const { client_id, client_secret, redirect_uris } = config.google.web;

export function createOAuth2Client() {
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris);
}

export const generateAuthUrl = () => {
  const localOauth2Client = createOAuth2Client();
  const url = localOauth2Client.generateAuthUrl({
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

export const getTokensFromCode = async (code) => {
  const localOauth2Client = createOAuth2Client();
  const { tokens } = await localOauth2Client.getToken(code);
  return tokens;
};

export const getUserProfile = async (tokens) => {
  const localOauth2Client = createOAuth2Client();
  localOauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: localOauth2Client });
  const userInfo = await oauth2.userinfo.get();
  return userInfo.data;
};

export async function saveUser(email, googleRefreshToken) {
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
}

export function getJwtToken(payload) {
  return jwt.sign(payload, config.jwt.JWT_SECRET, { expiresIn: "1d" });
}
