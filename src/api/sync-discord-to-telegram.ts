import axios, { AxiosResponse } from 'axios';
import { logger } from '../utils/logger';

// Define the expected structure of the API response
interface ManyChatApiResponse {
  message: string; // Example: 'USER_NOT_FOUND', 'USER_ALREADY_SYNCED', 'SYNCED'
  [key: string]: any; // For additional properties in the response
}

/**
 * Syncs Discord ID and DFLID with the ManyChat API.
 *
 * @param {string} discordID - The Discord ID of the user.
 * @param {string} dflID - The DFLID of the user.
 * @returns {Promise<ManyChatApiResponse>} - The API response data.
 * @throws {Error} - Throws an error if the operation fails.
 */
export const syncDiscordToManyChat = async (
  discordID: string,
  dflID: string
): Promise<ManyChatApiResponse> => {
  try {
    const response: AxiosResponse<ManyChatApiResponse> = await axios.post(
      'https://doerforlife.net/api/manychat-discord-telegram/admin/user-management/sync-discord-to-telegram',
      {
        discordID,
        dflID,
      }
    );

    // Check for the expected status code
    if (response.status === 201) {
      logger.info(`API Response: ${JSON.stringify(response.data)}`);
      const { message } = response.data;

      switch (message) {
        case 'USER_NOT_FOUND':
          throw new Error('USER_NOT_FOUND'); // Throw specific error for user not found
        case 'USER_ALREADY_SYNCED':
          throw new Error('USER_ALREADY_SYNCED'); // Throw specific error for user already synced
        case 'SYNCED':
          return response.data; // Operation was successful
        default:
          throw new Error(`Unexpected response message: ${message}`);
      }
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (err: any) {
    logger.error(`ManyChat API error: ${err.message}`);
    if (err.response) {
      logger.error(`Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`);
    }
    throw err; // Rethrow to propagate the error up the call stack
  }
};
