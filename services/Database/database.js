import { Sequelize } from "sequelize";
import { config } from "../../config/index.js";
import { logger } from "../../utils/winston.js";

export const sequelize = new Sequelize(
    config.db.DB_NAME,
    config.db.DB_USER,
    config.db.DB_PASSWORD,
    {
        host: config.db.DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info("PostgreSQL connected!");
    } catch (error) {
        console.error();
        logger.error(`Error connecting to the database: ${error}`);
    }
};
