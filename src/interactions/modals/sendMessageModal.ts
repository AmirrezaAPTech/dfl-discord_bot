import { ModalSubmitInteraction } from 'discord.js';
import { sendMessage } from '../../services/announcement-management/sendMessage.service';

export const handleSendMessageModal = async (interaction: ModalSubmitInteraction) => {
  try {
    const channelID = interaction.fields.getTextInputValue('channel_id');
    const messageContent = interaction.fields.getTextInputValue('message_content');

    // Attempt to send the message
    const successful = await sendMessage(channelID, messageContent);

    // Respond based on the outcome
    if (successful) {
      await interaction.reply({
        content: 'Message sent successfully!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'Failed to send the message. Please try again later.',
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error('Error handling send message modal:', error);
    await interaction.reply({
      content: 'An unexpected error occurred. Please try again later.',
      ephemeral: true,
    });
  }
};
