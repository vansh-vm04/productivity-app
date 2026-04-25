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
    icon: "heart",
  },
  study: {
    label: "Study",
    icon: "book-open",
  },
  fitness: {
    label: "Fitness",
    icon: "dumbbell",
  },
  productivity: {
    label: "Productivity",
    icon: "lightning-bolt",
  },
  lifestyle: {
    label: "Lifestyle",
    icon: "star",
  },
} as const;

export type HabitCategoryType = keyof typeof HABIT_CATEGORIES;

// Habit Types
export const HABIT_TYPES = {
  binary: {
    label: "Binary",
    description: "Do this habit daily",
    icon: "check-circle",
  },
  count: {
    label: "Count-based",
    description: "Track a target count",
    icon: "counter",
  },
  time: {
    label: "Time-based",
    description: "Track duration",
    icon: "timer",
  },
} as const;

export type HabitTypeType = keyof typeof HABIT_TYPES;

// Frequency Types
export const FREQUENCY_TYPES = {
  daily: {
    label: "Daily",
    icon: "calendar",
  },
  weekdays: {
    label: "Weekdays",
    icon: "calendar-week",
  },
  specific_days: {
    label: "Specific Days",
    icon: "calendar-multiple",
  },
  custom: {
    label: "Custom",
    icon: "cog",
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
