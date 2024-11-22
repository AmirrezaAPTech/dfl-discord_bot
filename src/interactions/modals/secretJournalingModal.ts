import { Client, ModalSubmitInteraction } from 'discord.js';
import { saveScheduledMessage } from '../../services/announcement-management/sendMessage.service';
import { handleHabitMessage, handleSecretJournaling } from '../../services/habit-management/habit.service';

export const handleSecretJournalingModal = async (interaction: ModalSubmitInteraction, client: Client) => {
  try {
    const journalingContent = interaction.fields.getTextInputValue('journaling_content');
    const discordId = interaction.user.id;

    const successful = await handleSecretJournaling( client, journalingContent, discordId)

    // Only reply if successful
    if (successful) {
      await interaction.reply({
        content: 'جورنالبنگ ناشناس شما با موفقیت ثبت شد',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'دوباره تلاش کن!',
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
