import { ModalSubmitInteraction, Client } from "discord.js";
import { handleIdeaModalSubmit } from "../../services/idea_management/sendIdea.service";
import { logger } from "../../utils/logger";

// Define an interface for stored data
interface IdeaData {
  isSecret: boolean;
}

// Exporting tempIdeaData for use in other modules
export const tempIdeaData = new Map<string, IdeaData>();

/**
 * Handles the submission of the idea modal.
 * @param interaction - The modal submission interaction
 * @param client - The Discord client
 */
export const handleIdeaModal = async (
  interaction: ModalSubmitInteraction,
  client: Client
) => {
  try {
    // Retrieve the stored choice (isSecret) for the user
    const storedData = tempIdeaData.get(interaction.user.id);
    if (!storedData) {
      await interaction.reply({
        content: "خطایی در بازیابی اطلاعات رخ داد. لطفاً دوباره تلاش کنید.",
        ephemeral: true,
      });
      return;
    }

    const { isSecret } = storedData;
    const content = interaction.fields.getTextInputValue("idea_content");

    // Process the idea based on the user's choice
    const success = await handleIdeaModalSubmit(
      client,
      interaction,
      content,
      isSecret
    );

    if (success) {
      await interaction.reply({
        content: `ایده شما به صورت ${isSecret ? "ناشناس" : "عمومی"} ثبت شد.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "خطایی در ثبت ایده رخ داد. لطفاً دوباره تلاش کنید.",
        ephemeral: true,
      });
    }

    // Clean up the stored data
    tempIdeaData.delete(interaction.user.id);
  } catch (error: any) {
    logger.error(`Error handling idea modal: ${error.message}`);
    if (!interaction.replied) {
      await interaction.reply({
        content: "An unexpected error occurred. Please try again later.",
        ephemeral: true,
      });
    }
    // Ensure cleanup even if an error occurs
    tempIdeaData.delete(interaction.user.id);
  }
};
