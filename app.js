import express from "express";
import { config } from "./config/index.js";
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import { client } from "./services/discord/discordBot.js";
import { startWebhookRenewalCron } from "./services/google/webhook.service.js";
import { sequelize, connectDB } from "./services/Database/database.js";
import morgan from "morgan";
import { logger } from "./utils/winston.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

await connectDB();

if (process.env.NODE_ENV !== "production") {
    try {
        await sequelize.sync({ alter: true });
        logger.info("Database synced!");
    } catch (err) {
        logger.error(`Error syncing database: ${err}`);
    }
} else {
    logger.info("Skipping database sync in production. Ensure migrations are applied.");
}

client.login(config.discord.DISCORD_BOT_TOKEN);
startWebhookRenewalCron();

const port = config.port || 3000;

const app = express();
app.set('trust proxy', 1);

app.use(express.json());

const allowedOrigins = ["https://eventify.vercel.app", "http://localhost:5173"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: "Too many requests, please try again later." }
});
app.use(limiter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

app.listen(port, () => logger.info(`Server running on port ${port}`));
