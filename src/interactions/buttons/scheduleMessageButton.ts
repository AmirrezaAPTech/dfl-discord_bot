// src/interaction/buttons/scheduleMessageButton.ts

import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const handleScheduleMessageButton = async (
  interaction: ButtonInteraction
) => {
  const modal = new ModalBuilder()
    .setCustomId("modal_schedule_message")
    .setTitle("زمانبندی اعلامیه");

  // Announcement Message Input
  const announcementInput = new TextInputBuilder()
    .setCustomId("announcement_message")
    .setLabel("متن اعلامیه")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(2000);

  // Date and Time Input
  const dateTimeInput = new TextInputBuilder()
    .setCustomId("announcement_datetime")
    .setLabel("تاریخ و زمان (YYYY-MM-DD HH:MM)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("مثال: 2024-12-31 23:59")
    .setRequired(true);

  // Target Channel ID Input
  const targetChannelInput = new TextInputBuilder()
    .setCustomId("target_channel_id")
    .setLabel("شناسه کانال هدف (a برای اعلان‌ها)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("مثال: a یا 123456789012345678")
    .setRequired(true);

  // Add inputs to the modal
  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(announcementInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateTimeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(targetChannelInput)
  );

  await interaction.showModal(modal);
};
