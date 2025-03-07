import express from "express";
import { config } from "./config/index.js";
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import { client } from "./services/discord/discordBot.js";
import { sequelize, connectDB } from "./services/Database/database.js";
import morgan from "morgan";
import { logger } from "./utils/winston.js";
import cors from "cors";

connectDB();

sequelize
    .sync({ alter: true })
    .then(() => logger.info("Database synced!"))
    .catch((err) => logger.error(`Error syncing database: ${err}`));

client.login(config.discord.DISCORD_BOT_TOKEN);

const port = config.port || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

app.listen(port, () => logger.info(`Server running on port ${port}`));
