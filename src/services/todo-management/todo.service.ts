import { TextChannel, ThreadChannel } from "discord.js";
import * as fs from "fs-extra";
import * as path from "path";
import { client } from "../..";
import { parseTime } from "../../utils/todo"; // Import the time parsing function
import moment from "moment-timezone"; // Import moment for time calculations
import { sendTemporaryMessage } from "../temporeryMessage.service";

const TASK_STORE_PATH = path.resolve(
  __dirname,
  "../../..",
  "src",
  "data",
  "todoStore.json"
);

// Read the task store (loads all tasks)
async function readTaskStore() {
  try {
    const data = await fs.readFile(TASK_STORE_PATH, "utf-8");

    // If the file is empty or invalid, return an empty object
    if (!data.trim()) {
      console.warn(
        "The task store file is empty or invalid, returning empty object."
      );
      return {};
    }

    // Parse the JSON data
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // If the file doesn't exist, log and return an empty object
      console.log("Task store file not found, creating a new one.");
      return {};
    } else {
      // Log any other errors
      console.error("Error reading task store:", error);
      throw error; // Re-throw the error after logging
    }
  }
}

// Write the task store (saves all tasks)
async function writeTaskStore(tasks: Record<string, any>) {
  try {
    // Ensure the directory exists
    await fs.ensureDir(path.dirname(TASK_STORE_PATH));

    // Write the task data to the file
    await fs.writeJson(TASK_STORE_PATH, tasks, { spaces: 2 });
  } catch (error) {
    console.error("Error writing task store:", error);
  }
}

// Store task data
export async function storeTaskData(
  taskId: string,
  creator: string,
  time: string,
  threadId: string,
  checkers: string[] = []
) {
  const tasks = await readTaskStore();

  tasks[taskId] = {
    taskId,
    creator,
    time,
    threadId,
    checkers,
  };

  await writeTaskStore(tasks);
}

// Get task data by ID
export async function getTaskData(taskId: string) {
  const tasks = await readTaskStore();
  return tasks[taskId];
}

// Verify task checkers (the logic to verify if the checkers have posted in the thread)
export async function verifyCheckers(taskId: string) {
  const taskData = await getTaskData(taskId); // Retrieve task data

  if (!taskData) {
    console.log(`No task found for taskId: ${taskId}`);
    return;
  }

  const { checkers, threadId } = taskData;
  const channel = (await client.channels.fetch(threadId)) as ThreadChannel;

  if (!channel) {
    console.log(`Thread not found for taskId: ${taskId}`);
    return;
  }

  // Fetch all messages in the thread
  const messages = await channel.messages.fetch({ limit: 100 });

  let pointsAwarded = true;

  // Check if both checkers posted a message in the thread
  for (const checker of checkers) {
    const hasPosted = messages.some((msg) => msg.author.id === checker);

    // Send a message to the thread about the checker's status
    if (!hasPosted) {
      pointsAwarded = false;
      await channel.send(
        `<@${checker}> شما ۲ امتیاز منفی بابت چک نکردن تودو گرفتید`
      );
    } else {
      // If the checker posted, award them 1 point
      await channel.send(
        `<@${checker}> شما یه پوینت بابت چک کردن تودو گرفتید!`
      );
    }
  }

  // If both checkers posted, award +1 point
  if (pointsAwarded) {
    for (const checker of checkers) {
      // Optionally, here you can update points if you have a points system (e.g., using `updatePoints`).
      // await updatePoints(checker, 1); // Award points for checking
    }
  }

  // Optionally delete the task data after verification
  await deleteTaskData(taskId);
}
// Helper function to delete task data from the store
async function deleteTaskData(taskId: string) {
  const tasks = await readTaskStore();
  delete tasks[taskId]; // Remove the task from the store
  await writeTaskStore(tasks); // Save updated data to file
}

// This function will handle the task creation with validation
export async function createTask(
  message: any,
  taskTime: string,
  taskDescription: string
) {
  const now = moment().tz("Asia/Tehran").toDate();
  console.log(`Current time in Tehran: ${now}`);

  // Parse the task time and convert it to Tehran time
  const taskTimeParsed = parseTime(taskTime); // This returns a Date in Tehran time

  console.log(
    `Task time in Tehran: ${moment(taskTimeParsed).format(
      "YYYY-MM-DD HH:mm:ss"
    )}`
  );

  if (taskTimeParsed.getTime() <= now.getTime()) {
    // await message.reply(
    //   "You can only schedule tasks in the future, not in the past."
    // );
    sendTemporaryMessage(
      message.channel as TextChannel,
      `<@${message.author.id}> \n شما فقط برای ۲۴ ساعت آینده میتونید تودو بزارید!`,
      10
    );
    return;
  }

  const maxTimeAhead = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  if (taskTimeParsed.getTime() > maxTimeAhead) {
    await message.reply(
      "You can only schedule tasks within the next 24 hours."
    );
    return;
  }

  const taskId = message.id;
  const taskData = {
    taskId,
    creator: message.author.id,
    time: taskTimeParsed.toISOString(), // Store time in ISO format for consistency
    threadId: "", // Thread ID will be empty initially
    checkers: [], // Empty checkers array
  };

  await storeTaskData(
    taskData.taskId,
    taskData.creator,
    taskData.time,
    taskData.threadId,
    taskData.checkers
  );

  const formattedTaskTime = moment(taskTimeParsed).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  // Create the thread and send initial message
  const thread = await message.startThread({
    name: `Task: ${taskDescription}`,
    autoArchiveDuration: 60,
  });

  await thread.send(
    `Task created by <@${message.author.id}>: "${taskDescription}" at ${formattedTaskTime}`
  );

  console.log("Task created:", taskData);

  // After creating the thread, update task with threadId
  await storeTaskData(
    taskData.taskId,
    taskData.creator,
    taskData.time,
    thread.id, // Store the threadId in task data
    taskData.checkers
  );
}
