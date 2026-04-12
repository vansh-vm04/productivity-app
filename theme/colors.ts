// ========================================
// PRIMARY BRAND COLOR
// ========================================

/** Primary brand color - used for CTAs, buttons, highlights */
export const PRIMARY = {
  main: "#0088ff",
} as const;

export const TAB = {
    inActive: "#616161",
}

// ========================================
// TEXT COLORS
// ========================================

export const TEXT = {
  /** Primary text - white */
  primary: "#FFFFFF",
  /** Secondary text - slightly dimmed */
  secondary: "rgba(255, 255, 255, 0.8)",
  /** Tertiary text - more dimmed */
  tertiary: "rgba(255, 255, 255, 0.6)",
} as const;

// ========================================
// BACKGROUND COLORS
// ========================================

export const BACKGROUND = {
  /** Secondary background surface */
  secondary: "#121212",
} as const;

// ========================================
// SURFACE COLORS
// ========================================

export const SURFACE = {
  /** Main surface for cards */
  primary: "#202020",
} as const;

// ========================================
// BORDER COLORS
// ========================================

export const BORDER = {
  /** Primary border - for main UI elements */
  primary: "#3D3D3D",
  seconday: "#696969",
} as const;

// ========================================
// TAG & BADGE COLORS
// ========================================

export const TAG = {
  /** Default tag background */
  background: "rgba(255, 255, 255, 0.15)",
  /** Tag text color */
  text: "#FFFFFF",
} as const;

// ========================================
// CARD COLOR PALETTES
// Color palettes for task cards (cycles through these)
// ========================================

export interface CardPaletteColor {
  base: string;
  glow: string;
  accent: string;
}

export const CARD_PALETTES: CardPaletteColor[] = [
  // Blue - Calm & Productivity
  {
    base: "#0F172A",
    glow: "#4586d5",
    accent: "#3B82F6",
  },
  // Purple - Premium & Futuristic
  {
    base: "#1A132F",
    glow: "#917ad3",
    accent: "#7C3AED",
  },
  // Mint Green - Fresh & Health
  {
    base: "#052E2B",
    glow: "#46a683",
    accent: "#10B981",
  },
  // Cyan - Tech & Neon
  {
    base: "#083344",
    glow: "#2eacc0",
    accent: "#06B6D4",
  },
  // Pink - Modern & Creative
  {
    base: "#2A0E1E",
    glow: "#ae3774",
    accent: "#EC4899",
  },
  // Orange - Warm Highlight
  {
    base: "#2C1A0E",
    glow: "#FDBA74",
    accent: "#FB923C",
  },
] as const;

// ========================================
// UTILITY COLORS
// ========================================

export const UTILITY = {
  /** Transparent black overlays */
  transparentBlack30: "rgba(0, 0, 0, 0.3)",
} as const;

export const MODAL = {
  /** Modal background overlay */
  overlay: "rgba(0, 0, 0, 0.5)",
}