/**
 * Responsive Sizing Utility
 * Scales values based on screen dimensions using a moderate scale approach
 * Similar to react-native-size-matters but without external dependency
 */

import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// Standard base dimensions (mobile reference)
const BASE_WIDTH = 375; // iPhone X width
const BASE_HEIGHT = 667; // iPhone X height

/**
 * Moderate scale - scales dimensions proportionally to screen size
 * Works well for most design elements
 * @param size - The original size value
 * @param factor - Scale factor (default 0.5 for moderate scaling)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);

  return size + size * (scale - 1) * factor;
};

/**
 * Vertical scale - scales based on height only
 * Best for vertical spacing and heights
 */
export const verticalScale = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return size * scale;
};

/**
 * Horizontal scale - scales based on width only
 * Best for horizontal spacing and widths
 */
export const horizontalScale = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size * scale;
};

/**
 * Responsive font size
 * Special handling for font sizes to ensure readability
 */
export const responsiveFontSize = (size: number): number => {
  const scale = Math.min(
    SCREEN_WIDTH / BASE_WIDTH,
    SCREEN_HEIGHT / BASE_HEIGHT,
  );
  const scaledSize = size * scale;

  // Clamp font size to prevent extreme scaling on very large/small screens
  const MIN_FONT_SIZE = size * 0.8;
  const MAX_FONT_SIZE = size * 1.3;

  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, scaledSize));
};

// Export default moderateScale as it's the most commonly used
export default moderateScale;
