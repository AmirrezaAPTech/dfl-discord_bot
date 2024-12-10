import { Message } from "discord.js";

export const scheduleMessageCommand = async (message: Message) => {
  await message.reply({
    content: "برای ست کردن مسیج رو دکمه زیر کلیک کن.",
    components: [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 1, // Primary
            label: "Schedule Message",
            customId: "schedule_message",
          },
        ],
      },
    ],
  });
};
