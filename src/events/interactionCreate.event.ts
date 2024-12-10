import { Client, Interaction } from "discord.js";
import { handleSendMessageButton } from "../interactions/buttons/sendMessageButton";
import { handleScheduleMessageButton } from "../interactions/buttons/scheduleMessageButton";
import { handleSecretJournalingButton } from "../interactions/buttons/secretJournalingButton";
import { handleIdeaButton } from "../interactions/buttons/sendIdeaButton";
import { handleIdeaTypeChoice } from "../interactions/buttons/handleIdeaTypeChoice"; // New import
import { handleSendMessageModal } from "../interactions/modals/sendMessageModal";
import { handleScheduleMessageModal } from "../interactions/modals/scheduleMessageModal";
import { handleSecretJournalingModal } from "../interactions/modals/secretJournalingModal";
import { handleIdeaModal } from "../interactions/modals/sendIdeaModal";

export const interactionCreate = async (
  client: Client,
  interaction: Interaction
) => {
  try {
    // Handle Button Interactions
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "send_message":
          await handleSendMessageButton(interaction);
          break;
        case "schedule_message":
          await handleScheduleMessageButton(interaction);
          break;
        case "secret_journaling":
          await handleSecretJournalingButton(interaction);
          break;
        case "send_idea":
          await handleIdeaButton(interaction);
          break;
        case "choose_secret_idea":
        case "choose_public_idea":
          await handleIdeaTypeChoice(interaction, client);
          break;
        // Remove or repurpose the following if they're no longer needed
        // case "secret_true":
        // case "secret_false":
        //   await handleSecretChoice(interaction, client);
        //   break;
        default:
          console.warn(`Unhandled button interaction: ${interaction.customId}`);
      }
    }

    // Handle Modal Submissions
    if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case "modal_send_message":
          await handleSendMessageModal(interaction);
          break;
        case "modal_schedule_message":
          await handleScheduleMessageModal(interaction, client);
          break;
        case "modal_secret_journaling":
          await handleSecretJournalingModal(interaction, client);
          break;
        case "modal_send_Idea":
          await handleIdeaModal(interaction, client);
          break;
        default:
          console.warn(`Unhandled modal interaction: ${interaction.customId}`);
      }
    }
  } catch (error) {
    console.error(
      `Error handling interaction (ID: ${interaction.id}, Type: ${interaction.type}): `,
      error
    );

    if (interaction.isRepliable()) {
      await interaction.reply({
        content:
          "An unexpected error occurred while processing your interaction.",
        ephemeral: true,
      });
    }
  }
};
