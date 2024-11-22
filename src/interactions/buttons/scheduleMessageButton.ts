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
    .setTitle("Schedule a Message");

  const channelInput = new TextInputBuilder()
    .setCustomId("channel_id")
    .setLabel("Channel ID")
    .setStyle(TextInputStyle.Short);

  const messageInput = new TextInputBuilder()
    .setCustomId("message_content")
    .setLabel("Message Content")
    .setStyle(TextInputStyle.Paragraph);

  const dateInput = new TextInputBuilder()
    .setCustomId("scheduled_datetime")
    .setLabel("Scheduled Date & Time (YYYY-MM-DD HH:mm)")
    .setStyle(TextInputStyle.Short);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(channelInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput)
  );

  await interaction.showModal(modal);
};
