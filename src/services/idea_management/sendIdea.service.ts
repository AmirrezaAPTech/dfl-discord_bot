import {
  ModalSubmitInteraction,
  Client,
  TextChannel,
  ButtonInteraction,
} from "discord.js";
import axios from "axios";
import { logger } from "../../utils/logger";

const pointsChannelId = "1308823001784914031";
const IdeaChannelId = "1294691320908218478";
const ideaHabitId = "6717c1fb14e4bbed72b2f8e1";

export const handleIdea = async (
  client: Client,
  interaction: ButtonInteraction,
  ideaContent: string,
  isSecret: boolean
): Promise<boolean> => {
  if (ideaContent.length < 10) {
    await interaction.user.send(
      `متن ایده باید حداقل ۱۰ حرف باشه ولی اینی که فرستادی فقط ${ideaContent.length} حرفه⛔️`
    );
    return false;
  }

  try {
    const ideaChannel = client.channels.cache.get(IdeaChannelId) as TextChannel;

    if (!ideaChannel) {
      throw new Error("idea channel not found");
    }
    // Send the idea content anonymously
    await ideaChannel.send(
      `${
        isSecret ? "یک کاربر ناشناس" : `<@${interaction.user.id}>`
      } این ایده را ثبت کرد: \n اگه با این ایده موافقی لایک اگه مخالفی دیس لایک کن\n ${ideaContent}`
    );
    return true;
  } catch (error: any) {
    logger.error(`Failed to handle anonymous idea: ${error.message}`);
    await interaction.user.send(`خطایی در ثبت جورنالینگ ناشناس رخ داد`);
    return false;
  }
};
