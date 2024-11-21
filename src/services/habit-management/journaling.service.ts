import axios from 'axios';
import { logger } from '../../utils/logger';

/**
 * Sends a journaling text to the backend.
 * @param {string} discordId - The user's Discord ID.
 * @param {string} text - The journaling text.
 */
export const sendJournalingText = async (discordId: string, text: string) => {
  try {
    const response = await axios.post(
      'https://doerforlife.net/api/manychat-discord-telegram/admin/habit-management/save-user-journaling',
      {
        dflIDOrDiscordID: discordId,
        text,
      }
    );
    logger.info(`Journaling text saved: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    logger.error(`Failed to save journaling text: ${error.message}`);
    throw new Error('Failed to save journaling text');
  }
};
