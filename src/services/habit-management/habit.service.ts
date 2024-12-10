import axios from "axios";
import { Client, Message, NewsChannel, TextChannel } from "discord.js";
import { sendJournalingText } from "./journaling.service";
import { logger } from "../../utils/logger";
import {
  HabitCahnnels,
  habitIds,
  HabitIds,
  PersianHabits,
  persianHabits,
} from "../../config/habitChannels";
import { sendTemporaryMessage } from "../temporeryMessage.service";

const pointsChannelId = "1293022156799737920";

export const handleHabitMessage = async (
  message: Message,
  habitName: string
) => {
  if (!(habitName in habitIds)) {
    throw new Error("Invalid habit name detected.");
  }
  const persianHabitName = persianHabits[habitName as HabitIds];

  const habitId = habitIds[habitName as HabitIds];
  const pointsChannel = message.guild?.channels.cache.get(pointsChannelId);

  // Additional validation for journaling
  if (habitName === "journaling") {
    if (message.content.length < 150) {
      sendTemporaryMessage(
        message.channel as TextChannel,
        `<@${message.author.id}> \n جورنالینگت باید حداقل ۱۵۰ حرف باشه ولی اینی که فرستادی فقط ${message.content.length} حرفه⛔️`,
        10
      );
      return;
    }
  }

  // Increase user points
  const success = await increaseUserPoints(
    message,
    habitId,
    1,
    habitName as HabitIds
  );
  if (!success) {
    return;
  }

  // Send a message to the points channel
  if (pointsChannel && pointsChannel instanceof NewsChannel) {
    const streakNumber = await getUserInfo(message.author.id, habitId);
    await pointsChannel.send(
      `یک امتیاز برای ${persianHabitName} به <@${message.author.id}> داده شد! \n استریک: ${streakNumber} 🔥`
    );
  } else {
    logger.warn(
      `Points channel (${pointsChannelId}) is not accessible or invalid.`
    );
  }
};

const increaseUserPoints = async (
  message: Message,
  habitId: string,
  points: number,
  habitName: HabitIds
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `https://doerforlife.net/api/manychat-discord-telegram/admin/habit-management/increase-or-decrease-user-point/${habitId}`,
      {
        dflIDOrDiscordID: message.author.id,
        functionType: "PLUS",
        numberOfPoints: points,
      }
    );

    const persianHabitName = persianHabits[habitName as HabitIds];
    // Check the response for success or specific error codes
    if (response.data && response.data.success === true) {
      if (habitName === "journaling") {
        await sendJournalingText(message.author.id, message.content);
      }

      logger.info(`Points increased: ${JSON.stringify(response.data)}`);
      return true;
    } else if (
      response.data.message &&
      response.data.message === "ACTION_NOT_ALLOWED_TIME_RANGE"
    ) {
      if (habitName === "earlybird") {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۸ صبح میتونی ثبت کنی ⛔️`,
          10
        );
      } else {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۱۲ شب میتونی ثبت کنی ⛔️`,
          10
        );
      }
    } else {
      sendTemporaryMessage(
        message.channel as TextChannel,
        `<@${message.author.id}> \n لطفا دوباره تلاش کن! `,
        10
      );
      logger.info(
        `Failed to increase points for user ${message.author.tag} ${
          message.author.id
        } on habit ${habitId}: ${JSON.stringify(response.data)}`
      );
      return false;
    }
    return false;
  } catch (error: any) {
    if (error.response) {
      const { data } = error.response;
      const persianHabitName = persianHabits[habitName as HabitIds];

      if (data.message === "ONCE_A_DAY") {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n عادت ${persianHabitName} رو امروز قبلا انجام دادی 🌱`,
          10
        );
        return false;
      } else if (
        data.message ===
        "This habit can only be done between 5 AM and 8 AM Iran time"
      ) {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۸ صبح میتونی ثبت کنی ⛔️`,
          10
        );
      } else if (data.message === "USER_NOT_FOUND") {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n هنوز اکانتت رو verify نکردی برای همین امتیازی نمیگیری ! \n مراحل verify رو از چنل <#1292789085143826452> جلو برو بعد امتیازت رو ثبت کن .`,
          10
        );
      } else if (
        data.message ===
        "This habit can only be done between 5 and 24 Iran time"
      ) {
        sendTemporaryMessage(
          message.channel as TextChannel,
          `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۱۲ شب میتونی ثبت کنی ⛔️`,
          10
        );
      }

      logger.warn(
        `Failed to increase points due to server response: ${JSON.stringify(
          data
        )}`
      );
    } else {
      // Handle network or other unexpected errors
      logger.error(`Unexpected error: ${error.message}`);
    }
    return false;
  }
};

interface HabitStreak {
  habitID: string;
  currentStreak: number;
  bestStreak: number;
  lastUpdated: string;
}

const getUserInfo = async (dflIDOrDiscordID: string, habitId: string) => {
  try {
    const response = await axios.post(
      `https://doerforlife.net/api/manychat-discord-telegram/admin/user-management/get-user-info`,
      {
        dflIDOrDiscordID,
      }
    );
    const habitStreakArray = response.data.user.habitStreak;
    const habitStreak = habitStreakArray.find(
      (habit: HabitStreak) => habit.habitID === habitId
    );
    return habitStreak.currentStreak;
  } catch (error: any) {
    // Handle network or other unexpected errors
    logger.error(`Unexpected error for getting users info : ${error.message}`);
  }
};
