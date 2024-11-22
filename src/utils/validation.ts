import { Message, Guild } from "discord.js";
import { logger } from "../utils/logger";

// List of admin user IDs allowed to use admin-specific APIs
const adminUserIds = [
  "123456789012345678", // Replace with actual admin user IDs
  "234567890123456789",
  "345678901234567890",
  "456789012345678901",
  "567890123456789012",
];

/**
 * Validates if a user is a member of the target server.
 * @param userId - The user's Discord ID
 * @param guild - The Discord guild object
 * @returns True if the user is a member, false otherwise
 */
export const validateUserInServer = async (
  userId: string,
  guild: Guild
): Promise<boolean> => {
  try {
    const member = await guild.members.fetch(userId);
    return !!member; // Member exists in the guild
  } catch {
    return false; // User is not in the guild
  }
};

/**
 * Validates if a user is an admin.
 * @param message - The message object
 * @returns True if the user is an admin, false otherwise
 */
export const validateAdminAccess = (message: Message): boolean => {
  if (!adminUserIds.includes(message.author.id)) {
    message.reply("You do not have permission to use this feature.");
    return false;
  }
  return true;
};
