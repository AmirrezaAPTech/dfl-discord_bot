import { ButtonInteraction, Client } from "discord.js";
import { tempIdeaData } from "../modals/sendIdeaModal";
import { handleIdeaButtonClick } from "../../services/idea_management/sendIdea.service";
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

/**
 * Interface for IdeaData
 */
interface IdeaData {
  isSecret: boolean;
}

/**
 * Handles the user's choice between sending an idea secretly or publicly.
 * @param interaction - The button interaction for choosing idea type
 * @param client - The Discord client
 */
export const handleIdeaTypeChoice = async (
  interaction: ButtonInteraction,
  client: Client
) => {
  // Determine if the user chose to send the idea secretly
  const isSecret = interaction.customId === "choose_secret_idea";

  // Store the user's choice in tempIdeaData
  tempIdeaData.set(interaction.user.id, { isSecret });

  // Optionally, you can call a service function if needed
  const buttonSuccess = await handleIdeaButtonClick(
    client,
    interaction,
    isSecret
  );
  if (!buttonSuccess) {
    await interaction.reply({
      content: "دوباره تلاش کن!",
      ephemeral: true,
    });
    return;
  }

  // Create the idea submission modal
  const modal = new ModalBuilder()
    .setCustomId("modal_send_Idea")
    .setTitle("ایده جدید");

  const ideaInput = new TextInputBuilder()
    .setCustomId("idea_content")
    .setLabel("متن ایده")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(ideaInput)
  );

  // Present the modal to the user
  await interaction.showModal(modal);
};
