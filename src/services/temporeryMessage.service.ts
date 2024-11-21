import { TextChannel } from 'discord.js';

/**
 * Sends a temporary message to a channel and deletes it after a specified delay.
 * @param {TextChannel} channel - The Discord channel to send the message to.
 * @param {string} content - The message content to send.
 * @param {number} delayInSeconds - The delay in seconds before the message is deleted.
 */
export const sendTemporaryMessage = async (
  channel: TextChannel,
  content: string,
  delayInSeconds: number
): Promise<void> => {
  try {
    // Send the message to the channel
    const message = await channel.send(content);

    // Schedule the message for deletion
    setTimeout(async () => {
      try {
        await message.delete();
      } catch (error: any) {
        console.error(`Failed to delete the message: ${error.message || error}`);
      }
    }, delayInSeconds * 1000); // Convert seconds to milliseconds
  } catch (error: any) {
    console.error(`Failed to send a temporary message: ${error.message || error}`);
  }
};
