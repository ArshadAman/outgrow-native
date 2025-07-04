import { StyleSheet } from 'react-native';
import { wp, hp, scale, moderateScale, spacing, fontSizes } from '../utils/responsive';

/**
 * Shared styles for authentication screens (Login & Signup)
 * Ensures consistent appearance and responsive design
 */

// Color constants for consistency
export const AUTH_COLORS = {
  background: '#10131a',
  cardBackground: '#181c24',
  border: '#232d3f',
  primary: '#0cb9f2',
  text: '#f5f7fa',
  textMuted: '#7e8a9a',
  error: '#ff4d4f',
  shadow: '#0cb9f2',
};

export const createAuthStyles = () => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: moderateScale(48),
  },

  // Logo styles
  logo: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(24),
    alignSelf: 'center',
    marginBottom: spacing.md,
    backgroundColor: AUTH_COLORS.cardBackground,
    borderWidth: moderateScale(2),
    borderColor: AUTH_COLORS.border,
    shadowColor: AUTH_COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },

  // Heading styles
  heading: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    fontSize: fontSizes.xl,
    textAlign: 'center',
    fontWeight: '700',
    color: AUTH_COLORS.text,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },

  // Social button styles
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xl,
    marginTop: moderateScale(18),
    height: moderateScale(45), // Standardized height
    backgroundColor: AUTH_COLORS.cardBackground,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    shadowColor: AUTH_COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(6),
    elevation: 2,
  },

  socialIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    marginRight: spacing.md,
  },

  socialButtonText: {
    fontSize: fontSizes.lg, // Standardized to 20px equivalent
    fontWeight: '600',
    color: AUTH_COLORS.text,
  },

  // Divider styles
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginTop: moderateScale(32),
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_COLORS.border,
    opacity: 0.5,
  },

  dividerText: {
    marginHorizontal: moderateScale(10),
    backgroundColor: AUTH_COLORS.background,
    color: AUTH_COLORS.textMuted,
    fontSize: scale(15),
    fontWeight: '500',
  },

  // Form styles
  form: {
    marginHorizontal: spacing.xl,
    marginTop: moderateScale(32), // Standardized form margin
  },

  label: {
    fontSize: fontSizes.base, // Standardized to 16px equivalent 
    fontWeight: '500',
    color: AUTH_COLORS.text,
    marginBottom: moderateScale(7),
  },

  input: {
    width: '100%',
    height: moderateScale(45), // Standardized input height
    backgroundColor: AUTH_COLORS.cardBackground,
    borderRadius: moderateScale(10),
    paddingHorizontal: spacing.lg,
    color: AUTH_COLORS.text,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    marginBottom: spacing.md,
    fontSize: fontSizes.sm,
  },

  errorTextFixed: {
    color: AUTH_COLORS.error,
    minHeight: moderateScale(18),
    marginBottom: spacing.sm,
    fontSize: scale(13),
  },

  // Password row styles (for login screen)
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(7),
    marginTop: spacing.md,
  },

  forgotText: {
    color: AUTH_COLORS.primary,
    fontSize: scale(15),
    fontWeight: '600',
  },

  // Button styles
  signInButtonWrapper: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },

  signInButton: {
    height: moderateScale(45), // Standardized button height
    backgroundColor: AUTH_COLORS.primary,
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AUTH_COLORS.shadow,
    shadowOpacity: 0.18,
    shadowRadius: moderateScale(8),
    elevation: 4,
  },

  signInButtonText: {
    color: AUTH_COLORS.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Sign up/Login link styles
  authSwitchWrapper: {
    marginTop: moderateScale(24), // Standardized margin
    marginBottom: moderateScale(32),
    alignItems: 'center',
  },

  authSwitchText: {
    color: AUTH_COLORS.textMuted,
    fontSize: fontSizes.base,
    fontWeight: '500',
  },

  authSwitchLink: {
    color: AUTH_COLORS.primary,
    fontSize: fontSizes.base,
    fontWeight: '700',
    marginLeft: moderateScale(2),
  },

  // Top spacing
  topSpacing: {
    height: moderateScale(32),
  },
});

// Export the styles
export const authStyles = createAuthStyles();