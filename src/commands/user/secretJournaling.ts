import { Message } from 'discord.js';

export const secretJournalingCommand = async (message: Message) => {
  await message.reply({
    content: 'روی دکمه کلیک کن و جورنالینگه ناشناستو بفرست',
    components: [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 1, // Primary
            label: 'جورنالینگ ناشناس',
            customId: 'secret_journaling',
          },
        ],
      },
    ],
  });
};