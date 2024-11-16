import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { messageCreate } from './events/messageCreate.event';

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

client.once('ready', () => {
  console.log(`Bot is online and ready to go!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
