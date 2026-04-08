import { DataTypes } from "sequelize";
import { sequelize } from "../services/Database/database.js";

export const Google = sequelize.define("Google", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    webhookChannelId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    webhookResourceId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    webhookExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});
