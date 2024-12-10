// src/interfaces/ScheduledMessage.ts

export interface ScheduledMessage {
  id: string;
  message: string;
  scheduledTime: string; // ISO String in UTC
  channelId: string;
}
