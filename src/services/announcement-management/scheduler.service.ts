// src/services/announcement-management/scheduler.service.ts

import { Client, TextChannel } from "discord.js";
import {
  loadScheduledMessages,
  removeScheduledMessage,
} from "./scheduleMessage.service";
import moment from "moment-timezone"; // Import moment-timezone
import { ScheduledMessage } from "../../interface/ScheduledMessage";

export const startScheduler = (client: Client) => {
  console.log("Scheduler started.");

  // Check every minute
  setInterval(async () => {
    try {
      const messages = await loadScheduledMessages();
      const nowUTC = moment.utc();
      console.log(
        `Scheduler running at ${nowUTC.format("YYYY-MM-DD HH:mm:ss")} UTC`
      );
      console.log(`Total scheduled messages: ${messages.length}`);

      const dueMessages = messages.filter((msg) => {
        const scheduledTime = moment.utc(msg.scheduledTime);
        const isDue = scheduledTime.isSameOrBefore(nowUTC);
        if (isDue) {
          console.log(
            `Message ID ${
              msg.id
            } is due for sending. Scheduled Time: ${scheduledTime.format(
              "YYYY-MM-DD HH:mm:ss"
            )} UTC`
          );
        }
        return isDue;
      });

      for (const msg of dueMessages) {
        try {
          const channel = client.channels.cache.get(
            msg.channelId
          ) as TextChannel;
          if (channel && channel.isTextBased()) {
            await channel.send(msg.message);
            console.log(
              `Sent scheduled message ID ${msg.id} to channel ${
                msg.channelId
              } at ${nowUTC.format("YYYY-MM-DD HH:mm:ss")} UTC`
            );
          } else {
            console.error(
              `Channel ID ${msg.channelId} not found or is not a text channel.`
            );
          }
        } catch (sendError) {
          console.error(
            `Failed to send scheduled message ID ${msg.id}:`,
            sendError
          );
        }

        // Remove the sent message from storage
        await removeScheduledMessage(msg.id);
        console.log(`Removed scheduled message ID ${msg.id} from storage.`);
      }
    } catch (error) {
      console.error("Error in scheduler:", error);
    }
  }, 60 * 1000); // Every minute
};
