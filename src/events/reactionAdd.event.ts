import { MessageReaction, User, ThreadChannel } from "discord.js";
import {
  getTaskData,
  storeTaskData,
  verifyCheckers,
} from "../services/todo-management/todo.service";
import { client } from "..";
import { calculateIranTimeDelay } from "../utils/todo";

export async function onReactionAdd(reaction: MessageReaction, user: User) {
  if (reaction.message.channel.id !== process.env.TODO_CHANNEL_ID) {
    return;
  }

  const taskId = reaction.message.id;
  const taskData = await getTaskData(taskId);

  if (!taskData) {
    console.log(`Task with ID ${taskId} not found.`);
    return;
  }

  console.log("Received emoji:", reaction.emoji.name);

  // Check if the user has reacted with the expected emojis
  if (
    (reaction.emoji.name === "🤚" || reaction.emoji.name === "✋") &&
    !taskData.checkers.includes(user.id)
  ) {
    console.log(`${user.tag} is being added to the checkers list`);

    // Add user to checkers list and update task data
    taskData.checkers.push(user.id);

    // Store updated task data
    await storeTaskData(
      taskId,
      taskData.creator,
      taskData.time,
      taskData.threadId,
      taskData.checkers
    );

    // Handle thread creation
    let thread: ThreadChannel | undefined = taskData.threadId
      ? ((await client.channels.fetch(taskData.threadId)) as ThreadChannel)
      : undefined;

    if (thread) {
      await thread.send(`<@${user.id}> قراره چکت کنه`);
    } else {
      const message = await reaction.message.fetch();
      thread = await message.startThread({
        name: `Task Check - ${taskId}`,
        autoArchiveDuration: 60,
      });

      await thread.send(`<@${user.id}> قراره چکت کنه`);

      // After creating the thread, store the threadId in task data
      taskData.threadId = thread.id;
      await storeTaskData(
        taskId,
        taskData.creator,
        taskData.time,
        thread.id,
        taskData.checkers
      );
    }

    // If this is the first checker, verify checkers after the specified delay
    if (taskData.checkers.length === 1) {
      const taskTime = new Date(taskData.time); // Make sure task time is in Date format
      const delay = calculateIranTimeDelay(taskTime);

      console.log(`Task time: ${taskTime}, Delay: ${delay} ms`);

      if (delay <= 0) {
        console.log(
          "Delay is zero or negative, verification will occur immediately."
        );
        verifyCheckers(taskId);
      } else {
        console.log(`Setting timeout for task verification in ${delay} ms`);
        setTimeout(() => {
          verifyCheckers(taskId);
        }, delay);
      }
    }
  }
}
