import axios from "axios";
import { logger } from "../../utils/logger";

export const sendMessage = async (channelID: string, messageContent: string): Promise<boolean> => {
  try {
    const data = {
      channelID,
      messageContent,
    };
    const response = await axios.post(
      `${process.env.BASE_URL}/api/manychat-discord-telegram/admin/discord-management/send-discord-message`,
      data
    );

    logger.info(`Send Message API Response: ${JSON.stringify(response.data)}`);
    
    // Check if the response is successful
    if (response.data.message === "success") {
        return true;
      } else {
        return false;
      }
  } catch (error: any) {
    logger.error(`Failed to Send Message: ${error.response?.data || error.message}`);
    return false;
  }
};

export const saveScheduledMessage = async (
  channelID: string,
  messageContent: string,
  scheduledDateTime: Date
): Promise<boolean> => {
  try {
    const data = {
      channelID,
      messageContent,
      scheduledDateTime,
    };
    const response = await axios.post(
      `${process.env.BASE_URL}/api/manychat-discord-telegram/admin/discord-management/schedule`,
      data
    );

    logger.info(`Save Scheduled Message API Response: ${JSON.stringify(response.data)}`);
    
    // Check if the response is successful
    if (response.data.message === "success") {
        return true;
      } else {
        return false;
      }
  } catch (error: any) {
    logger.error(`Failed to Save Scheduled Message: ${error}`);
    return false;
  }
};
