import { DMChannel, Message, Client, GuildMember } from 'discord.js'; // Import necessary types
import { habitChannels, HabitName } from '../config/habitChannels';
import { completeHabit } from '../services/habit.service';
import { logger } from '../utils/logger';
import { sendVerificationMessage } from '../services/verifiction.service';

/**
 * Handles the event when a message is created.
 * @param message - The message object
 */
export const messageCreate = async (message: Message) => {
  try {
    if (message.author.bot) return; // Ignore bot messages

    const { channel, content, author } = message;

    // Determine the habit name based on the channel ID
    let habitName: HabitName | undefined;
    for (const [key, id] of Object.entries(habitChannels)) {
      if (channel.id === id) {
        habitName = key as HabitName;
        
        // Prepare the habit completion data
        const habitData = {
          userId: author.id, // Use author ID
          habitName,
          data: content // Use the message content
        };
        
        // Call the habit completion service (await this)
        const response = await completeHabit(habitData);

        // Optionally handle the response if necessary, or log the success
        logger.log(`Habit '${habitName}' completed successfully by ${author.id}`);

        // Break after completing the habit for the channel
        break;
      }
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

    // If the message is in an unrelated channel, ignore it
    if (!habitName) return;

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
