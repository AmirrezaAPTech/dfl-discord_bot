import { Message } from "discord.js";

import moment from "moment-timezone";

export function parseTime(time: string): Date {
  const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));

  // Use moment to create a date object in Tehran timezone (Asia/Tehran)
  const now = moment().tz("Asia/Tehran");
  const taskTime = now
    .clone()
    .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  console.log(
    `Parsed task time in Tehran: ${taskTime.format("YYYY-MM-DD HH:mm:ss")}`
  );

  return taskTime.toDate(); // Convert to Date object
}

// Create a thread from a task message
export async function createTodoThread(
  message: Message,
  taskDescription: string
) {
  return message.startThread({
    name: `Task: ${taskDescription}`,
    autoArchiveDuration: 60,
  });
}

export function calculateIranTimeDelay(taskTime: Date): number {
  const now = moment().tz("Asia/Tehran");
  const tehranTaskTime = moment(taskTime).tz("Asia/Tehran");

  // Calculate the delay in milliseconds
  const delay = tehranTaskTime.diff(now); // Difference in ms

  return delay > 0 ? delay : 0; // Ensure the delay is non-negative
}
