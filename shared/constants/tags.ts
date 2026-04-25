// Priority Tags
export const PRIORITY_TAGS = {
  urgent: {
    label: "Urgent",
    icon: "fire",
  },
  important: {
    label: "Important",
    icon: "star",
  },
  normal: {
    label: "Normal",
    icon: "pin",
  },
  low: {
    label: "Low",
    icon: "moon-waning-crescent",
  },
} as const;

export type PriorityType = keyof typeof PRIORITY_TAGS;

// Category Tags
export const CATEGORY_TAGS = {
  growth: {
    label: "Growth",
    icon: "sprout",
  },
  work: {
    label: "Work",
    icon: "briefcase",
  },
  personal: {
    label: "Personal",
    icon: "home",
  },
  health: {
    label: "Health",
    icon: "heart",
  },
  deepwork: {
    label: "Deep Work",
    icon: "brain",
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
