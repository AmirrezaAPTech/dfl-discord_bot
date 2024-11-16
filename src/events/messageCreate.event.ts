// src/events/messageCreate.event.ts
import { Message } from 'discord.js';
import { habitChannels, HabitName } from '../config/habitChannels';
import { completeHabit } from '../services/habit.service';
import { logger } from '../utils/logger';

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
