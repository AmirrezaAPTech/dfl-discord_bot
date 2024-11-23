import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const handleIdeaButton = async (interaction: ButtonInteraction) => {
  const modal = new ModalBuilder()
    .setCustomId("modal_send_Idea")
    .setTitle("ایده ناشناس");

  const ideaInput = new TextInputBuilder()
    .setCustomId("idea_content")
    .setLabel("متن ایده")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(ideaInput)
  );

  await interaction.showModal(modal);
};
