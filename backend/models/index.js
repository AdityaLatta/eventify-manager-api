import { User } from "./user.model.js";
import { Google } from "./google.model.js";
import { Discord } from "./discord.model.js";

// Define relationships
Google.hasOne(User, { foreignKey: "googleId" });
User.belongsTo(Google, { foreignKey: "googleId" });

Discord.hasOne(User, { foreignKey: "discordId" });
User.belongsTo(Discord, { foreignKey: "discordId" });

// Export models
export { User, Google, Discord };
