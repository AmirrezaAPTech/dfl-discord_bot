import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js';

export const handleSendMessageCommand = async (interaction: CommandInteraction) => {
  if (interaction.commandName === 'sendMessage') {
    // Explicitly type ActionRowBuilder with ButtonBuilder
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('openModal')
        .setLabel('Open Modal')
        .setStyle(ButtonStyle.Primary)
    );

    // Correcting the reply with components
    await interaction.reply({
      content: 'Click the button to open the modal and send a message.',
      components: [row],  // Use the correctly typed row
    });
  }
};
