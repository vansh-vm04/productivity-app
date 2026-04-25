import { Background } from "@react-navigation/elements";
import { useSyncExternalStore } from "react";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark";

// ========================================
// THEME COLOR CONTRACT
// ========================================

export interface AppThemeColors {
  PRIMARY: {
    main: string;
  };
  TAB: {
    background: string;
    inActive: string;
  };
  TEXT: {
    primary: string;
    secondary: string;
    tertiary: string;
    button: string;
    capsules: string;
    capsulesActive: string;
  };
  BACKGROUND: {
    secondary: string;
  };
  SURFACE: {
    primary: string;
  };
  BORDER: {
    primary: string;
    secondary: string;
    // Keep typo key for backward compatibility in existing imports.
    seconday: string;
  };
  MODAL: {
    overlay: string;
  };
  TAG: {
    background: string;
    text: string;
  };
  UTILITY: {
    transparentBlack30: string;
  };
  PROGRESS: {
    background: string;
  };
  BUTTON: {
    background: string;
    text: string;
  };
  SCREEN: {
    gradientStart: string;
    gradientEnd: string;
  };
};

const DARK_THEME: AppThemeColors = {
  PRIMARY: {
    main: "#0088ff",
  },
  TAB: {
    background: "#000000",
    inActive: "#616161",
  },
  TEXT: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.8)",
    tertiary: "rgba(255, 255, 255, 0.6)",
    button: "#ffffff",
    capsules: "rgba(255, 255, 255, 0.8)",
    capsulesActive: "#ffffff",
  },
  BACKGROUND: {
    secondary: "#121212",
  },
  SURFACE: {
    primary: "#202020",
  },
  BORDER: {
    primary: "#3D3D3D",
    secondary: "#696969",
    seconday: "#696969",
  },
  MODAL: {
    overlay: "#0000007e",
  },
  TAG: {
    background: "rgba(255, 255, 255, 0.15)",
    text: "#FFFFFF",
  },
  UTILITY: {
    transparentBlack30: "rgba(0, 0, 0, 0.3)",
  },
  PROGRESS: {
    background: "rgba(0, 0, 0, 0.3)"
  },
  BUTTON: {
    background: "#ffffff",
    text:"#000000"
    },
    SCREEN: {
      gradientStart: "#9ccaff",
      gradientEnd: "#000000",
    }
};

const LIGHT_THEME: AppThemeColors = {
  PRIMARY: {
    main: "#0068d9",
  },
  TAB: {
    background: "#ffffff",
    inActive: "#8A8A8A",
  },
  TEXT: {
    primary: "#111111",
    secondary: "rgba(17, 17, 17, 0.78)",
    tertiary: "rgba(17, 17, 17, 0.58)",
    button: "#FFFFFF",
    capsules: "rgba(17, 17, 17, 0.78)",
    capsulesActive: "#ffffff",
  },
  BACKGROUND: {
    secondary: "#F5F7FA",
  },
  SURFACE: {
    primary: "#FFFFFF",
  },
  BORDER: {
    primary: "#D6D9DE",
    secondary: "#B6BCC6",
    seconday: "#B6BCC6",
  },
  MODAL: {
    overlay: "#0000004d",
  },
  TAG: {
    background: "rgba(255, 255, 255, 0.57)",
    text: "#111111",
  },
  UTILITY: {
    transparentBlack30: "rgba(0, 0, 0, 0.3)",
  },
  PROGRESS: {
    background: "#ededed"
  },
  BUTTON: {
    background: "#ffffff",
    text:"#000000"
  },
  SCREEN: {
    gradientStart: "#9ccaff",
    gradientEnd: "#ffffff",
  }
};

export const THEME_COLORS: Record<ThemeMode, AppThemeColors> = {
  dark: DARK_THEME,
  light: LIGHT_THEME,
};

// ========================================
// GLOBAL MODE STORE + SINGLE SWITCH HOOK
// ========================================

let currentMode: ThemeMode =
  Appearance.getColorScheme() === "light" ? "light" : "light";

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const getThemeMode = (): ThemeMode => currentMode;

export const setThemeMode = (mode: ThemeMode) => {
  if (mode === currentMode) {
    return;
  }
  currentMode = mode;
  emit();
};

export const toggleThemeMode = () => {
  setThemeMode(currentMode === "dark" ? "light" : "dark");
};

export const getThemeColors = (
  mode: ThemeMode = currentMode,
): AppThemeColors => {
  return THEME_COLORS[mode];
};

export const useAppThemeMode = () => {
  const mode = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    getThemeMode,
    getThemeMode,
  );

  return {
    mode,
    isDark: mode === "dark",
    isLight: mode === "light",
    colors: getThemeColors(mode),
    setMode: setThemeMode,
    toggleMode: toggleThemeMode,
  };
};

