import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  active?: boolean;
  tone?: 'primary' | 'dark' | 'neutral';
  style?: ViewStyle;
};

export const IconTile: React.FC<Props> = ({ icon, label, onPress, active, tone = 'neutral', style }) => {
  const toneStyles = getTone(tone, active);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.wrap,
      { backgroundColor: toneStyles.bg, borderColor: toneStyles.border, opacity: pressed ? 0.9 : 1 },
      style,
    ]}>
      <View style={[styles.iconWrap, { backgroundColor: toneStyles.iconBg }]}>
        <Ionicons name={icon} size={22} color={toneStyles.iconFg} />
      </View>
      <Text style={[typography.captionStrong, { marginTop: spacing.s, color: toneStyles.text, textAlign: 'center' }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
};

function getTone(tone: 'primary' | 'dark' | 'neutral', active?: boolean) {
  if (active) {
    return {
      bg: colors.primary,
      border: colors.primary,
      iconBg: 'rgba(255,255,255,0.18)',
      iconFg: colors.white,
      text: colors.white,
    };
  }
  switch (tone) {
    case 'primary':
      return {
        bg: colors.primarySoft,
        border: colors.primarySoft,
        iconBg: colors.white,
        iconFg: colors.primaryDark,
        text: colors.ink,
      };
    case 'dark':
      return {
        bg: colors.black,
        border: colors.black,
        iconBg: 'rgba(255,255,255,0.12)',
        iconFg: colors.white,
        text: colors.white,
      };
    case 'neutral':
    default:
      return {
        bg: colors.white,
        border: colors.border,
        iconBg: colors.gray100,
        iconFg: colors.ink,
        text: colors.ink,
      };
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.l,
    borderRadius: radii.l,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 112,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
