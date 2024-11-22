import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
  } from 'discord.js';
  
  export const handleSendMessageButton = async (interaction: ButtonInteraction) => {
    try {
      const modal = new ModalBuilder()
        .setCustomId('modal_send_message')
        .setTitle('Send a Message');
  
      const channelInput = new TextInputBuilder()
        .setCustomId('channel_id')
        .setLabel('Channel ID')
        .setStyle(TextInputStyle.Short);
  
      const messageInput = new TextInputBuilder()
        .setCustomId('message_content')
        .setLabel('Message Content')
        .setStyle(TextInputStyle.Paragraph);
  
      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(channelInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
      );
  
      await interaction.showModal(modal);
    } catch (error) {
      console.error('Error handling button interaction:', error);
      await interaction.reply({
        content: 'An error occurred while handling this interaction.',
        ephemeral: true,
      });
    }
  };
  