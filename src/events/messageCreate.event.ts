import {
  DMChannel,
  Message,
  Client,
  GuildMember,
  ThreadChannel,
  TextChannel,
} from "discord.js"; // Import necessary types
import { habitChannelIds, HabitCahnnels } from "../config/habitChannels";
import { logger } from "../utils/logger";
import { sendVerificationMessage } from "../services/verifiction.service";
import { handleHabitMessage } from "../services/habit-management/habit.service";
import { sendMessage } from "../services/announcement-management/sendMessage.service";
import { sendMessageCommand } from "../commands/admin/sendMessage";
import { scheduleMessageCommand } from "../commands/admin/scheduleMessage";
import { secretJournalingCommand } from "../commands/user/secretJournaling";
import dotenv from "dotenv";
import { validateAdminAccess, validateUserInServer } from "../utils/validation";
import { sendIdeaCommand } from "../commands/user/sendIdea";
import { createTodoThread } from "../utils/todo";
import {
  createTask,
  storeTaskData,
} from "../services/todo-management/todo.service";
import { helpCommand } from "../commands/user/help";

dotenv.config();

/**
 * Handles the event when a message is created.
 * @param message - The message object
 */
export const messageCreate = async (message: Message) => {
  try {
    if (message.author.bot) return; // Ignore bot messages

    const client = message.client;
    const guildId = process.env.GUILD_ID;
    const todoChannel = process.env.TODO_CHANNEL_ID;
    if (!guildId) {
      throw new Error("GUILD_ID is not defined");
    }
    const guild = client.guilds.cache.get(guildId);

    if (guild) {
      const isMember = await validateUserInServer(message.author.id, guild);
      if (!isMember) {
        await message.reply(
          "You must be a member of our server to use this bot."
        );
        return;
      }
    } else {
      throw new Error("guild is not defined");
    }

    const { channel, content, author } = message;

    // Determine the habit name based on the channel ID
    const habitName = Object.keys(habitChannelIds).find(
      (habit) => habitChannelIds[habit as HabitCahnnels] === message.channel.id
    ) as HabitCahnnels | undefined;

    if (habitName && message.channel instanceof TextChannel) {
      try {
        await handleHabitMessage(message, habitName);
      } catch (error: any) {
        // If an error occurs, log it and send a message to the user
        if (error.response) {
          // Axios error response
          console.error("Axios error response:", error.response.data);
          await message.reply(
            error.response.data.error ||
              "An error occurred while completing your habit."
          );
        } else {
          // Non-Axios error
          console.error("Error:", error.message);
          await message.reply("An unexpected error occurred.");
        }
      }

      // Break after completing the habit for the channel
    } else if (message.content.toLowerCase() === "!sendmessage") {
      if (!validateAdminAccess(message)) return;
      await sendMessageCommand(message);
    } else if (
      message.channelId === "1295347682508017697" &&
      message.content.toLowerCase() === "!sm"
    ) {
      if (!validateAdminAccess(message)) return;
      await scheduleMessageCommand(message);
    }

    if (message.channel instanceof DMChannel) {
      // Check if the content is the verify command
      if (message.content.trim().toLowerCase() === "verify") {
        // Fetch the member from the guild
        const guild = message.client.guilds.cache.first(); // Get the first guild in cache
        if (!guild) {
          await message.channel.send("Bot is not in any guild. Cannot verify.");
          return;
        }

        try {
          const member = await guild.members.fetch(message.author.id); // Fetch member from the guild
          if (!member) {
            await message.channel.send(
              "You need to be in the server to verify."
            );
            return;
          }
          // Pass the client and member to the verification function
          sendVerificationMessage(message.client, member);
        } catch (err: any) {
          logger.error(`Error fetching member: ${err.message}`);
        }
      } else if (message.content.toLowerCase() === "j") {
        await secretJournalingCommand(message);
      } else if (message.content.toLowerCase() === "idea") {
        await sendIdeaCommand(message);
      } else if (message.content.toLowerCase() === "help") {
        await helpCommand(message);
      }
    }

    // Handle Replies Outside of Threads
    else if (
      message.reference &&
      !(message.channel instanceof ThreadChannel) &&
      message.channel instanceof TextChannel
    ) {
      const messageId = message.reference.messageId;
      if (messageId) {
        try {
          const repliedMessage = await message.channel.messages.fetch(
            messageId
          );

          if (repliedMessage) {
            await message.delete();

            let thread = repliedMessage.hasThread
              ? repliedMessage.thread
              : await repliedMessage.startThread({
                  name: `.`,
                  autoArchiveDuration: 1440,
                  reason: "Organized reply threads",
                });

            if (thread) {
              await thread.send(
                `<@${message.author.id}> بهت ریپلای زد و گفت :\n${message.content}`
              );
            }
          }
        } catch (error: any) {
          logger.error(
            `Error for converting reply to thread: ${error.message || error}`
          );
        }
      }
    } else if (message.channel.id === todoChannel) {
      //TODO
      const timeRegex = /Time:\s*(\d{2}):(\d{2})/;
      const match = message.content.match(timeRegex);

      if (!match) {
        const thread = await message.startThread({
          name: `تاریخ بی اعتبار`,
          autoArchiveDuration: 60,
        });
        await thread.send(
          `نحوه فرستادن تودوت اشتباهه! \n برای اینکه حتما تودوت ثبت بشه باید اولش زمان چک شدن و به این صورت مشخص کنی: \n Time: hh:mm`
        );
        return;
      }

      const taskTime = `${match[1]}:${match[2]}`; // Extracted time
      const taskDescription = message.content.replace(/Time:.*/, "").trim(); // Task description

      // Call createTask instead of directly storing data
      await createTask(message, taskTime, taskDescription);
    }
  } catch (error) {
    // Log the error and notify the user
    if (error instanceof Error) {
      logger.error({
        message: `Error handling command: ${error.message}`,
        stack: error.stack,
      });
    } else {
      logger.error({
        message: `Unexpected error: ${error}`,
      });
    }
  }
};
