import { Dimensions } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro as reference)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Width percentage calculation
 * @param {number} percentage - percentage of screen width (0-100)
 * @returns {number} calculated width
 */
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
};

/**
 * Height percentage calculation
 * @param {number} percentage - percentage of screen height (0-100)
 * @returns {number} calculated height
 */
export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
};

/**
 * Scale font size based on screen width
 * @param {number} size - base font size
 * @returns {number} scaled font size
 */
export const scale = (size) => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scaleRatio;
  return Math.round(newSize);
};

/**
 * Scale dimensions based on screen height
 * @param {number} size - base size
 * @returns {number} scaled size
 */
export const verticalScale = (size) => {
  const scaleRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scaleRatio;
  return Math.round(newSize);
};

/**
 * Moderate scale that considers both width and a resize factor
 * @param {number} size - base size
 * @param {number} factor - resize factor (default 0.5)
 * @returns {number} moderately scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size + (scaleRatio - 1) * factor;
  return Math.round(newSize);
};

/**
 * Get responsive dimensions for common use cases
 */
export const getResponsiveDimensions = () => ({
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
});

/**
 * Responsive spacing based on screen size
 */
export const spacing = {
  xs: moderateScale(2),
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(16),
  xl: moderateScale(24),
  xxl: moderateScale(32),
  xxxl: moderateScale(48),
};

/**
 * Responsive font sizes
 */
export const fontSizes = {
  xs: scale(12),
  sm: scale(14),
  base: scale(16),
  md: scale(18),
  lg: scale(20),
  xl: scale(24),
  xxl: scale(30),
  title: scale(36),
};