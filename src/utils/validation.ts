import { Message, Guild, TextChannel } from "discord.js";
import { logger } from "../utils/logger";
import { sendTemporaryMessage } from "../services/temporeryMessage.service";

// List of admin user IDs allowed to use admin-specific APIs
const adminUserIds = [
  "884017475182796810", // Replace with actual admin user IDs
  "942348370045992960",
  "1119289139259519126",
  "931859079742226453",
  "943105263563604018",
  "798823711213092864",
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
    sendTemporaryMessage(
      message.channel as TextChannel,
      `<@${message.author.id}> You do not have permission to use this feature.`,
      20
    );
    return false;
  }
  return true;
};
