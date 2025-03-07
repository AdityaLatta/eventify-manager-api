import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT,

    google: {
        web: {
            client_id: process.env.CLIENT_ID,
            project_id: process.env.PROJECT_ID,
            auth_uri: process.env.AUTH_URI,
            token_uri: process.env.TOKEN_URI,
            auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uris: process.env.REDIRECT_URIS,
            javascript_origins: process.env.JAVASCRIPT_ORIGINS,
        },
    },

    discord: {
        DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
        DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
    },

    db: {
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
    },

    jwt: {
        JWT_SECRET: process.env.JWT_SECRET,
    },
};
