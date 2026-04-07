import cron from "node-cron";
import { Op } from "sequelize";
import { Google } from "../../models/index.js";
import { subscribeToCalendar } from "./events.service.js";
import { logger } from "../../utils/winston.js";

// Run every 12 hours — renew subscriptions expiring within 2 hours
export const startWebhookRenewalCron = () => {
    cron.schedule("0 */12 * * *", async () => {
        try {
            logger.info("Running webhook subscription renewal cron...");
            const expiring = await Google.findAll({
                where: {
                    webhookExpiration: { [Op.lt]: new Date(Date.now() + 2 * 60 * 60 * 1000) }
                }
            });

            for (const account of expiring) {
                const user = await account.getUser();
                if (user) {
                    logger.info(`Renewing webhook for user ${user.email}`);
                    await subscribeToCalendar(user.id, account.refreshToken);
                }
            }
        } catch (error) {
            logger.error(`Error in webhook renewal cron: ${error}`);
        }
    });
};
