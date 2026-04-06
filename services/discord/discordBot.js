import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import cron from "node-cron";
import { User } from "../../models/user.model.js";
import { Discord } from "../../models/discord.model.js";
import { getUpcomingEvents } from "../google/events.service.js";
import { logger } from "../../utils/winston.js";

dotenv.config();

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    cron.schedule("* * * * *", async () => {
        await scheduleReminders();
    });
});

async function sendReminder(user, message) {
    if (!user.discordId) {
        logger.error(`No Discord link found for user ${user.email}`);
        return;
    }

    const discordAccount = await Discord.findByPk(user.discordId);
    if (!discordAccount || !discordAccount.discordId) {
        logger.error(`No Discord ID found for user ${user.email}`);
        return;
    }

    const discordUser = await client.users.fetch(discordAccount.discordId);

    if (discordUser) {
        await discordUser.send(`Reminder: ${message} starts in 5 minutes!`);
        logger.info(`Message sent to ${discordUser.tag}`);
    }
}

async function scheduleReminders() {
    const users = await User.findAll();
    const now = new Date();

    for (const user of users) {
        const events = await getUpcomingEvents(user);

        for (const event of events) {
            const eventStart = new Date(event.start.dateTime);
            const minutesToEvent = Math.floor((eventStart - now) / 60000);

            if (minutesToEvent === 5) {
                await sendReminder(user, event.summary);
            }
        }
    }
}
