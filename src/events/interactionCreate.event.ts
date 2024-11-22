import { Client, Interaction } from 'discord.js';
import { handleSendMessageButton } from '../interactions/buttons/sendMessageButton';
import { handleScheduleMessageButton } from '../interactions/buttons/scheduleMessageButton';
import { handleSendMessageModal } from '../interactions/modals/sendMessageModal';
import { handleScheduleMessageModal } from '../interactions/modals/scheduleMessageModal';
import { handleSecretJournalingButton } from '../interactions/buttons/secretJournalingButton';
import { handleSecretJournalingModal } from '../interactions/modals/secretJournalingModal';

export const interactionCreate = async (client: Client, interaction: Interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'send_message') {
      await handleSendMessageButton(interaction);
    } else if (interaction.customId === 'schedule_message') {
      await handleScheduleMessageButton(interaction);
    }else if (interaction.customId === 'secret_journaling') {
      await handleSecretJournalingButton(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'modal_send_message') {
      await handleSendMessageModal(interaction);
    } else if (interaction.customId === 'modal_schedule_message') {
      await handleScheduleMessageModal(interaction);
    }else if (interaction.isModalSubmit() && interaction.customId === 'modal_secret_journaling') {
      await handleSecretJournalingModal(interaction, client);
    }
  }
};
