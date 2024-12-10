import {
  ModalSubmitInteraction,
  Client,
  TextChannel,
  ButtonInteraction,
} from "discord.js";
import { logger } from "../../utils/logger";

const IdeaChannelId = "1314621437830627389";

/**
 * Handles the idea submission from a button interaction.
 * @param client - The Discord client
 * @param interaction - The button interaction
 * @param isSecret - Whether the idea is secret
 * @returns A boolean indicating success or failure
 */
export const handleIdeaButtonClick = async (
  client: Client,
  interaction: ButtonInteraction,
  isSecret: boolean
): Promise<boolean> => {
  // Placeholder for any pre-processing logic if needed
  // Currently, simply returns true
  return true;
};

/**
 * Handles the idea submission from a modal interaction.
 * @param client - The Discord client
 * @param interaction - The modal submit interaction
 * @param ideaContent - The content of the idea
 * @param isSecret - Whether the idea is secret
 * @returns A boolean indicating success or failure
 */
export const handleIdeaModalSubmit = async (
  client: Client,
  interaction: ModalSubmitInteraction,
  ideaContent: string,
  isSecret: boolean
): Promise<boolean> => {
  if (ideaContent.length < 10) {
    await interaction.reply({
      content: `متن ایده باید حداقل ۱۰ حرف باشه ولی اینی که فرستادی فقط ${ideaContent.length} حرفه⛔️`,
      ephemeral: true,
    });
    return false;
  }

  try {
    const ideaChannel = client.channels.cache.get(IdeaChannelId) as TextChannel;

    if (!ideaChannel) {
      throw new Error("idea channel not found");
    }
    // Send the idea content anonymously or publicly
    const ideaMessage = await ideaChannel.send(
      `${
        isSecret ? "یه ناشناس" : `<@${interaction.user.id}>`
      } یه ایده داده ! \n \n ${ideaContent} \n \n اگه موافقی 👍🏽 و اگه مخالفی 👎🏽 بده.`
    );

    await ideaMessage.react("👍🏽");
    await ideaMessage.react("👎🏽");

    return true;
  } catch (error: any) {
    logger.error(`Failed to handle idea modal submission: ${error.message}`);
    await interaction.reply({
      content: "خطایی در ثبت ایده رخ داد. لطفاً دوباره تلاش کنید.",
      ephemeral: true,
    });
    return false;
  }
};
