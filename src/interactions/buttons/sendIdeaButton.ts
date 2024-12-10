import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

/**
 * Handles the "send_idea" button interaction by prompting the user to choose the idea type.
 * @param interaction - The button interaction
 */
export const handleIdeaButton = async (interaction: ButtonInteraction) => {
  const typeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("choose_secret_idea")
      .setLabel("ناشناس")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("choose_public_idea")
      .setLabel("عمومی")
      .setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    content:
      "میخوای ایدت رو به صورت عمومی یا ناشناس تو کلاب بفرستی ؟ بزن روی دکمش",
    components: [typeRow],
    ephemeral: true, // Only the user can see this message
  });
};
