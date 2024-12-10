// src/interaction/modals/scheduleMessageModal.ts

import { v4 as uuidv4 } from "uuid";
import { Client, ModalSubmitInteraction, TextChannel } from "discord.js";
import { handleScheduleMessage } from "../../services/announcement-management/scheduleMessage.service";
import moment from "moment-timezone"; // Import moment-timezone
import { ScheduledMessage } from "../../interface/ScheduledMessage"; // Import interface

export const handleScheduleMessageModal = async (
  interaction: ModalSubmitInteraction,
  client: Client
) => {
  try {
    const announcementMessage = interaction.fields.getTextInputValue(
      "announcement_message"
    );
    const announcementDatetime = interaction.fields.getTextInputValue(
      "announcement_datetime"
    );
    const targetChannelIdInput =
      interaction.fields.getTextInputValue("target_channel_id");

    // Validate and parse Date and Time using moment-timezone
    const scheduledTime = moment.tz(
      announcementDatetime,
      "YYYY-MM-DD HH:mm",
      true, // Strict parsing
      "Asia/Tehran" // Timezone
    );

    if (!scheduledTime.isValid()) {
      await interaction.reply({
        content: "Invalid date and time format. Please use YYYY-MM-DD HH:MM.",
        ephemeral: true,
      });
      return;
    }

    // Ensure the scheduled time is in the future
    const now = moment.tz("Asia/Tehran");
    if (!scheduledTime.isAfter(now)) {
      await interaction.reply({
        content: "The scheduled time must be in the future.",
        ephemeral: true,
      });
      return;
    }

    // Validate Target Channel
    let targetChannel: TextChannel | null = null;
    if (targetChannelIdInput.toLowerCase() === "a") {
      const announcementChannelId = "1294691320908218478";
      targetChannel = interaction.guild?.channels.cache.get(
        announcementChannelId
      ) as TextChannel;
    } else {
      targetChannel = interaction.guild?.channels.cache.get(
        targetChannelIdInput
      ) as TextChannel;
    }

    if (!targetChannel || !targetChannel.isTextBased()) {
      await interaction.reply({
        content: "Invalid target channel ID.",
        ephemeral: true,
      });
      return;
    }

    // Convert scheduled time to UTC before storing
    const scheduledTimeUTC = scheduledTime.clone().utc().format(); // e.g., "2024-09-12T12:38:00.000Z"

    // Prepare the scheduled message object
    const scheduledMessage: ScheduledMessage = {
      id: uuidv4(), // Unique identifier
      message: announcementMessage,
      scheduledTime: scheduledTimeUTC, // Store in UTC
      channelId: targetChannel.id,
    };

    console.log(
      `Scheduled message to be added: ID=${scheduledMessage.id}, Time=${scheduledMessage.scheduledTime}`
    );

    // Save the scheduled message
    await handleScheduleMessage(scheduledMessage);

    await interaction.reply({
      content: `✅ Announcement scheduled for ${scheduledTime.format(
        "YYYY-MM-DD HH:mm"
      )} (Tehran Time).`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error handling schedule message modal:", error);
    await interaction.reply({
      content:
        "❌ An error occurred while scheduling the announcement. Please try again.",
      ephemeral: true,
    });
  }
};
