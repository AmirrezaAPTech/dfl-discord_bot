import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
  } from 'discord.js';
  
  export const handleSecretJournalingButton = async (interaction: ButtonInteraction) => {
    const modal = new ModalBuilder()
      .setCustomId('modal_secret_journaling')
      .setTitle('جورنالینگ ناشناس');
  
    const journalingInput = new TextInputBuilder()
      .setCustomId('journaling_content')
      .setLabel('متن جورنالینگ')
      .setStyle(TextInputStyle.Paragraph);
  
    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(journalingInput),
    );
  
    await interaction.showModal(modal);
  };
  