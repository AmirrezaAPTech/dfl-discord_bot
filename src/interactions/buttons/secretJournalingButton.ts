import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { hasActiveSession, startSession } from "../sessionManager"; // Import session manager

export const handleSecretJournalingButton = async (
  interaction: ButtonInteraction
) => {
  // Ensure the user doesn't already have an active session
  if (hasActiveSession(interaction.user.id)) {
    await interaction.reply({
      content:
        "شما هنوز یک دکمه جورنالینگ در بالا دارید که ازش استفاده نکردید. لطفا از اون استفاده کنید",
      ephemeral: true,
    });
    return;
  }

  // Start a session for the user
  startSession(interaction.user.id);

  const modal = new ModalBuilder()
    .setCustomId("modal_secret_journaling")
    .setTitle("جورنالینگ ناشناس");

  const journalingInput = new TextInputBuilder()
    .setCustomId("journaling_content")
    .setLabel("متن جورنالینگ")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(journalingInput)
  );

  await interaction.showModal(modal);
};
