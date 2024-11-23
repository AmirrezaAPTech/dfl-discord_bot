import { Message } from "discord.js";

export const sendIdeaCommand = async (message: Message) => {
  await message.reply({
    content: "برای ثبت ایده رو دکمه ی پایین کلیک کن.",
    components: [
      {
        type: 1, // Action Row
        components: [
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
