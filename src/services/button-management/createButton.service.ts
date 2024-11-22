import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, TextChannel } from 'discord.js';

/**
 * Creates and sends buttons in the specified channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to send the buttons in.
 */
export const createInteractionButtons = async (client: Client, channelId: string) => {
  const channel = await client.channels.fetch(channelId) as TextChannel;
  
  if (!channel) {
    console.error('Channel not found.');
    return;
  }

  // Create buttons
  const button = new ButtonBuilder()
    .setCustomId('button_click')
    .setLabel('Click Me!')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button); // Notice this generic type

  // Send message with buttons
  try {
    await channel.send({
      content: 'Here are your buttons!',
      components: [row.toJSON()], // Convert to JSON to match expected API type
    });
    console.log('Message with buttons sent successfully!');
  } catch (error) {
    console.error('Failed to send message with buttons:', error);
  }
};
