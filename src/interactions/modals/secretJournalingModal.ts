import { Client, ModalSubmitInteraction } from 'discord.js';
import { handleSecretJournaling } from '../../services/habit-management/secretJournaling.service';

export const handleSecretJournalingModal = async (interaction: ModalSubmitInteraction, client: Client) => {
    try {
        const successful = await handleSecretJournaling(client, interaction); // Pass interaction

        // Only reply if successful  
        if (successful) {
            await interaction.reply({
                content: 'جورنالبنگ ناشناس شما با موفقیت ثبت شد',
                ephemeral: true,
            });
            return; // Return early to avoid multiple replies  
        } 

        // If not successful, reply with an error message  
        await interaction.reply({
            content: 'دوباره تلاش کن!',
            ephemeral: true,
        });
        return; // Return early to avoid multiple replies  
    } catch (error) {
        console.error('Error handling secret journaling modal:', error);
        // Ensure that you don't reply multiple times  
        if (!interaction.replied) {
            await interaction.reply({
                content: 'An unexpected error occurred. Please try again later.',
                ephemeral: true,
            });
        }
    }
};