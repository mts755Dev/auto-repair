import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const fontFamilyMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

const base: TextStyle = {
  color: colors.ink,
  fontFamily,
};

export const typography = {
  display: {
    ...base,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    color: colors.black,
  },
  h1: {
    ...base,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
    color: colors.black,
  },
  h2: {
    ...base,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    color: colors.black,
  },
  h3: {
    ...base,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    color: colors.black,
  },
  title: {
    ...base,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700' as const,
    color: colors.ink,
    fontFamily: fontFamilyMedium,
  },
  body: {
    ...base,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: colors.charcoal,
  },
  bodyStrong: {
    ...base,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: colors.ink,
  },
  caption: {
    ...base,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    color: colors.gray700,
  },
  captionStrong: {
    ...base,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
    color: colors.ink,
  },
  overline: {
    ...base,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.1,
    textTransform: 'uppercase' as const,
    color: colors.gray700,
  },
  button: {
    ...base,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
  },
};

export type Typography = typeof typography;
