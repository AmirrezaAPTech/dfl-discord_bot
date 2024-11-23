// src/config.ts
export const habitChannelIds = {
  earlybird: "1292823423453499462", // Replace with actual channel IDs
  journaling: "1292828193320865792",
  exercise: "1292826505906360332",
  book: "1292827841477742612",
  planning: "1292883432593948724",
} as const;

export type HabitCahnnels = keyof typeof habitChannelIds;

export const habitIds = {
  earlybird: "6713e686237db51cf0316f12", // Replace with actual habit IDs
  journaling: "6717c1fb14e4bbed72b2f8e1",
  exercise: "6713e75f237db51cf0316f15",
  book: "6717c1eb14e4bbed72b2f8da",
  planning: "6717c1f514e4bbed72b2f8de",
} as const;

export type HabitIds = keyof typeof habitIds;

export const persianHabits = {
  earlybird: "سحرخیزی 🌞", // Replace with actual habit IDs
  journaling: "جورنالینگ ✍🏽",
  exercise: "ورزش 🏋",
  book: "کتابخوانی 📚",
  planning: "برنامه ریزی 📝",
} as const;

export type PersianHabits = keyof typeof persianHabits;
