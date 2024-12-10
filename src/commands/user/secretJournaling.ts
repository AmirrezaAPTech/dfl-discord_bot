import { Message } from "discord.js";

export const secretJournalingCommand = async (message: Message) => {
  await message.reply({
    content: "برای جورنالینگ ناشناس بزن روی دکمه زیر",
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
        ],
      },
    ],
  });
};
