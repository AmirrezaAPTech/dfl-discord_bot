import { ModalSubmitInteraction } from 'discord.js';
import { saveScheduledMessage } from '../../services/announcement-management/sendMessage.service';

export const handleScheduleMessageModal = async (interaction: ModalSubmitInteraction) => {
  try {
    const channelID = interaction.fields.getTextInputValue('channel_id');
    const messageContent = interaction.fields.getTextInputValue('message_content');
    const scheduledDateTimeString = interaction.fields.getTextInputValue('scheduled_datetime');

    // Convert the string to a Date object
    const scheduledDateTime = new Date(scheduledDateTimeString);

    // Check if the Date is valid
    if (isNaN(scheduledDateTime.getTime())) {
      await interaction.reply({
        content: 'Invalid date format. Please provide a valid date.',
        ephemeral: true,
      });
      return;
    }
    console.log(scheduledDateTime);
    

    // Attempt to save the scheduled message
    const successful = await saveScheduledMessage(channelID, messageContent, scheduledDateTime);

    // Only reply if successful
    if (successful) {
      await interaction.reply({
        content: 'Message scheduled successfully!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'Failed to schedule the message. Please try again later.',
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error('Error handling schedule message modal:', error);
    await interaction.reply({
      content: 'An unexpected error occurred. Please try again later.',
      ephemeral: true,
    });
  }
};
