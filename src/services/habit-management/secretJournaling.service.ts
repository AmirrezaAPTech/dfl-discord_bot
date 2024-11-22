import { ModalSubmitInteraction, Client, TextChannel } from "discord.js";
import axios from "axios";
import { logger } from "../../utils/logger";

const pointsChannelId = "1308823001784914031";
const journalingChannelId = "1306619862323433563";
const journalingHabitId = "6717c1fb14e4bbed72b2f8e1";

export const handleSecretJournaling = async (
  client: Client,
  interaction: ModalSubmitInteraction
): Promise<boolean> => {
  const journalingContent =
    interaction.fields.getTextInputValue("journaling_content");

  if (journalingContent.length < 150) {
    await interaction.user.send(
      `متن جورنالینگت باید حداقل ۱۵۰ حرف باشه ولی اینی که فرستادی فقط ${journalingContent.length} حرفه⛔️`
    );
    return false;
  }

  try {
    const journalingChannel = client.channels.cache.get(
      journalingChannelId
    ) as TextChannel;

    if (!journalingChannel) {
      throw new Error("Journaling channel not found");
    }

    // API request to increase points
    const response = await axios.post(
      `https://doerforlife.net/api/manychat-discord-telegram/admin/habit-management/increase-or-decrease-user-point/${journalingHabitId}`,
      {
        dflIDOrDiscordID: interaction.user.id,
        functionType: "PLUS",
        numberOfPoints: 1,
      }
    );

    if (response.data.message === "POINTS_AND_STREAK_UPDATED_SUCCESSFULLY") {
      // Notify user of success
      const pointsChannel = client.channels.cache.get(
        pointsChannelId
      ) as TextChannel;

      if (pointsChannel?.isTextBased()) {
        await pointsChannel.send(
          `:star: یک کاربر ناشناس به خاطر جورنالینگ 1 امتیاز گرفت!`
        );
      }

      // Send the journaling content anonymously
      await journalingChannel.send(
        `یک کاربر ناشناس این جورنالینگ را ثبت کرد: \n${journalingContent}`
      );

      return true;
    } else if (
      response.data.message &&
      response.data.message === "ACTION_NOT_ALLOWED_TIME_RANGE"
    ) {
      interaction.user.send(
        `عادت جورنالینگ رو فقط از ساعت ۵ صبح تا ۱۲ شب میتونی ثبت کنی ⛔️`
      );
    } else if (
      response.data.message &&
      response.data.message === "ALREADY_EARNED_POINTS_TODAY"
    ) {
      interaction.user.send(`عادت جورنالینگ رو امروز قبلا انجام دادی 🌱`);
    } else if (
      response.data.message &&
      response.data.message === "USER_NOT_FOUND"
    ) {
      interaction.user.send(
        `هنوز اکانتت رو verify نکردی برای همین امتیازی نمیگیری ! \n مراحل verify رو از چنل #Welcome جلو برو بعد امتیازت رو ثبت کن .`
      );
    } else {
      // Handle specific API errors
      const errorMessage = response.data.message || "خطایی رخ داده است";
      throw new Error(errorMessage);
    }
    return false;
  } catch (error: any) {
    logger.error(`Failed to handle anonymous journaling: ${error.message}`);
    await interaction.user.send(`خطایی در ثبت جورنالینگ ناشناس رخ داد`);
    return false;
  }
};