// ========================================
// BACKWARD-COMPAT EXPORTS
// Existing imports keep working, now reading current mode.
// ========================================

const createSectionProxy = <K extends keyof AppThemeColors>(
  key: K,
): AppThemeColors[K] => {
  return new Proxy({} as AppThemeColors[K], {
    get(_, prop: string) {
      return (getThemeColors()[key] as Record<string, string>)[prop];
    },
  });
};

/** Primary brand color - used for CTAs, buttons, highlights */
export const PRIMARY = createSectionProxy("PRIMARY");

export const TAB = createSectionProxy("TAB");

export const TEXT = createSectionProxy("TEXT");

export const BACKGROUND = createSectionProxy("BACKGROUND");

export const SURFACE = createSectionProxy("SURFACE");

export const BORDER = createSectionProxy("BORDER");

export const MODAL = createSectionProxy("MODAL");

export const TAG = createSectionProxy("TAG");

export const UTILITY = createSectionProxy("UTILITY");

export const PROGRESS = createSectionProxy("PROGRESS");

export const BUTTON = createSectionProxy("BUTTON");

export const SCREEN = createSectionProxy("SCREEN");

// ========================================
// CARD COLOR PALETTES
// Color palettes for task cards (cycles through these)
// ========================================

export interface CardPaletteColor {
  base: string;
  glow: string;
  accent: string;
}

export interface NotePaletteColor {
  base: string;
  accent: string;
}

const DARK_CARD_PALETTES: CardPaletteColor[] = [
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

const LIGHT_CARD_PALETTES: CardPaletteColor[] = [
  // Blue - Calm & Productivity
  {
    base: "#EAF3FF",
    glow: "#60A5FA",
    accent: "#2563EB",
  },
  // Purple - Premium & Futuristic
  {
    base: "#F2ECFF",
    glow: "#A78BFA",
    accent: "#7C3AED",
  },
  // Mint Green - Fresh & Health
  {
    base: "#E9FBF3",
    glow: "#34D399",
    accent: "#059669",
  },
  // Cyan - Tech & Neon
  {
    base: "#E6F9FC",
    glow: "#22D3EE",
    accent: "#0891B2",
  },
  // Pink - Modern & Creative
  {
    base: "#FEEAF4",
    glow: "#F472B6",
    accent: "#DB2777",
  },
  // Orange - Warm Highlight
  {
    base: "#FFF3E8",
    glow: "#FDBA74",
    accent: "#EA580C",
  },
] as const;

const CARD_PALETTES_BY_THEME: Record<ThemeMode, CardPaletteColor[]> = {
  dark: DARK_CARD_PALETTES,
  light: LIGHT_CARD_PALETTES,
};

export const getCardPalettes = (
  mode: ThemeMode = currentMode,
): CardPaletteColor[] => {
  return CARD_PALETTES_BY_THEME[mode];
};

// Keep old import usage (`CARD_PALETTES[index]`) while making it theme-aware.
export const CARD_PALETTES = new Proxy([] as CardPaletteColor[], {
  get(_, prop: string | symbol) {
    const palettes = getCardPalettes();
    const value = Reflect.get(palettes, prop);
    return typeof value === "function" ? value.bind(palettes) : value;
  },
});

const DARK_NOTE_PALETTES: NotePaletteColor[] = [
  { base: "#202020", accent: "#374151" },
  { base: "#1F2937", accent: "#4B5563" },
  { base: "#1E1B4B", accent: "#6366F1" },
  { base: "#3F1D2E", accent: "#BE185D" },
  { base: "#102A43", accent: "#2563EB" },
  { base: "#1A2E22", accent: "#059669" },
];

const LIGHT_NOTE_PALETTES: NotePaletteColor[] = [
  { base: "#FFF8E8", accent: "#F59E0B" },
  { base: "#F5F3FF", accent: "#7C3AED" },
  { base: "#ECFDF5", accent: "#10B981" },
  { base: "#EFF6FF", accent: "#3B82F6" },
  { base: "#FFF1F2", accent: "#F43F5E" },
  { base: "#F0F9FF", accent: "#06B6D4" },
];

const NOTE_PALETTES_BY_THEME: Record<ThemeMode, NotePaletteColor[]> = {
  dark: DARK_NOTE_PALETTES,
  light: LIGHT_NOTE_PALETTES,
};

export const getNotePalettes = (
  mode: ThemeMode = currentMode,
): NotePaletteColor[] => {
  return NOTE_PALETTES_BY_THEME[mode];
};

export const NOTE_CARD_PALETTES = new Proxy([] as NotePaletteColor[], {
  get(_, prop: string | symbol) {
    const palettes = getNotePalettes();
    const value = Reflect.get(palettes, prop);
    return typeof value === "function" ? value.bind(palettes) : value;
  },
});
