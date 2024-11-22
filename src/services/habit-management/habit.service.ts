import axios from 'axios';
import { Client, Message, TextChannel } from 'discord.js';
import { sendJournalingText } from './journaling.service';
import { logger } from '../../utils/logger';
import { HabitCahnnels, habitIds, HabitIds, PersianHabits, persianHabits } from '../../config/habitChannels';
import { sendTemporaryMessage } from '../temporeryMessage.service';

const pointsChannelId = '1308823001784914031';

export const handleHabitMessage = async (message: Message, habitName: string) => {
  if (!(habitName in habitIds)) {
    throw new Error('Invalid habit name detected.');
  }
  const persianHabitName = persianHabits[habitName as HabitIds]
  
  const habitId = habitIds[habitName as HabitIds];
  const pointsChannel = message.guild?.channels.cache.get(pointsChannelId);

  // Additional validation for journaling
  if (habitName === 'journaling') {
    if (message.content.length < 150) {
      sendTemporaryMessage(message.channel as TextChannel,`<@${message.author.id}> \n جورنالینگت باید حداقل ۱۵۰ حرف باشه ولی اینی که فرستادی فقط ${message.content.length} حرفه⛔️`, 10)
      return;
    }
  }

  // Increase user points
  const success = await increaseUserPoints(message, habitId, 1, habitName as HabitIds);
  if (!success) {
    return;
  }

  // Send a message to the points channel
  if (pointsChannel?.isTextBased()) {
    await pointsChannel.send(`<@${message.author.id}> :one: امتیاز برای ${persianHabitName} گرفت!`);
  } else {
    logger.warn(`Points channel (${pointsChannelId}) is not accessible or invalid.`);
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
        functionType: 'PLUS',
        numberOfPoints: points,
      }
    );
    const persianHabitName = persianHabits[habitName as HabitIds]
        // Check the response for success or specific error codes
    if (response.data.message && response.data.message === 'POINTS_AND_STREAK_UPDATED_SUCCESSFULLY') {
      if(habitName === "journaling") {
        await sendJournalingText(message.author.id, message.content);
      }

      logger.info(`Points increased: ${JSON.stringify(response.data)}`);
      return true;
    }else if(response.data.message && response.data.message === 'ACTION_NOT_ALLOWED_TIME_RANGE'){
      if(habitName === "earlybird") {
        sendTemporaryMessage(message.channel as TextChannel, `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۸ صبح میتونی ثبت کنی ⛔️`, 10)
      }else {
        sendTemporaryMessage(message.channel as TextChannel, `<@${message.author.id}> \n عادت ${persianHabitName} رو فقط از ساعت ۵ صبح تا ۱۲ شب میتونی ثبت کنی ⛔️`, 10)
      }

    }else if(response.data.message && response.data.message === 'ALREADY_EARNED_POINTS_TODAY'){
      sendTemporaryMessage(message.channel as TextChannel, `<@${message.author.id}> \n عادت ${persianHabitName} رو امروز قبلا انجام دادی 🌱`, 10)
    }else if(response.data.message && response.data.message === 'USER_NOT_FOUND'){
      sendTemporaryMessage(message.channel as TextChannel, `<@${message.author.id}> \n هنوز اکانتت رو verify نکردی برای همین امتیازی نمیگیری ! \n مراحل verify رو از چنل <#1292789085143826452> جلو برو بعد امتیازت رو ثبت کن .`, 10)
      message.author.send(`هنوز اکانتت رو verify نکردی برای همین امتیازی نمیگیری ! \n مراحل verify رو از چنل Welcome جلو برو بعد امتیازت رو ثبت کن .`)
    }
    else {
      sendTemporaryMessage(message.channel as TextChannel, `<@${message.author.id}> \n لطفا دوباره تلاش کن! `, 10)
      logger.info(`Failed to increase points for user ${message.author.tag} ${message.author.id} on habit ${habitId}: ${JSON.stringify(response.data)}`);
      return false
    }
    return false
  } catch (error: any) {
    logger.error(
      `Failed to increase points for user ${message.author.tag} ${message.author.id} on habit ${habitId}: ${error.response?.data || error.message}`
    );
    return false;
  }
};
