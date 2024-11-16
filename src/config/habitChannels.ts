// src/config.ts
export const habitChannels = {
    earlybird: '1306619415068016670',
    journaling: '1306619862323433563',
    exercise: '1306619670543208458',
    book: '1306619736653697054',
    planning: '1306619940639342724',
  } as const;
  
  export type HabitName = keyof typeof habitChannels;  