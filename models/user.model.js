import { DataTypes } from "sequelize";
import { sequelize } from "../services/Database/database.js";
import { Google } from "./google.model.js";
import { Discord } from "./discord.model.js";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        googleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Googles",
                key: "id",
            },
        },
        discordId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Discords",
                key: "id",
            },
        },
    },
    {
        timestamps: true,
    }
);
