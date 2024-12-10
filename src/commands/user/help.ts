import { Message } from "discord.js";

export const helpCommand = async (message: Message) => {
  await message.reply({
    content: "اینا دستوراتی هستند که میتونی ازشون استفاده کنی:",
    components: [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 1, // Primary
            label: "جورنالینگ ناشناس",
            customId: "secret_journaling",
          },
          {
            type: 2, // Button
            style: 1, // Primary
            label: "ثبت ایده",
            customId: "send_idea",
          },
        ],
      },
    ],
  });
};
