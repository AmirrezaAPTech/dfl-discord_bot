import { Message } from 'discord.js';

export const sendMessageCommand = async (message: Message) => {
  await message.reply({
    content: 'Click the button to send a message:',
    components: [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 1, // Primary
            label: 'Send Message',
            customId: 'send_message',
          },
        ],
      },
    ],
  });
};
