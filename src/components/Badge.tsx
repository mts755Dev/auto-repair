import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

type Tone = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'dark';

type Props = {
  label: string;
  tone?: Tone;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
};

export const Badge: React.FC<Props> = ({ label, tone = 'neutral', icon, style }) => {
  const { bg, fg } = getToneColors(tone);

  return (
    <View style={[styles.wrap, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={12} color={fg} style={{ marginRight: 4 }} /> : null}
      <Text style={[typography.caption, { color: fg, fontWeight: '700' }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

function getToneColors(tone: Tone): { bg: string; fg: string } {
  switch (tone) {
    case 'primary':
      return { bg: colors.primarySoft, fg: colors.primaryDark };
    case 'success':
      return { bg: colors.successSoft, fg: colors.success };
    case 'warning':
      return { bg: colors.warningSoft, fg: colors.warning };
    case 'danger':
      return { bg: colors.dangerSoft, fg: colors.danger };
    case 'info':
      return { bg: colors.infoSoft, fg: colors.info };
    case 'dark':
      return { bg: colors.black, fg: colors.white };
    case 'neutral':
    default:
      return { bg: colors.gray100, fg: colors.charcoal };
  }
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
