// src/services/announcement-management/scheduleMessage.service.ts

import { promises as fs } from "fs";
import path from "path";
import { ScheduledMessage } from "../../interface/ScheduledMessage";

const SCHEDULED_MESSAGES_PATH = path.join(
  __dirname,
  "../../data/scheduledMessages.json"
);

// Save a new scheduled message
export const handleScheduleMessage = async (
  scheduledMessage: ScheduledMessage
) => {
  try {
    const data = await loadScheduledMessages();
    data.push(scheduledMessage);
    await saveScheduledMessages(data);
    console.log(
      `Scheduled message added: ID=${scheduledMessage.id}, Time=${scheduledMessage.scheduledTime}`
    );
  } catch (error) {
    console.error("Error saving scheduled message:", error);
    throw error;
  }
};

// Load all scheduled messages
export const loadScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  try {
    const data = await fs.readFile(SCHEDULED_MESSAGES_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    console.error("Error loading scheduled messages:", error);
    throw error;
  }
};

// Save all scheduled messages
export const saveScheduledMessages = async (messages: ScheduledMessage[]) => {
  try {
    await fs.writeFile(
      SCHEDULED_MESSAGES_PATH,
      JSON.stringify(messages, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving scheduled messages:", error);
    throw error;
  }
};

// Remove a scheduled message by ID
export const removeScheduledMessage = async (id: string) => {
  try {
    const data = await loadScheduledMessages();
    const updatedData = data.filter((msg) => msg.id !== id);
    await saveScheduledMessages(updatedData);
    console.log(`Scheduled message removed: ID=${id}`);
  } catch (error) {
    console.error("Error removing scheduled message:", error);
    throw error;
  }
};
