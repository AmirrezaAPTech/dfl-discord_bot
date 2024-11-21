import axios from "axios"
import { logger } from "../../utils/logger";

export const sendMessage = async (channelID: string, messageContent: string) => {
    try {
        const data = {
            channelID,
            messageContent
        }
        const response = await axios.post(`${process.env.BASE_URL}/api/manychat-discord-telegram/admin/discord-management/send-discord-message`, data)
        logger.info(`Send Message Api Response: ${JSON.stringify(response.data)}`);
    }catch (error: any) {
        logger.error(
            `Failed to Send Message: ${error.response?.data || error.message}`
          );
    }
}