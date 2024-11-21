import { DMChannel, Message, Client, GuildMember } from 'discord.js'; // Import necessary types
import { habitChannelIds, HabitCahnnels } from '../config/habitChannels';
import { logger } from '../utils/logger';
import { sendVerificationMessage } from '../services/verifiction.service';
import { handleHabitMessage } from '../services/habit-management/habit.service';
import { sendMessage } from '../services/announcement-management/sendMessage.service';

/**
 * Handles the event when a message is created.
 * @param message - The message object
 */
export const messageCreate = async (message: Message) => {
  try {
    if (message.author.bot) return; // Ignore bot messages

    const { channel, content, author } = message;

    // Determine the habit name based on the channel ID
    // let habitName: HabitName | undefined;
    const habitName = Object.keys(habitChannelIds).find(
      (habit) => habitChannelIds[habit as HabitCahnnels] === message.channel.id
    ) as HabitCahnnels | undefined;

      if (habitName) {

        try {
          await handleHabitMessage(message, habitName);
        } catch (error: any) {
          // If an error occurs, log it and send a message to the user
          if (error.response) {
            // Axios error response
            console.error('Axios error response:', error.response.data);
            await message.reply(error.response.data.error || 'An error occurred while completing your habit.');
          } else {
            // Non-Axios error
            console.error('Error:', error.message);
            await message.reply('An unexpected error occurred.');
          }
        }

        // Break after completing the habit for the channel
    }

    if (message.channel instanceof DMChannel) {
      // Check if the content is the verify command
      if (message.content.trim().toLowerCase() === 'verify') {
        // Fetch the member from the guild
        const guild = message.client.guilds.cache.first(); // Get the first guild in cache
        if (!guild) {
          await message.channel.send("Bot is not in any guild. Cannot verify.");
          return;
        }

        try {
          const member = await guild.members.fetch(message.author.id); // Fetch member from the guild
          if (!member) {
            await message.channel.send("You need to be in the server to verify.");
            return;
          }
          // Pass the client and member to the verification function
          sendVerificationMessage(message.client, member);
        } catch (err: any) {
          logger.error(`Error fetching member: ${err.message}`);
        }
      }
    }

  } catch (error) {
    // Log the error and notify the user
    if (error instanceof Error) {
      logger.error({
        message: `Error handling command: ${error.message}`,
        stack: error.stack
      });
    } else {
      logger.error({
        message: `Unexpected error: ${error}`,
      });
    }
  }
};
