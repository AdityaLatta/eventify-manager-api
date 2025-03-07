import { DataTypes } from "sequelize";
import { sequelize } from "../services/Database/database.js";

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
        googleRefreshToken: {
            type: DataTypes.STRING,
            allowNull: false,
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
