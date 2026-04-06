import { DataTypes } from "sequelize";
import { sequelize } from "../services/Database/database.js";

export const Discord = sequelize.define(
    "Discord",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        discordId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);
