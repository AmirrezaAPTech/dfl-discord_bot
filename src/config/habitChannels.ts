// src/config.ts
export const habitChannelIds = {
  earlybird: '1306619415068016670', // Replace with actual channel IDs
  journaling: '1306619862323433563',
  exercise: '1306619670543208458',
  book: '1306619736653697054',
  planning: '1306619940639342724',
} as const;
  
  export type HabitCahnnels = keyof typeof habitChannelIds;  


export const habitIds = {
  earlybird: '6713e686237db51cf0316f12', // Replace with actual habit IDs
  journaling: '6717c1fb14e4bbed72b2f8e1',
  exercise: '6713e75f237db51cf0316f15',
  book: '6717c1eb14e4bbed72b2f8da',
  planning: '6717c1f514e4bbed72b2f8de',
} as const;
  
  export type HabitIds = keyof typeof habitIds;  

export const persianHabits = {
  earlybird: 'سحرخیزی 🌞', // Replace with actual habit IDs
  journaling: 'جورنالینگ ✍🏽',
  exercise: 'ورزش 🏋',
  book: 'کتابخوانی 📚',
  planning: 'برنامه ریزی 📝',
} as const;
  
  export type PersianHabits = keyof typeof persianHabits;  