// Priority Tags
export const PRIORITY_TAGS = {
  urgent: {
    label: "Urgent",
    emoji: "🔥",
  },
  important: {
    label: "Important",
    emoji: "⭐",
  },
  normal: {
    label: "Normal",
    emoji: "📌",
  },
  low: {
    label: "Low",
    emoji: "💤",
  },
} as const;

export type PriorityType = keyof typeof PRIORITY_TAGS;

// Category Tags
export const CATEGORY_TAGS = {
  growth: {
    label: "Growth",
    emoji: "🌱",
  },
  work: {
    label: "Work",
    emoji: "💼",
  },
  personal: {
    label: "Personal",
    emoji: "🏠",
  },
  health: {
    label: "Health",
    emoji: "❤️",
  },
  deepwork: {
    label: "Deep Work",
    emoji: "🧠",
  },
} as const;

export type CategoryType = keyof typeof CATEGORY_TAGS;

// Get tag display object
export const getPriorityTag = (priority: PriorityType) => {
  return PRIORITY_TAGS[priority];
};

export const getCategoryTag = (category: CategoryType) => {
  return CATEGORY_TAGS[category];
};
