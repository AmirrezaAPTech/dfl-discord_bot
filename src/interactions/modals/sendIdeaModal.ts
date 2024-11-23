import {
  ModalSubmitInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ButtonInteraction,
} from "discord.js";
import { handleIdea } from "../../services/idea_management/sendIdea.service";
import { logger } from "../../utils/logger";

const tempIdeaData = new Map<string, string>();

export const handleIdeaModal = async (
  interaction: ModalSubmitInteraction,
  client: Client
) => {
  if (interaction.customId === "modal_send_Idea") {
    const content = interaction.fields.getTextInputValue("idea_content");
    tempIdeaData.set(interaction.user.id, content);

    const secretRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("secret_true")
        .setLabel("ناشناس")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("secret_false")
        .setLabel("عمومی")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      content: "ایده شما ثبت شد. آیا می‌خواهید ناشناس باشد یا عمومی؟",
      components: [secretRow],
      ephemeral: true,
    });
  }
};

export const handleSecretChoice = async (
  interaction: ButtonInteraction,
  client: Client
) => {
  const ideaContent = tempIdeaData.get(interaction.user.id);
  if (!ideaContent) {
    await interaction.reply({
      content: "خطایی در بازیابی محتوای ایده رخ داد.",
      ephemeral: true,
    });
    return;
  }

  const isSecret = interaction.customId === "secret_true";

  try {
    // Acknowledge interaction immediately
    await interaction.deferUpdate();

    const success = await handleIdea(
      client,
      interaction,
      ideaContent,
      isSecret
    );

    if (success) {
      await interaction.followUp({
        content: `ایده شما به صورت ${isSecret ? "ناشناس" : "عمومی"} ثبت شد.`,
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "خطایی در ثبت ایده رخ داد. لطفاً دوباره تلاش کنید.",
        ephemeral: true,
      });
    }
  } catch (error: any) {
    logger.error(`Error in handleSecretChoice: ${error.message}`);
    await interaction.followUp({
      content: "خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.",
      ephemeral: true,
    });
  }

  tempIdeaData.delete(interaction.user.id);
};
