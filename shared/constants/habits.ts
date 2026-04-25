export type HabitPeriod = "today" | "weekly" | "monthly" | "overall";

export interface HabitPeriodOption {
  key: HabitPeriod;
  label: string;
}

export const HABIT_PERIODS: HabitPeriodOption[] = [
  { key: "today", label: "Today" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "overall", label: "Overall" },
];

// Habit Categories
export const HABIT_CATEGORIES = {
  health: {
    label: "Health",
    emoji: "❤️",
  },
  study: {
    label: "Study",
    emoji: "📚",
  },
  fitness: {
    label: "Fitness",
    emoji: "💪",
  },
  productivity: {
    label: "Productivity",
    emoji: "⚡",
  },
  lifestyle: {
    label: "Lifestyle",
    emoji: "🌟",
  },
} as const;

export type HabitCategoryType = keyof typeof HABIT_CATEGORIES;

// Habit Types
export const HABIT_TYPES = {
  binary: {
    label: "Binary",
    description: "Do this habit daily",
    emoji: "✅",
  },
  count: {
    label: "Count-based",
    description: "Track a target count",
    emoji: "🔢",
  },
  time: {
    label: "Time-based",
    description: "Track duration",
    emoji: "⏱️",
  },
} as const;

export type HabitTypeType = keyof typeof HABIT_TYPES;

// Frequency Types
export const FREQUENCY_TYPES = {
  daily: {
    label: "Daily",
    emoji: "📅",
  },
  weekdays: {
    label: "Weekdays",
    emoji: "📆",
  },
  specific_days: {
    label: "Specific Days",
    emoji: "🗓️",
  },
  custom: {
    label: "Custom",
    emoji: "⚙️",
  },
} as const;

export type FrequencyTypeType = keyof typeof FREQUENCY_TYPES;

// Days of the week
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Emoji picker for habits
export const HABIT_EMOJIS = [
  "💧", // water
  "🏃", // running
  "📖", // reading
  "🧘", // meditation
  "🍎", // eating
  "💤", // sleep
  "💪", // exercise
  "🎵", // music
  "🖊️", // writing
  "🧠", // thinking
  "🏋️", // lifting
  "🚴", // biking
  "🧑‍💻", // coding
  "🎯", // goal
  "📝", // notes
  "🔬", // studying
  "🎨", // creative
  "🚶", // walking
  "⛹️", // basketball
  "🏊", // swimming
  "🪗", // yoga
  "🥗", // healthy food
  "😴", // sleep
  "📱", // phone less
  "☕", // coffee
  "🌅", // sunrise
  "🔥", // motivation/fire
  "⚡", // energy
  "🌱", // growth
  "🌿", // nature
  "🏆", // achievement
  "⭐", // star
  "💎", // gem/valuable
  "🎬", // movies
  "🎓", // learning/education
  "🏞️", // landscape/nature
  "🧗", // climbing
  "🤸", // gymnastics
  "💆", // massage/relaxation
  "🛀", // bath/relaxation
  "🍜", // noodles/meal
  "🥤", // drink
  "🍵", // tea
  "💊", // vitamins/health
  "🏥", // health/medical
  "🧬", // science
  "🎪", // circus/fun
  "🎭", // theater/drama
  "🎤", // singing/performance
  "🎧", // headphones/music
  "🎸", // guitar
  "🎹", // piano
  "✍️", // writing/journaling
  "💭", // thinking/reflection
  "🧩", // puzzle/problem-solving
  "🖼️", // painting/art
  "🖌️", // brush/art
  "📷", // photography
  "📸", // camera
  "🎥", // video/film
  "🌍", // world/travel
  "✈️", // travel/adventure
  "🧳", // travel/packing
  "🗺️", // maps/planning
  "⏱️", // timer
  "⏰", // alarm/reminder
  "📅", // calendar
  "📊", // tracking/statistics
  "📈", // progress/growth
  "🎁", // rewards/gifts
  "🌟", // sparkle/special
  "💝", // love/self-care
  "🦋", // transformation
  "🌸", // beauty/nature
  "🌺", // flower
  "🌻", // sunflower/happiness
  "🌙", // night/sleep
  "☀️", // sun/energy
  "❄️", // winter/fresh
  "🔔", // notification/reminder
  "🎯", // focus/target
  "🚀", // speed/progress
  "💫", // sparkle/magic
  "🌈", // rainbow/positivity
  "🤝", // connection/social
  "👥", // community
  "🧘‍♀️", // yoga/mindfulness
  "🏅", // medal/achievement
  "🥇", // gold/first place
  "💪", // strength
  "🦾", // strong/resilient
  "🧠", // intelligence
  "💡", // ideas/innovation
  "🔐", // security/protection
  "🛡️", // defense/protection
] as const;
