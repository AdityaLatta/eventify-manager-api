import {
    generateAuthUrl,
    getToken,
    oauth2Client,
    removeToken,
    saveToken,
} from "../services/auth.service.js";

export const login = (req, res) => {
    const token = getToken();

    if (token && token.expiry_date > Date.now()) {
        oauth2Client.setCredentials(token);
        return res.redirect("/events");
    }

    const url = generateAuthUrl();
    res.json({ Message: "Please visit url below to login", url });
};

export const auth = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        saveToken(tokens);
        res.send("Authentication successful! You can now create events.");
    } catch (error) {
        res.status(500).send("Authentication failed");
    }
};

export const logout = (req, res) => {
    removeToken();
    res.json({ message: "User logged out successfully!" });
};
