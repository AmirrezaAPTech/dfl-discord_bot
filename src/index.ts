import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { messageCreate } from './events/messageCreate.event';
import { handleGuildMemberAdd } from './events/guildMemberAdd.event';

dotenv.config();

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    'partials': [Partials.Channel]
});


client.on('messageCreate', messageCreate);
client.on('guildMemberAdd', async (member) => {
  try {
    // Call the handleGuildMemberAdd function when a new member joins
    await handleGuildMemberAdd(member, client);
  } catch (err: any) {
    console.error(`Error handling guild member add: ${err.message || err}`);
  }
});

client.once('ready', () => {
  console.log(`Bot is online and ready to go!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
