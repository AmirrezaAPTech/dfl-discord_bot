import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  GatewayIntentBits,
  MessageReaction,
  ModalSubmitInteraction,
  PartialMessageReaction,
  Partials,
  PartialUser,
  User,
} from "discord.js";
import dotenv from "dotenv";
import { messageCreate } from "./events/messageCreate.event";
import { handleGuildMemberAdd } from "./events/guildMemberAdd.event";
import { interactionCreate } from "./events/interactionCreate.event";
import { scheduleAnnouncement } from "./services/testAnnouncementSchedule.service";
import { onReactionAdd } from "./events/reactionAdd.event";
import { startScheduler } from "./services/announcement-management/scheduler.service";

dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("messageCreate", messageCreate);
client.on("guildMemberAdd", async (member) => {
  try {
    // Call the handleGuildMemberAdd function when a new member joins
    await handleGuildMemberAdd(member, client);
  } catch (err: any) {
    console.error(`Error handling guild member add: ${err.message || err}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  await interactionCreate(client, interaction);
});

client.on(
  "messageReactionAdd",
  async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    // If the reaction is partial, fetch the full reaction
    if (reaction.partial) {
      try {
        await reaction.fetch();
        // After fetch, assert the type to MessageReaction
        reaction = reaction as unknown as MessageReaction; // Type assertion
      } catch (error) {
        console.error("Error fetching partial message reaction:", error);
        return;
      }
    }
    // Now the reaction is guaranteed to be a fully resolved `MessageReaction`
    await onReactionAdd(reaction, user as User);
  }
);

client.once("ready", () => {
  console.log(`Bot is online and ready to go!`);
  startScheduler(client);
});

client.login(process.env.DISCORD_BOT_TOKEN);
