import { Client, GuildMember } from 'discord.js';
import { sendVerificationMessage } from '../services/verifiction.service';

/**
 * Handles the event when a new guild member is added.
 * @param {GuildMember} member - The new guild member
 * @param {Client} client - The Discord client instance
 */
export const handleGuildMemberAdd = async (member: GuildMember, client: Client): Promise<void> => {
  try {
    // Send a private message to the user
    await sendVerificationMessage(client, member);
  } catch (err: any) {
    console.error(`Error sending verification message: ${err.message || err}`);
  }
};
