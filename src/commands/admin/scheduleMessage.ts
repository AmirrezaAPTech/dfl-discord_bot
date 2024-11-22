import { Message } from 'discord.js';

export const scheduleMessageCommand = async (message: Message) => {
  await message.reply({
    content: 'Click the button to schedule a message:',
    components: [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 1, // Primary
            label: 'Schedule Message',
            customId: 'schedule_message',
          },
        ],
      },
    ],
  });
};
