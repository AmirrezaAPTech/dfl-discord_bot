import { GuildMember, Client } from 'discord.js';
import { syncDiscordToManyChat } from '../api/sync-discord-to-telegram';
import { logger } from '../utils/logger';

const channelId = '1295004510569103481'; // Channel for logging users' verification

/**
 * Sends a verification message to the user in a private message (DM).
 * Handles the entire verification process, including syncing IDs.
 * 
 * @param {Client} client - The Discord client object.
 * @param {GuildMember} member - The Discord member object.
 */
export const sendVerificationMessage = async (client: Client, member: GuildMember) => {
  const logChannel = await client.channels.fetch(channelId);

  try {
    if (!member || !member.user) {
      throw new Error('Invalid member object or user is undefined.');
    }

    const verificationMessage = `سلام  ${member.user.username} 👋🏽
لطفا DFL ID خودت رو برام بفرست.
( اگه  DFL ID  خودت رو نداری، به کیدو تو تلگرام کلمه MyID رو بفرست که بهت بگه)`;
    await member.send(verificationMessage);

    if (logChannel && logChannel.type === 0) {
      await logChannel.send(`Verification message sent to **${member.user.tag}**.`);
    }

    const filter = (response: any) => response.author.id === member.id;
    const dmChannel = await member.createDM();

    const collected = await dmChannel.awaitMessages({
      filter,
      max: 1,
      time: 60000, // 1 minute to respond
      errors: ['time'],
    });

    const dflID = collected.first()?.content;
    if (!dflID) {
      throw new Error('No DFLID provided.');
    }
    logger.info(`Received DFLID from ${member.user.tag}: ${dflID}`);

    // Sync the Discord ID and DFLID
    await syncDiscordToTelegram(member.user.id, dflID, member.user.tag);

    // If successful, send a success message
    await member.send('اکانتت با موفقیت تایید شد ✅');
    if (logChannel && logChannel.type === 0) {
      await logChannel.send(`**${member.user.tag}** has been successfully verified.`);
    }

  } catch (err: any) {
    logger.error(`Failed to verify ${member?.user?.tag || 'unknown member'}: ${err.message || err}`);

    if (err.message === 'USER_NOT_FOUND') {
      await member.send(` عملیات انجام نشد❌
به نظر میرسه DFL ID رو اشتباه وارد کردی. یه بار دیگه چک کن و دوباره تلاش کن.`);
      if (logChannel && logChannel.type === 0) {
        await logChannel.send(`Verification failed for **${member.user.tag}**: User not found.`);
      }
    } else if (err.message === 'USER_ALREADY_SYNCED') {
      await member.send('اکانتت قبلا تایید شده✅');
      if (logChannel && logChannel.type === 0) {
        await logChannel.send(`**${member.user.tag}** tried to verify but is already synced.`);
      }
    } else {
      await member.send(`عملیات انجام نشد❌
بعدا دوباره تلاش کن یا به پشتیبانی تلگرام  پیام بده.`);
    }
  }
};

/**
 * Syncs the Discord ID and DFLID with the external API via ManyChat.
 * 
 * @param {string} discordID - The user's Discord ID.
 * @param {string} dflID - The user's DFLID.
 * @param {string} discordUsername - The user's Discord username.
 */
export const syncDiscordToTelegram = async (discordID: string, dflID: string, discordUsername: string) => {
  try {
    const result = await syncDiscordToManyChat(discordID, dflID);
    logger.info(`Successfully synced Discord ID ${discordID} with DFLID ${dflID}.`);
    return result;
  } catch (err: any) {
    logger.error(`Error syncing Discord and DFLID for ${discordUsername}: ${err.message}`);
    throw err;
  }
};
