import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import schedule from "node-schedule";
import { getUpcomingEvents } from "./events.service.js";

dotenv.config();

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    scheduleReminders();

    setInterval(scheduleReminders, 10 * 60000);
});

async function scheduleReminders() {
    const events = await getUpcomingEvents();

    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

    events.forEach((event) => {
        const eventTime = new Date(event.start.dateTime);
        const reminderTime = new Date(eventTime.getTime() - 4 * 60000);

        console.log(eventTime, reminderTime);

        channel.send(
            `Reminder: **${
                event.summary
            }** starts at ${eventTime.toLocaleTimeString()}`
        );

        schedule.scheduleJob(reminderTime, () => {
            channel.send(
                `Reminder: **${
                    event.summary
                }** starts at ${eventTime.toLocaleTimeString()}`
            );
        });
    });
}
