/**
 * Common styles for the app
 */

export const COLORS = {
  background: '#111618', 
  cardBackground: '#181F2A',
  cardBackgroundDarker: '#232D3F',
  primary: '#0cb9f2',
  secondary: '#283539',
  text: '#ffffff',
  textMuted: '#a2afb3',
  textFaded: '#9cb2ba',
  border: '#3b4e54',
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  achievementBg: '#1e493e',
};

export const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  xxl: 32,
  container: 16,
};

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 30,
    title: 36,
  },
  fontFamily: {
    regular: undefined, // Use system default
    medium: undefined,
    bold: undefined,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Common component styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  text: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 'bold',
  },
};

export const CARD_STYLES = {
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSizes.base,
    marginBottom: SPACING.md,
  },
  body: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },
};

export const FORM_STYLES = {
  input: {
    backgroundColor: COLORS.secondary,
    color: COLORS.text,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSizes.base,
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSizes.sm,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  error: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizes.xs,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
};
